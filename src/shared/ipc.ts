import type { CaptureOptions, CaptureResult, PermissionState, AppPreferences } from './types';

/**
 * Centralized IPC channel names. Both sides import from here so a typo is a compile error.
 */
export const IPC = {
  capture: {
    start: 'capture:start',
    cancel: 'capture:cancel',
  },
  permissions: {
    list: 'permissions:list',
    request: 'permissions:request',
    openSystemSettings: 'permissions:open-settings',
  },
  preferences: {
    get: 'preferences:get',
    set: 'preferences:set',
  },
  editor: {
    onImageReady: 'editor:image-ready',
  },
  app: {
    quit: 'app:quit',
    version: 'app:version',
  },
} as const;

/**
 * The shape of the `window.snapora` API exposed by the preload layer.
 * Keep this aligned with src/preload/index.ts.
 */
export interface SnaporaApi {
  capture(options: CaptureOptions): Promise<CaptureResult>;
  cancelCapture(): Promise<void>;
  permissions: {
    list(): Promise<PermissionState[]>;
    request(permission: PermissionState['permission']): Promise<PermissionState>;
    openSystemSettings(permission: PermissionState['permission']): Promise<void>;
  };
  preferences: {
    get(): Promise<AppPreferences>;
    set(patch: Partial<AppPreferences>): Promise<AppPreferences>;
  };
  editor: {
    onImageReady(handler: (filePath: string) => void): () => void;
  };
  app: {
    quit(): Promise<void>;
    version(): Promise<string>;
  };
}
