# Snapora Architecture

This is the long-form companion to the README's brief overview. Read this before working in the main process or designing a new IPC surface.

## Process model

Electron splits the app across three JavaScript runtimes. We honor that split rigorously — IPC is the only path between them.

```
┌──────────────────────────────────────────────────────────────┐
│  Main process (Node.js — src/main/)                          │
│  - Owns the OS surfaces: tray, hotkeys, file I/O             │
│  - Spawns child processes (screencapture, ffmpeg, tesseract) │
│  - Holds the BrowserWindow refs (editor, settings, HUD)      │
│  - Registers ipcMain handlers in src/main/ipc/handlers.ts    │
└──────────────────────────────────────────────────────────────┘
                          ▲
                          │ contextBridge / ipcRenderer.invoke
                          ▼
┌──────────────────────────────────────────────────────────────┐
│  Preload (src/preload/)                                      │
│  - Runs before each renderer with restricted Node access     │
│  - Exposes the typed `window.snapora` API to the renderer    │
│  - This is the SECURITY BOUNDARY                             │
└──────────────────────────────────────────────────────────────┘
                          ▲
                          │ window.snapora.*
                          ▼
┌──────────────────────────────────────────────────────────────┐
│  Renderer (src/renderer/)                                    │
│  - React 19 + Tailwind v4                                    │
│  - Multiple HTML entries (editor / settings / first-run)     │
│  - SANDBOXED, no nodeIntegration                             │
│  - Talks to main only via window.snapora.*                   │
└──────────────────────────────────────────────────────────────┘
```

The three layers communicate through `src/shared/` — types and IPC channel constants imported by both sides so a typo is a compile error.

## Module bundling

`electron-vite` builds three bundles:

| Bundle   | Source                                                       | Output                 | Format                 |
| -------- | ------------------------------------------------------------ | ---------------------- | ---------------------- |
| Main     | `src/main/index.ts`                                          | `out/main/index.js`    | **CJS** (see ADR-0002) |
| Preload  | `src/preload/index.ts`                                       | `out/preload/index.js` | CJS                    |
| Renderer | `src/renderer/{editor,settings,first-run}.html` + entry .tsx | `out/renderer/...`     | ESM (Vite default)     |

**Externalized deps** (not bundled, resolved at runtime via `node_modules/`):
all dependencies in `package.json` `dependencies` (electron-log, electron-updater, etc.). This is `electron-vite`'s `externalizeDepsPlugin()` behavior.

**Bundled deps**: nothing. `devDependencies` aren't shipped at all.

## The capture pipeline

```
User presses ⌘⇧2 in any app
    │
    ▼
globalShortcut handler in src/main/shortcuts/index.ts
    │
    ▼
takeScreenshot() in src/main/capture/screenshot.ts
    │
    ▼
spawn /usr/sbin/screencapture -i -t png /path/to/Snapora\ TIMESTAMP.png
    │  (macOS shows its own selection HUD)
    │
    ▼
File written → optionally copied to clipboard via Electron's nativeImage + clipboard
    │
    ▼
showEditorWithImage(filePath) → BrowserWindow.send IPC.editor.onImageReady
    │
    ▼
Renderer's Editor component renders <img src="file://...">
```

Recording (v0.4) follows the same shape but bundled `ffmpeg` replaces `screencapture`, and the file is written incrementally. OCR (v0.5) uses bundled `tesseract` with the same shell-out pattern.

## Adding an IPC channel

1. Add a string constant under the right namespace in [src/shared/ipc.ts](../src/shared/ipc.ts).
2. Add a method to the `SnaporaApi` interface in the same file (so the renderer is typed).
3. Implement the method on the preload bridge in [src/preload/index.ts](../src/preload/index.ts).
4. Register the handler in [src/main/ipc/handlers.ts](../src/main/ipc/handlers.ts).
5. Use it from the renderer: `window.snapora.<your method>()`.

If a renderer file ever needs to import from `electron` or `node:fs`, that's a sign the work belongs in the main process — add an IPC channel instead.

## Window topology

| Window                  | Purpose                                      | Lifetime                                |
| ----------------------- | -------------------------------------------- | --------------------------------------- |
| Editor                  | Shows captured image, annotation tools       | Created lazily on first capture, reused |
| Settings                | Preferences, hotkey config, upload providers | Created on demand, destroyed on close   |
| First-run               | Permission wizard                            | Shown once on first launch              |
| Pinned overlays (v0.5)  | Floating screenshots                         | One per pinned image                    |
| Quick-access HUD (v0.5) | Post-capture floating thumbnail              | Shown for ~5s, dismissed automatically  |

We're aggressive about _reusing_ windows (`getOrCreateEditorWindow()` in [src/main/windows/editor.ts](../src/main/windows/editor.ts)) because each `BrowserWindow` carries Chromium memory cost.

## Storage

| What                    | Where                                                 | Why                              |
| ----------------------- | ----------------------------------------------------- | -------------------------------- |
| User preferences        | `<userData>/preferences.json`                         | Plain JSON, simple, version-able |
| Capture history (v0.2+) | `<userData>/snapora.db` (SQLite via `better-sqlite3`) | Querying & retention             |
| Logs                    | `<userData>/logs/main.log` (electron-log)             | User-shareable for bug reports   |

`<userData>` resolves to `~/Library/Application Support/snapora/` on macOS.

## Permissions (TCC)

`src/main/permissions/tcc.ts` wraps Electron's `systemPreferences` API. It can:

- Check status for screen-recording / mic / camera / accessibility
- Request mic/camera (Apple permits programmatic prompts)
- Open System Settings deeplinks for screen-recording (no programmatic prompt)

**Macroscopic gotcha:** Screen Recording grants only take effect after **Quit and relaunch**. This is a macOS limitation. The first-run wizard accounts for it; subsequent grant flips do too.

## Security posture

- Renderer is **sandboxed** (`sandbox: true`)
- `contextIsolation: true` — renderer cannot access Electron internals
- `nodeIntegration: false` — no `require()` from renderer
- All capabilities exposed via the preload's `contextBridge`
- CSP applied via response header (see [src/main/security/csp.ts](../src/main/security/csp.ts)) so it can be loose in dev (HMR over WS) and strict in prod
- Hardened Runtime entitlements in [build/entitlements.mac.plist](../build/entitlements.mac.plist)

## Decisions log

See [docs/adr/](adr/) for architecture decision records. Add a new ADR when you make a structural choice the next contributor would otherwise have to re-relitigate (stack swaps, schema changes, IPC redesigns).
