# Snapora Roadmap

Living document. Order is approximate build order; milestones may shuffle.

## v0.1 — "It captures something" (MVP)

Goal: prove the core capture pipeline end-to-end on a real Mac.

- [x] Project scaffold (Electron + Vite + React + TypeScript + Tailwind)
- [x] Tray menu + status item
- [x] Global hotkey registration
- [x] Area screenshot via `screencapture` shell-out
- [x] Save to disk + copy to clipboard
- [ ] First-run permission wizard (Screen Recording, Mic, Camera)
- [ ] Basic preferences window (electron-store backed)
- [ ] Code-signing + notarization in CI (waiting on Apple Developer account)

## v0.2 — Capture modes

- [ ] Window capture (`screencapture -W`)
- [ ] Full-screen per-display
- [ ] Self-timer (3 / 5 / 10s)
- [ ] Hide desktop icons toggle
- [ ] Capture history (SQLite, browsable, configurable retention)

## v0.3 — Annotation editor

- [ ] Konva-based editor canvas
- [ ] Tools: arrow, line, rectangle, ellipse, freehand, text, highlight, blur, pixelate, counter, crop
- [ ] Undo/redo
- [ ] Export PNG / JPG / WebP / PDF

## v0.4 — Screen recording

- [ ] Region/window/display recording (bundled ffmpeg + avfoundation input)
- [ ] Microphone input
- [ ] System audio (where macOS permits)
- [ ] Webcam overlay (floating window)
- [ ] GIF export (gifski or ffmpeg palette method)

## v0.5 — Pinned overlays + power features

- [ ] Pinned screenshot windows (transparent, always-on-top)
- [ ] Quick access HUD (post-capture floating thumbnail)
- [ ] OCR via Tesseract (bundled) or Tesseract.js (fallback)
- [ ] Color picker / measure tool

## v0.6 — Cloud + sharing

- [ ] `UploadProvider` interface
- [ ] Built-in providers: S3, Cloudflare R2, Backblaze B2, WebDAV, ShareX-compatible custom uploader
- [ ] Short-link generation hooks
- [ ] Drag-out from menu bar to any app

## v1.0 — Stability + polish

- [ ] electron-updater auto-update wiring
- [ ] Localization scaffold (en at minimum)
- [ ] Notarization stable + DMG with custom background
- [ ] Homebrew Cask submission
- [ ] Documentation site (docs.forgemoss.com)
- [ ] Migration guide from CleanShot/Shottr (config import where feasible)

## Beyond

- [ ] Scrolling capture
- [ ] On-device AI (denoise, redact PII)
- [ ] Optional managed cloud at `snapora.cloud` (for users who don't want BYO-cloud)
- [ ] Windows / Linux ports (capture pipeline rewrite per OS)
