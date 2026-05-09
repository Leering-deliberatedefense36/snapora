import { describe, expect, it } from 'vitest';
import { DEFAULT_PREFERENCES } from '@shared/types';

/**
 * The screenshot module imports from 'electron' (clipboard, nativeImage),
 * which can't load outside an Electron context — so we don't import it here.
 * Real e2e exercise of the capture pipeline lives in tests/e2e/.
 *
 * This file holds vitest-runnable shape checks for types & helpers that
 * the screenshot module depends on.
 */
describe('capture preferences shape', () => {
  it('has a string accelerator for the area mode hotkey', () => {
    expect(typeof DEFAULT_PREFERENCES.hotkeys.area).toBe('string');
    expect(DEFAULT_PREFERENCES.hotkeys.area.length).toBeGreaterThan(0);
  });

  it('uses CommandOrControl prefix so accelerators work cross-platform', () => {
    for (const accel of Object.values(DEFAULT_PREFERENCES.hotkeys)) {
      expect(accel).toMatch(/^CommandOrControl/);
    }
  });
});
