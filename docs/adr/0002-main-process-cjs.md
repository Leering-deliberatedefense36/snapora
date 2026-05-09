# 0002 — Main process is CJS, not ESM

**Date:** 2026-05-09
**Status:** Accepted (revisit when Electron stabilizes ESM main)

## Context

Electron 28+ supports ESM in the main process. Modern Node.js, Vite, and most of the JS ecosystem are moving to ESM. Setting `"type": "module"` in `package.json` would make the project feel current and unblock top-level `await`.

While scaffolding, we hit a hard crash on the very first import:

```
TypeError: Cannot read properties of undefined (reading 'exports')
    at cjsPreparseModuleExports (node:internal/modules/esm/translators:379)
```

Reproduced with a one-line program: `import { app } from 'electron'`. This is the well-known [Electron ESM CJS-preparser bug](https://github.com/electron/electron/issues/40221) on Electron 33's bundled Node 20.18.

## Decision

Main process is built and shipped as **CJS**. There is no `"type": "module"` at the package.json root. Renderer remains ESM (Vite handles it independently).

## Consequences

**Enables:**

- Stable runtime — no preparser crashes on `electron` or other CJS deps.
- We can use `__dirname` directly in main process source (no `fileURLToPath(import.meta.url)` dance).
- Most CJS-friendly libraries (`electron-log`, `electron-updater`, `better-sqlite3`) work without ceremony.

**Costs:**

- Pure-ESM packages (`electron-store@10`, etc.) cannot be `require()`'d from main. We've already replaced `electron-store` with a 30-line homegrown JSON store at `src/main/storage/prefs.ts`. For other ESM-only deps, dynamic `import()` is the workaround.
- No top-level `await` in the main process — wrap in `async` IIFE if needed.
- Root-level config files needed explicit extensions: `eslint.config.mjs` (ESM), `postcss.config.cjs` (CJS).

## Revisit when

Electron releases a confirmed fix for #40221 and we've verified ESM main works on a non-trivial sample app. Then we can flip `"type": "module"` and migrate.

## Alternatives considered

- **Output main as `.cjs` while keeping `"type": "module"` at root** — works, but spreads complexity (`package.json` `"main"` points to `.cjs`; tooling has to track both extensions). Less clean than just dropping `"type": "module"`.
- **`createRequire` workaround in ESM** — bypasses the ESM/CJS preparser for one specific import but doesn't help the static `import { app } from 'electron'` line, which is the actual crash site.
- **Downgrade Electron** — might dodge the bug but loses security fixes and modern API access. Not worth it.
