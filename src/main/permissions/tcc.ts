import { shell, systemPreferences } from 'electron';
import logger from '@main/logger';
import type { Permission, PermissionState, PermissionStatus } from '@shared/types';

/**
 * macOS TCC permission helpers.
 *
 * Note: macOS does not let an app programmatically request Screen Recording.
 * The first call that needs it triggers the prompt, and the user must
 * **quit and relaunch** before the grant takes effect — that's a macOS quirk
 * we cannot work around.
 */

const SETTINGS_URLS: Record<Permission, string> = {
  'screen-recording':
    'x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture',
  microphone: 'x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone',
  camera: 'x-apple.systempreferences:com.apple.preference.security?Privacy_Camera',
  accessibility: 'x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility',
};

function mapMediaStatus(s: string): PermissionStatus {
  switch (s) {
    case 'granted':
      return 'granted';
    case 'denied':
      return 'denied';
    case 'restricted':
      return 'restricted';
    case 'not-determined':
      return 'not-determined';
    default:
      return 'unknown';
  }
}

export async function getPermissionStatus(permission: Permission): Promise<PermissionStatus> {
  if (process.platform !== 'darwin') return 'unknown';

  switch (permission) {
    case 'screen-recording':
      // macOS 11+: getMediaAccessStatus('screen') is the canonical check.
      return mapMediaStatus(systemPreferences.getMediaAccessStatus('screen'));
    case 'microphone':
      return mapMediaStatus(systemPreferences.getMediaAccessStatus('microphone'));
    case 'camera':
      return mapMediaStatus(systemPreferences.getMediaAccessStatus('camera'));
    case 'accessibility':
      return systemPreferences.isTrustedAccessibilityClient(false) ? 'granted' : 'denied';
  }
}

export async function listPermissions(): Promise<PermissionState[]> {
  const perms: Permission[] = ['screen-recording', 'microphone', 'camera', 'accessibility'];
  return Promise.all(
    perms.map(async (p) => ({ permission: p, status: await getPermissionStatus(p) })),
  );
}

export async function requestPermission(permission: Permission): Promise<PermissionState> {
  if (process.platform !== 'darwin') {
    return { permission, status: 'unknown' };
  }

  switch (permission) {
    case 'microphone':
      await systemPreferences.askForMediaAccess('microphone').catch(() => false);
      break;
    case 'camera':
      await systemPreferences.askForMediaAccess('camera').catch(() => false);
      break;
    case 'screen-recording':
      // No public API to programmatically request this. Opening Settings is the best UX.
      await openSystemSettingsFor('screen-recording');
      break;
    case 'accessibility':
      // `true` triggers the system prompt with deeplink-to-Settings.
      systemPreferences.isTrustedAccessibilityClient(true);
      break;
  }

  return { permission, status: await getPermissionStatus(permission) };
}

export async function openSystemSettingsFor(permission: Permission): Promise<void> {
  const url = SETTINGS_URLS[permission];
  logger.info('permissions: opening Settings', { permission, url });
  await shell.openExternal(url);
}
