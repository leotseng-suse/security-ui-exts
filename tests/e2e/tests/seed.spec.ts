import { test, expect } from '../fixture/fixture';

// Seed test for the Playwright agents (planner / generator / healer).
// The chromium project reuses the login saved by global.setup.ts, so this starts
// already authenticated and lands on the SBOMScanner dashboard.
test.describe('Seed', () => {
  test('seed', async ({ page, dashboardPage }) => {
    await dashboardPage.goto();
    await expect(page).toHaveURL(/imageScanner\/dashboard/);
  });
});
