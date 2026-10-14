// spec: specs/ui/dashboard.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixture/fixture';

test.describe('Dashboard', { tag: '@ui' }, () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
    await dashboardPage.expectLoaded();
  });

  test('loads the dashboard or its empty state', { tag: '@smoke' }, async ({ dashboardPage }) => {
    await expect(dashboardPage.page).toHaveURL(/imageScanner\/dashboard/);
  });

  // One page load, one step per area; soft assertions report every missing element, not just the first.
  test('shows the header, registry filter and scanning stats', { tag: '@needs-data' }, async ({ dashboardPage }) => {
    await test.step('header', async () => {
      await expect.soft(dashboardPage.title).toContainText('Dashboard');
      await expect.soft(dashboardPage.subtitle).toBeVisible();
    });

    await test.step('registry filter defaults to "All matching registries"', async () => {
      await expect.soft(dashboardPage.registryFilter).toBeVisible();
      await expect.soft(dashboardPage.registryFilter).toContainText('All matching registries');
    });

    await test.step('scanning stats', async () => {
      await expect.soft(dashboardPage.scanningStatsHeading).toBeVisible();
      await expect.soft(dashboardPage.totalScannedText).toBeVisible();
      await expect.soft(dashboardPage.lastScanLabel.or(dashboardPage.noScanYetText)).toBeVisible();
      await expect.soft(dashboardPage.failedImagesValue).toBeVisible();
      await expect.soft(dashboardPage.failedImagesLabel).toBeVisible();
      await expect.soft(dashboardPage.detectedErrorsValue).toBeVisible();
      await expect.soft(dashboardPage.detectedErrorsLabel).toBeVisible();
    });
  });
});
