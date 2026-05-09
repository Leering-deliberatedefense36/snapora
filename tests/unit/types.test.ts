import { describe, expect, it } from 'vitest';
import { DEFAULT_PREFERENCES } from '@shared/types';

describe('DEFAULT_PREFERENCES', () => {
  it('has hotkeys for all capture modes', () => {
    expect(DEFAULT_PREFERENCES.hotkeys.area).toBeTruthy();
    expect(DEFAULT_PREFERENCES.hotkeys.window).toBeTruthy();
    expect(DEFAULT_PREFERENCES.hotkeys.fullscreen).toBeTruthy();
  });

  it('defaults to PNG format', () => {
    expect(DEFAULT_PREFERENCES.defaultFormat).toBe('png');
  });
});
