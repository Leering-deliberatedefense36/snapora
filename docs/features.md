# Snapora — Feature Reference

This is the public-spec feature list driving the clean-room build. Sources: macOS public documentation, the bundled OSS tools below, and publicly documented behaviors of similar apps. **No source/binary of any commercial app has been inspected to write this.**

## Implementation approach

Snapora is built as an Electron app. We don't write native macOS code; we orchestrate three things:

1. **macOS built-in CLIs** — `/usr/sbin/screencapture` for screenshots and basic recording. It already provides Apple's selection HUD, window picker, and TCC integration for free.
2. **Bundled OSS binaries** — `ffmpeg` for advanced recording / encoding / GIF, `tesseract` for OCR. Both ship in the app bundle's `resources/bin/`.
3. **Web-tech UI** — React + Tailwind for editor / settings / HUD; HTML5 canvas via [Konva](https://konvajs.org) for the annotation editor.

Permissions live in `Info.plist` and are surfaced through Electron's `systemPreferences` API: `NSScreenCaptureUsageDescription`, `NSMicrophoneUsageDescription`, `NSCameraUsageDescription`.

## 1. Capture

| Mode               | How                                                                  |
| ------------------ | -------------------------------------------------------------------- |
| Area               | `screencapture -i` — uses macOS's own click-and-drag selection HUD   |
| Window             | `screencapture -i -W -o` — hover-highlight, drop-shadow stripped     |
| Display            | `screencapture` per display index, one file per attached display     |
| Self-timer         | `screencapture -T <seconds>` for full-screen; JS timer for area mode |
| Hide desktop icons | `defaults write com.apple.finder CreateDesktop false` toggle         |
| Scrolling          | Stitch frames in renderer-side canvas (later milestone)              |

## 2. Annotation editor

Tools: select, move, arrow, line, rectangle, ellipse, freehand, text, highlight, blur, pixelate, counter, crop. Standard undo/redo. Layer reordering. Export PNG / JPG / WebP / PDF.

Implemented with **Konva** (HTML5 canvas) inside the editor renderer window. Blur and pixelate are canvas pixel operations or CSS `filter` shaders. Text uses the system stack via Tailwind's `font-sans`.

## 3. Recording

| Source                    | How                                                                                                                                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Region / window / display | `screencapture -v` for simple, **bundled `ffmpeg` + `avfoundation`** input for advanced (mic, system audio, control over codec/fps)                                                                    |
| Microphone                | `ffmpeg -f avfoundation -i ":<mic-index>"`                                                                                                                                                             |
| System audio              | macOS 13+: app-level capture via ScreenCaptureKit isn't reachable from Electron without a native helper, so we'll start with mic-only and consider a tiny native helper if users push for system audio |
| Webcam overlay            | A separate transparent BrowserWindow showing a `<video>` element from `getUserMedia({ video: true })`                                                                                                  |
| Output                    | MP4 (H.264 / HEVC), animated GIF (palette-method via ffmpeg, or `gifski`), ProRes (later)                                                                                                              |

## 4. Pinned overlays

Float captured screenshots above other windows. Each pin is a transparent always-on-top BrowserWindow (or — to save RAM — multiple panels inside one shared transparent window). Drag to reposition; right-click for actions (save, copy, close, send to editor).

## 5. Quick access HUD

Post-capture floating thumbnail near a configurable screen corner (default: lower-right). Buttons: edit, copy, save, upload, dismiss. Auto-hides after a configurable timeout. Implemented as a small frameless transparent BrowserWindow with click-through margins.

## 6. OCR

Right-click captured image → "Copy text". Two modes:

- **Bundled `tesseract` binary** (preferred) — fast, accurate, ~15 MB extra in the bundle.
- **Tesseract.js** fallback — pure JS/WASM, slower, no native dependency. Useful if we ever want to keep the bundle smaller or run in-process.

## 7. History

Browsable list of recent captures, backed by a local SQLite database (`better-sqlite3`). Configurable retention; "clear on quit" option for sensitive workflows. Schema: `captures(id, file_path, captured_at, mode, width, height)` plus an `uploads(...)` join table when v0.6 lands.

## 8. Cloud upload (pluggable)

A small `UploadProvider` interface in `src/main/upload/` with built-in implementations:

- **S3** (AWS S3, Cloudflare R2, Backblaze B2, MinIO, etc.) via `@aws-sdk/client-s3`
- **Generic HTTP** — multipart POST, ShareX-format custom uploaders
- **WebDAV**
- **Imgur** (anonymous / OAuth)

Users pick zero or more defaults. Uploads only happen when the user triggers them — no background telemetry. A future hosted `snapora.cloud` would plug in as another provider.

## 9. Shortcuts

Global hotkeys for every capture mode and action (Electron `globalShortcut`). Conflict detection in Settings. Accelerator strings stored in `electron-store` preferences.

Defaults:

- ⌘⇧2 — capture area
- ⌘⇧3 — capture window
- ⌘⇧4 — capture full screen

## 10. Privacy

- App is unsandboxed (sandboxing breaks tray, global hotkeys, and arbitrary file save). All file access is local except explicit uploads.
- TCC prompts: Screen Recording (required), Microphone / Camera (only if recording).
- No analytics in v1. Crash reporting opt-in only.
- The renderer is sandboxed and `contextIsolation` is on; only `window.snapora.*` (defined in [src/preload/index.ts](../src/preload/index.ts)) is exposed.
