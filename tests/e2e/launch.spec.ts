import { _electron as electron, expect, test } from '@playwright/test';
import { join } from 'node:path';

/**
 * v0.1 placeholder e2e test. Verifies the app launches and exits cleanly.
 * Real flows (capture, editor, settings) added as features ship.
 */
test('app launches and quits', async () => {
  const app = await electron.launch({
    args: [join(process.cwd(), 'out/main/index.js')],
    env: { ...process.env, NODE_ENV: 'test' },
  });
  expect(app).toBeTruthy();
  await app.close();
});
