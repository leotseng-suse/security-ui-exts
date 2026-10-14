// spec: specs/ui/images.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixture/fixture';

test.describe('Images', { tag: '@ui' }, () => {
  test.beforeEach(async ({ imagesPage }) => {
    await imagesPage.goto();
    await imagesPage.expectLoaded();
  });

  test('page loads with the "Images" heading', { tag: '@smoke' }, async ({ imagesPage }) => {
    await expect(imagesPage.page).toHaveURL(/imageScanner\/images/);
    await expect(imagesPage.title).toHaveText('Images');
  });

  // One page load, one step per area; soft assertions report every missing element, not just the first.
  test('shows the filters, report buttons and image table', async ({ imagesPage }) => {
    await test.step('image reference search is empty', async () => {
      await expect.soft(imagesPage.imageSearch).toBeVisible();
      await expect.soft(imagesPage.imageSearch).toHaveValue('');
    });

    await test.step('filters default to "Any"', async () => {
      await expect.soft(imagesPage.severityFilter).toContainText('Any');
      await expect.soft(imagesPage.inUseFilter).toContainText('Any');
      await expect.soft(imagesPage.repositoryFilter).toContainText('Any');
      await expect.soft(imagesPage.registryFilter).toContainText('Any');
      await expect.soft(imagesPage.platformFilter).toContainText('Any');
    });

    await test.step('report buttons', async () => {
      await expect.soft(imagesPage.downloadFullReportButton).toBeVisible();
      await expect.soft(imagesPage.downloadCustomReportButton).toBeVisible();
      await expect.soft(imagesPage.downloadCustomReportButton).toBeDisabled();
    });

    await test.step('"Group by repository" is unchecked', async () => {
      await expect.soft(imagesPage.groupByRepositoryCheckbox).toBeVisible();
      await expect.soft(imagesPage.groupByRepositoryCheckbox).not.toBeChecked();
    });

    await test.step('table columns and rows or empty state', async () => {
      for (const name of ['Image reference', 'Affecting CVEs', 'In use', 'Repository', 'Registry', 'Platform', 'Digest']) {
        await expect.soft(imagesPage.table.columnHeader(name)).toBeVisible();
      }
      await expect.soft(imagesPage.table.rows.first().or(imagesPage.table.emptyState)).toBeVisible();
    });
  });

  test('enables download full report when images exist', { tag: '@needs-data' }, async ({ imagesPage }) => {
    await expect(imagesPage.table.rows.first()).toBeVisible();
    await expect(imagesPage.downloadFullReportButton).toBeEnabled();
  });
});
