// spec: specs/ui/workloads-scan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixture/fixture';

// Read-only: this page edits live cluster config, so never tick, select, type or Save.
test.describe('Workloads Scan', { tag: '@ui' }, () => {
  test.beforeEach(async ({ workloadsScanPage }) => {
    await workloadsScanPage.goto();
    await workloadsScanPage.expectLoaded();
  });

  test('page loads with the heading and a status badge', { tag: '@smoke' }, async ({ workloadsScanPage }) => {
    await expect(workloadsScanPage.page).toHaveURL(workloadsScanPage.formUrl);
    // Active/Inactive once a configuration exists, Create on a fresh install.
    await expect(workloadsScanPage.heading).toHaveText(/^Workloads Scan Configuration\s+(Active|Inactive|Create)$/);
  });

  // One page load, one step per form section; soft assertions report every missing element, not just the first.
  test('shows every section of the configuration form', async ({ workloadsScanPage }) => {
    await test.step('info banner and Enabled checkbox', async () => {
      await expect.soft(workloadsScanPage.infoBanner).toBeVisible();
      await expect.soft(workloadsScanPage.documentationLink).toBeVisible();
      await expect.soft(workloadsScanPage.enabledCheckbox).toBeVisible();
    });

    await test.step('resource location', async () => {
      await expect.soft(workloadsScanPage.resourceLocationLabel).toBeVisible();
      // Warning while the namespace can be changed; info once it is locked by an enabled configuration.
      await expect.soft(workloadsScanPage.resourceLocationWarning.or(workloadsScanPage.resourceLocationLockedInfo)).toBeVisible();
      await expect.soft(workloadsScanPage.artifactsNamespaceSelect).toContainText('cattle-sbomscanner-system');
    });

    await test.step('authentication', async () => {
      await expect.soft(workloadsScanPage.authenticationLabel).toBeVisible();
      await expect.soft(workloadsScanPage.authenticationSelect).toContainText('None');
      await expect.soft(workloadsScanPage.allowInsecureCheckbox).toBeVisible();
      await expect.soft(workloadsScanPage.caCertBundle).toBeVisible();
      await expect.soft(workloadsScanPage.readFromFileButton).toBeEnabled();
    });

    await test.step('scanning', async () => {
      await expect.soft(workloadsScanPage.scanningLabel).toBeVisible();
      await expect.soft(workloadsScanPage.scanIntervalSelect).toBeVisible();
      await expect.soft(workloadsScanPage.scanOnChangeCheckbox).toBeVisible();
    });

    await test.step('namespace selectors and platform filter', async () => {
      await expect.soft(workloadsScanPage.namespaceSelectorsLabel).toBeVisible();
      await expect.soft(workloadsScanPage.addRuleButton).toBeEnabled();
      await expect.soft(workloadsScanPage.filterByLabel).toBeVisible();
      await expect.soft(workloadsScanPage.addPlatformButton).toBeEnabled();
    });

    await test.step('Cancel and Save (or Create) buttons', async () => {
      await expect.soft(workloadsScanPage.cancelButton).toBeEnabled();
      await expect.soft(workloadsScanPage.saveButton).toBeVisible();
    });
  });
});
