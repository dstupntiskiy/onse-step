import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e', timeout: 30000, workers: 1,
  use: { baseURL: 'http://127.0.0.1:4300', channel: 'chrome', timezoneId: 'Europe/Belgrade', screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  webServer: { command: 'npm start -- --host 127.0.0.1', url: 'http://127.0.0.1:4300', reuseExistingServer: true },
  reporter: [['list']],
});
