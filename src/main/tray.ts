import { Menu, Tray, app, nativeImage } from 'electron';
import { join } from 'node:path';
import logger from '@main/logger';
import { takeScreenshot } from '@main/capture/screenshot';
import { showEditorWithImage } from '@main/windows/editor';
import { getPreferences } from '@main/storage/prefs';
import type { CaptureMode } from '@shared/types';

let tray: Tray | null = null;

export function createTray(): Tray {
  // TODO(v0.1): replace placeholder image with a real template icon (16x16 / 32x32 @2x).
  // Template images use black + alpha so macOS auto-tints for light/dark menu bars.
  const icon = nativeImage.createFromPath(join(__dirname, '../../resources/tray-icon.png'));
  const trayIcon = icon.isEmpty() ? nativeImage.createEmpty() : icon;
  trayIcon.setTemplateImage(true);

  tray = new Tray(trayIcon);
  tray.setToolTip('Snapora');
  rebuildTrayMenu();
  logger.info('tray: created');
  return tray;
}

export function rebuildTrayMenu(): void {
  if (!tray) return;
  const prefs = getPreferences();

  const captureItem = (label: string, mode: CaptureMode) => ({
    label,
    accelerator: prefs.hotkeys[mode],
    click: () => void runCapture(mode),
  });

  const menu = Menu.buildFromTemplate([
    captureItem('Capture Area…', 'area'),
    captureItem('Capture Window…', 'window'),
    captureItem('Capture Full Screen', 'fullscreen'),
    { type: 'separator' },
    { label: 'Preferences…', enabled: false }, // v0.1 TODO
    { label: 'History…', enabled: false }, // v0.2 TODO
    { type: 'separator' },
    { label: `Snapora ${app.getVersion()}`, enabled: false },
    { label: 'Quit Snapora', role: 'quit' },
  ]);
  tray.setContextMenu(menu);
}

async function runCapture(mode: CaptureMode): Promise<void> {
  const prefs = getPreferences();
  try {
    const result = await takeScreenshot({
      mode,
      format: prefs.defaultFormat,
      copyToClipboard: prefs.autoCopyToClipboard,
      saveToDisk: true,
    });
    if (!result.cancelled && result.filePath && prefs.openEditorAfterCapture) {
      showEditorWithImage(result.filePath);
    }
  } catch (err) {
    logger.error('tray: capture failed', err);
  }
}
