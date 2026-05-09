# 0001 — Stack choice: Electron + React

**Date:** 2026-05-09
**Status:** Accepted

## Context

Snapora is the first project under the [forgemoss](https://forgemoss.com) umbrella — an OSS alternative to CleanShot X for macOS. The maintainer's hard requirement: **no native (Swift / Obj-C) code we write ourselves**, so the app stays approachable to web developers and easy to port later.

Constraints:

- Must drive macOS-only screen capture, screen recording, OCR, global hotkeys, tray, always-on-top overlays.
- Must ship signed + notarized DMGs.
- Must be hackable for web developers (the broadest contributor pool).
- Must support BYO-cloud upload (S3, R2, etc.) without a backend.

## Decision

**Electron 33 + React 19 + Tailwind v4 + TypeScript.** Native macOS capabilities are reached by:

- Shelling out to `/usr/sbin/screencapture` for screenshots.
- Bundling `ffmpeg` (recording, GIF export) and `tesseract` (OCR) as binaries in `resources/bin/`.
- Using Electron's `systemPreferences`, `globalShortcut`, `Tray`, `BrowserWindow` APIs for everything else.

## Consequences

**Enables:**

- Web developers can contribute without learning Swift.
- Cross-platform port path is clear (Electron already runs on Win/Linux; capture pipeline rewrites are localized to `src/main/capture/`).
- Konva on canvas gives us a powerful annotation editor with minimal native effort.

**Costs:**

- ~150 MB binary, ~250 MB idle RAM. CleanShot is ~60 MB. We accept this and mitigate (lazy windows, shared transparent overlays, V8 caching).
- Chromium font rendering and animation timings differ subtly from native macOS apps. Polishable, never identical.
- macOS-only features that Electron doesn't surface (e.g., system audio capture via ScreenCaptureKit) require either accepting the limitation or shipping a tiny native helper later.

## Alternatives considered

- **Tauri 2 + Rust** — 10× smaller binary, half the RAM, system WebKit. Rejected because the maintainer treats compiled-language code as "native" and prefers JS/TS-only. _(Re-evaluate if we ever need to ship a system-audio helper anyway.)_
- **Native Swift / SwiftUI** — best polish, smallest footprint, but rejected by the no-native-code rule and the contributor pool concern.
- **Flutter desktop** — wrong category for menu-bar utilities; ecosystem still gappy on macOS.
- **Wails (Go)** — viable but smaller community and fewer macOS screen-capture references.
- **Pure web / PWA** — can't do tray, global hotkeys, or screen capture.
