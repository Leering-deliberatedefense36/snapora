# Contributing to Snapora

Thanks for your interest. Snapora is an open project — issues, design discussions, and PRs are all welcome.

## Code of conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you agree to abide by it.

## Clean-room provenance — please read

Snapora is an **open-source alternative** to commercial screenshot tools. To keep the project legally distributable and contributor-safe, all contributions must be **clean-room**:

- ✅ Built from public documentation (Electron, macOS, web standards) and behavior of bundled OSS tools (ffmpeg, tesseract, screencapture)
- ✅ Built from publicly documented features of comparable apps (vendor feature pages)
- ✅ Written by you, or adapted from another OSS project with a compatible license (attribute it)
- ❌ **NOT** copied, transcribed, or adapted from decompiled/disassembled commercial software
- ❌ **NOT** derived from leaked source code

By opening a PR, you confirm your contribution meets the above. If a maintainer suspects tainted provenance, the PR will be closed.

## Developer setup

```bash
git clone https://github.com/forgemoss/Snapora.git
cd Snapora
npm install
npm run dev
```

`npm run dev` starts `electron-vite` with hot-module reload for the renderer and auto-restart for the main process.

### What runs where

- **Main process** (`src/main/`) — Node.js context. Owns tray, global shortcuts, child processes (screencapture/ffmpeg), file I/O, IPC handlers. No DOM.
- **Preload** (`src/preload/`) — runs before the renderer with limited Node access; exposes a typed API to the renderer via `contextBridge`. Renderer code may not import from `electron`.
- **Renderer** (`src/renderer/`) — React + Tailwind UI. Talks to main only through the preload API. No `nodeIntegration`.

If you find yourself wanting to import `electron` or `node:fs` from `src/renderer/`, that's a sign the work belongs in the main process — add an IPC channel and call it through preload.

## Permissions during development

The first time you run `npm run dev` and try to capture, macOS will prompt for **Screen Recording** permission. Grant it, then **quit and relaunch** Snapora — macOS only applies the new TCC grant after restart.

If you re-sign or change Electron versions, the prompt may re-appear. This is expected.

## Running tests

```bash
npm test         # vitest unit tests (Linux-fast, runs everywhere)
npm run e2e      # Playwright end-to-end (launches Electron)
```

## Code style

```bash
npm run format   # Prettier — auto-fixes
npm run lint     # ESLint — required to pass before merge
npm run typecheck
```

CI runs all three on every PR.

## Conventions

These are the rules our existing code follows. Deviations need a reason in the PR description.

### File and directory naming

| What              | Convention                                | Example                        |
| ----------------- | ----------------------------------------- | ------------------------------ |
| Directories       | `lowercase`, kebab-free                   | `src/main/capture/`            |
| TS modules        | `camelCase.ts`                            | `screenshot.ts`, `tcc.ts`      |
| React components  | `PascalCase.tsx`, one component per file  | `Editor.tsx`, `FirstRun.tsx`   |
| HTML entry points | `kebab-case.html`                         | `first-run.html`               |
| Test files        | `*.test.ts` next to source or in `tests/` | `tests/unit/types.test.ts`     |
| ADRs              | `NNNN-kebab-title.md` in `docs/adr/`      | `0001-stack-electron-react.md` |

### Code naming

| Construct                  | Convention             | Example                                          |
| -------------------------- | ---------------------- | ------------------------------------------------ |
| Variables, functions       | `camelCase`            | `takeScreenshot`, `cached`                       |
| React components           | `PascalCase`           | `Editor`, `Settings`                             |
| Types, interfaces, enums   | `PascalCase`           | `CaptureMode`, `AppPreferences`                  |
| True constants (immutable) | `SCREAMING_SNAKE_CASE` | `SCREENCAPTURE_BIN`, `DEFAULT_PREFERENCES`       |
| Module-level mutable state | `camelCase`            | `let editorWindow: BrowserWindow \| null = null` |
| Booleans                   | `is/has/should` prefix | `isLoading`, `hasGranted`, `shouldShow`          |
| Event handlers (React)     | `handleX` or `onX`     | `handleClick`, `onCaptureClick`                  |

### IPC channels

Use the constants in [src/shared/ipc.ts](src/shared/ipc.ts) — never inline strings. Channel names are namespaced with `:` between scope and action: `'capture:start'`, `'preferences:get'`. When you add a channel, also add the matching method to `SnaporaApi` and the preload bridge.

### Path imports

Use the path aliases configured in `tsconfig.*.json`:

| Alias         | Resolves to      | Use from               |
| ------------- | ---------------- | ---------------------- |
| `@main/*`     | `src/main/*`     | main process only      |
| `@preload/*`  | `src/preload/*`  | main process / preload |
| `@renderer/*` | `src/renderer/*` | renderer only          |
| `@shared/*`   | `src/shared/*`   | anywhere               |

Relative imports (`../../`) are fine for sibling files inside the same module; aliases are for cross-module imports.

### Comments

Match the [project guideline](README.md): default to no comments. Add one when the _why_ is non-obvious — a workaround, a hidden invariant, a macOS quirk. Don't comment what the code does (the names are for that). Don't reference past PRs or current task IDs (those rot).

### Branch naming

Optional but recommended:

```
feat/<area>-<short-description>      e.g. feat/capture-scrolling
fix/<area>-<short-description>       e.g. fix/editor-arrow-rescale
chore/<short-description>            e.g. chore/bump-electron-34
docs/<short-description>             e.g. docs/architecture-update
```

## Commit messages

We follow [Conventional Commits](https://www.conventionalcommits.org):

```
feat(capture): add scrolling area selection
fix(editor): arrows no longer drift on rescale
docs: clarify screen-recording permission flow
```

Common types: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`.

## Pull requests

- Open against `main`.
- Include a description of the change and a screen recording/screenshot for any UI work.
- Keep PRs focused — one feature or fix per PR.
- Don't bump the version or edit `CHANGELOG.md` — maintainers handle release notes.

## Reporting issues

Use the issue templates. For security reports, follow [SECURITY.md](SECURITY.md) — do not open a public issue.

## License

By contributing, you agree your contribution will be licensed under the [MIT License](LICENSE).
