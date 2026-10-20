import { defineConfig, devices } from '@playwright/test';

/**
 * One project per major engine. The dev server is started in Vite's `test` mode on its own
 * port: `test` mode does not load `.env.development`, so e2e runs never use real API, OAuth or
 * Amplitude keys (every backend call is mocked in the specs), and behave the same locally, for
 * contributors and in CI. The dedicated port keeps Playwright from reusing a regular
 * `npm run dev` server on 5173.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5174',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run dev -- --mode test --port 5174 --strictPort',
    url: 'http://localhost:5174',
    reuseExistingServer: !process.env.CI,
  },
});
