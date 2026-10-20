import { expect, test } from '@playwright/test';

/**
 * Proves the Playwright harness itself works end to end (dev server
 * auto-start, routing, real DOM content) — not meant as real coverage.
 * `LoginScreen` (`/login`) is the patient login route, so its heading is a stable,
 * always-rendered anchor to assert against (`/` is the welcome screen).
 */
test('login screen loads', async ({ page }) => {
  await page.goto('/login');

  await expect(page.getByRole('heading', { name: 'Bienvenue sur Luna' })).toBeVisible();
});
