/**
 * Used as electron-builder `afterSign` hook once notarization is enabled.
 * Wire in via electron-builder.yml: `afterSign: build/notarize.cjs`.
 *
 * Required env vars:
 *   APPLE_ID
 *   APPLE_APP_SPECIFIC_PASSWORD  (https://appleid.apple.com/account/manage)
 *   APPLE_TEAM_ID                (10-char team ID from Apple Developer portal)
 */
const { notarize } = require('@electron/notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir, packager } = context;
  if (electronPlatformName !== 'darwin') return;
  if (!process.env.APPLE_ID || !process.env.APPLE_APP_SPECIFIC_PASSWORD || !process.env.APPLE_TEAM_ID) {
    console.warn('[notarize] skipping — APPLE_ID / APPLE_APP_SPECIFIC_PASSWORD / APPLE_TEAM_ID not set');
    return;
  }

  const appName = packager.appInfo.productFilename;
  const appPath = `${appOutDir}/${appName}.app`;

  console.log(`[notarize] submitting ${appPath}`);
  await notarize({
    appBundleId: 'com.forgemoss.snapora',
    appPath,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID,
  });
  console.log('[notarize] done');
};
