import { app } from 'electron';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import logger from '@main/logger';
import { DEFAULT_PREFERENCES, type AppPreferences } from '@shared/types';

/**
 * Tiny JSON-backed preference store. We were using electron-store, but it's
 * pure ESM and our main process is CJS, so we'd have had to dynamic-import
 * it at every call site. A 30-line homegrown store is cheaper and safer.
 *
 * File: <userData>/preferences.json
 */

let cached: AppPreferences | null = null;

function prefsPath(): string {
  return join(app.getPath('userData'), 'preferences.json');
}

function readFromDisk(): AppPreferences {
  const path = prefsPath();
  const defaults: AppPreferences = {
    ...DEFAULT_PREFERENCES,
    saveDirectory: join(app.getPath('pictures'), 'Snapora'),
  };
  try {
    if (!existsSync(path)) return defaults;
    const raw = readFileSync(path, 'utf8');
    const parsed = JSON.parse(raw) as Partial<AppPreferences>;
    return { ...defaults, ...parsed, hotkeys: { ...defaults.hotkeys, ...parsed.hotkeys } };
  } catch (err) {
    logger.warn('prefs: failed to read, using defaults', err);
    return defaults;
  }
}

function writeToDisk(prefs: AppPreferences): void {
  const path = prefsPath();
  try {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, JSON.stringify(prefs, null, 2), 'utf8');
  } catch (err) {
    logger.error('prefs: failed to write', err);
    throw err;
  }
}

export function getPreferences(): AppPreferences {
  if (!cached) cached = readFromDisk();
  return { ...cached };
}

export function setPreferences(patch: Partial<AppPreferences>): AppPreferences {
  const current = getPreferences();
  const merged: AppPreferences = {
    ...current,
    ...patch,
    hotkeys: { ...current.hotkeys, ...patch.hotkeys },
  };
  writeToDisk(merged);
  cached = merged;
  return { ...merged };
}
