export type CaptureMode = 'area' | 'window' | 'fullscreen';

export type CaptureFormat = 'png' | 'jpg';

export interface CaptureOptions {
  mode: CaptureMode;
  format?: CaptureFormat;
  copyToClipboard?: boolean;
  saveToDisk?: boolean;
  /** Delay in milliseconds before capture is triggered. */
  delayMs?: number;
  /** Hide desktop icons during capture. */
  hideDesktopIcons?: boolean;
}

export interface CaptureResult {
  /** Absolute path to the saved file, or null if save was disabled / cancelled. */
  filePath: string | null;
  /** ISO timestamp of capture. */
  capturedAt: string;
  width: number | null;
  height: number | null;
  /** True if the user cancelled the selection (e.g. pressed escape). */
  cancelled: boolean;
}

export type Permission = 'screen-recording' | 'microphone' | 'camera' | 'accessibility';

export type PermissionStatus = 'granted' | 'denied' | 'not-determined' | 'restricted' | 'unknown';

export interface PermissionState {
  permission: Permission;
  status: PermissionStatus;
}

export interface AppPreferences {
  /** Folder where screenshots are saved. */
  saveDirectory: string;
  /** Default capture format. */
  defaultFormat: CaptureFormat;
  /** Copy to clipboard automatically after capture. */
  autoCopyToClipboard: boolean;
  /** Open the editor automatically after capture. */
  openEditorAfterCapture: boolean;
  /** Hide the desktop icons by default during full-screen capture. */
  hideDesktopIcons: boolean;
  /** Global hotkey strings (Electron accelerator format) per capture mode. */
  hotkeys: Record<CaptureMode, string>;
}

export const DEFAULT_PREFERENCES: AppPreferences = {
  saveDirectory: '', // resolved at runtime to ~/Pictures/Snapora
  defaultFormat: 'png',
  autoCopyToClipboard: true,
  openEditorAfterCapture: true,
  hideDesktopIcons: false,
  hotkeys: {
    area: 'CommandOrControl+Shift+2',
    window: 'CommandOrControl+Shift+3',
    fullscreen: 'CommandOrControl+Shift+4',
  },
};
