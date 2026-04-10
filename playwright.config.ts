import { defineConfig } from '@playwright/test';

const port = 3005;
const reuseExistingServer = !process.env.CI;
const startCommand = `PORT=${port} npm run start -- --hostname 127.0.0.1`;
const webServerCommand = process.env.PLAYWRIGHT_SKIP_BUILD
  ? startCommand
  : `npm run build && ${startCommand}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: 'on-first-retry',
  },
  webServer: {
    command: webServerCommand,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer,
    timeout: 120 * 1000,
  },
});
