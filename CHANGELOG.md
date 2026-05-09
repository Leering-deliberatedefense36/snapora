# Changelog

All notable changes to Snapora are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial project scaffolding: Electron 33 + electron-vite + React 19 + TypeScript + Tailwind v4.
- Working capture pipeline shelling out to macOS `screencapture` (area / window / full screen).
- Tray menu with capture actions, global hotkeys (⌘⇧2/⌘⇧3/⌘⇧4), basic editor window that displays the captured image.
- TCC permission helpers for Screen Recording, Microphone, Camera, Accessibility — with deeplinks to System Settings.
- Preferences storage via `electron-store` and a typed IPC bridge between main and renderer.
- electron-builder configuration for DMG/ZIP output, hardened-runtime entitlements, and an opt-in notarization hook.
- GitHub Actions workflows for CI (lint + typecheck + tests on Linux) and tagged releases (build + sign + notarize on macOS).
- OSS hygiene files: LICENSE (MIT), README, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, ROADMAP, issue/PR templates, ESLint, Prettier, EditorConfig, Makefile.
