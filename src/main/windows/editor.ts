import { BrowserWindow, shell } from 'electron';
import { join } from 'node:path';
import logger from '@main/logger';
import { IPC } from '@shared/ipc';

let editorWindow: BrowserWindow | null = null;

function rendererUrl(file: string): string {
  // electron-vite sets ELECTRON_RENDERER_URL in dev to the Vite dev server origin.
  if (process.env.ELECTRON_RENDERER_URL) {
    return `${process.env.ELECTRON_RENDERER_URL}/${file}`;
  }
  return `file://${join(__dirname, `../renderer/${file}`)}`;
}

export function getOrCreateEditorWindow(): BrowserWindow {
  if (editorWindow && !editorWindow.isDestroyed()) {
    return editorWindow;
  }

  editorWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 720,
    minHeight: 480,
    title: 'Snapora — Editor',
    show: false,
    backgroundColor: '#1a1a1a',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 16 },
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  editorWindow.on('ready-to-show', () => editorWindow?.show());
  editorWindow.on('closed', () => {
    editorWindow = null;
  });

  editorWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  void editorWindow.loadURL(rendererUrl('editor.html'));
  logger.info('editor: window created');
  return editorWindow;
}

export function showEditorWithImage(filePath: string): void {
  const win = getOrCreateEditorWindow();
  const send = () => win.webContents.send(IPC.editor.onImageReady, filePath);
  if (win.webContents.isLoading()) {
    win.webContents.once('did-finish-load', send);
  } else {
    send();
  }
  win.show();
  win.focus();
}
