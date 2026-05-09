import { contextBridge, ipcRenderer } from 'electron';
import { IPC } from '@shared/ipc';
import type {
  AppPreferences,
  CaptureOptions,
  CaptureResult,
  Permission,
  PermissionState,
} from '@shared/types';
import type { SnaporaApi } from '@shared/ipc';

const api: SnaporaApi = {
  capture: (options: CaptureOptions): Promise<CaptureResult> =>
    ipcRenderer.invoke(IPC.capture.start, options),
  cancelCapture: (): Promise<void> => ipcRenderer.invoke(IPC.capture.cancel),
  permissions: {
    list: (): Promise<PermissionState[]> => ipcRenderer.invoke(IPC.permissions.list),
    request: (p: Permission): Promise<PermissionState> =>
      ipcRenderer.invoke(IPC.permissions.request, p),
    openSystemSettings: (p: Permission): Promise<void> =>
      ipcRenderer.invoke(IPC.permissions.openSystemSettings, p),
  },
  preferences: {
    get: (): Promise<AppPreferences> => ipcRenderer.invoke(IPC.preferences.get),
    set: (patch: Partial<AppPreferences>): Promise<AppPreferences> =>
      ipcRenderer.invoke(IPC.preferences.set, patch),
  },
  editor: {
    onImageReady: (handler: (filePath: string) => void) => {
      const listener = (_evt: unknown, filePath: string): void => handler(filePath);
      ipcRenderer.on(IPC.editor.onImageReady, listener);
      return () => ipcRenderer.removeListener(IPC.editor.onImageReady, listener);
    },
  },
  app: {
    quit: (): Promise<void> => ipcRenderer.invoke(IPC.app.quit),
    version: (): Promise<string> => ipcRenderer.invoke(IPC.app.version),
  },
};

contextBridge.exposeInMainWorld('snapora', api);
