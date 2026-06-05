import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const baseURL = (process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm exec next dev --hostname localhost --port 3000',
    cwd: projectRoot,
    url: `${baseURL}/login`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
