// spec: specs/ui/registries-configuration.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixture/fixture';

// One test per area (list, row menu, create form, detail page) so each costs a single page load.
// Soft assertions report every missing element; hard ones guard the clicks that later steps depend on.
test.describe('Registries Configuration', { tag: '@ui' }, () => {
  test.beforeEach(async ({ registriesPage }) => {
    await registriesPage.goto();
    await registriesPage.expectLoaded();
  });

  test('page loads with the "Registries Configuration" heading', { tag: '@smoke' }, async ({ registriesPage }) => {
    await expect(registriesPage.page).toHaveURL(/sbomscanner\.kubewarden\.io\.registry$/);
    await expect(registriesPage.heading).toBeVisible();
  });

  test('shows the list page controls and registry table', async ({ registriesPage }) => {
    await test.step('Create button', async () => {
      await expect.soft(registriesPage.createButton).toBeVisible();
    });

    await test.step('search filters are empty and status is "Any"', async () => {
      await expect.soft(registriesPage.registryFilter).toHaveAttribute('placeholder', 'Search by name');
      await expect.soft(registriesPage.registryFilter).toHaveValue('');
      await expect.soft(registriesPage.uriFilter).toHaveAttribute('placeholder', 'Search by address');
      await expect.soft(registriesPage.uriFilter).toHaveValue('');
      await expect.soft(registriesPage.repositoriesFilter).toHaveAttribute('placeholder', 'Search by name');
      await expect.soft(registriesPage.repositoriesFilter).toHaveValue('');
      await expect.soft(registriesPage.statusFilter).toContainText('Any');
    });

    await test.step('Start scan and Delete are disabled when nothing is selected', async () => {
      await expect.soft(registriesPage.startScanButton).toBeDisabled();
      await expect.soft(registriesPage.deleteButton).toBeDisabled();
    });

    await test.step('table columns and rows or empty state', async () => {
      for (const name of ['Registry', 'Namespace', 'URI', 'Repositories', 'Scan interval', 'Status', 'Progress', 'Previous scan']) {
        await expect.soft(registriesPage.table.columnHeader(name)).toBeVisible();
      }
      await expect.soft(registriesPage.table.rows.first().or(registriesPage.table.emptyState)).toBeVisible();
    });
  });

  test('shows the status panels and the row action menu', { tag: '@needs-data' }, async ({ registriesPage }) => {
    await test.step('status panels', async () => {
      await expect.soft(registriesPage.latestStatusUpdatesPanel).toBeVisible();
      await expect.soft(registriesPage.statusDistributionPanel).toBeVisible();
    });

    await test.step('row action menu', async () => {
      await registriesPage.table.rowActionButton(0).click();
      await expect.soft(registriesPage.actionMenu.items).toHaveText(['Start scan', 'Edit Config', 'Edit YAML', 'Clone', 'Delete']);
      await registriesPage.actionMenu.close();
      await expect.soft(registriesPage.actionMenu.menu).toBeHidden();
    });
  });

  test('shows the create form defaults and returns to the list on cancel', async ({ registriesPage }) => {
    await registriesPage.openCreateForm();
    const form = registriesPage.createForm;

    await test.step('namespace, name and description', async () => {
      // Rancher pre-selects a namespace from the user's namespace filter, so don't assert which one.
      await expect.soft(form.namespace).toBeVisible();
      await expect.soft(form.name).toHaveAttribute('placeholder', 'A unique name');
      await expect.soft(form.name).toHaveValue('');
      await expect.soft(form.description).toHaveValue('');
    });

    await test.step('type "OCI Distribution" and uri "ghcr.io"', async () => {
      await expect.soft(form.type).toContainText('OCI Distribution');
      await expect.soft(form.uri).toHaveValue('ghcr.io');
    });

    await test.step('CA cert bundle, insecure connections and authentication', async () => {
      await expect.soft(form.caCertBundle).toHaveValue('');
      await expect.soft(form.readFromFileButton).toBeEnabled();
      await expect.soft(form.allowInsecureCheckbox).not.toBeChecked();
      await expect.soft(form.authentication).toContainText('None');
    });

    await test.step('repositories, scan interval "Manual" and platforms', async () => {
      await expect.soft(form.repositories).toBeVisible();
      await expect.soft(form.scanInterval).toContainText('Manual');
      await expect.soft(form.addPlatformButton).toBeEnabled();
    });

    await test.step('Create is disabled until the required fields are filled', async () => {
      await expect.soft(form.editAsYamlButton).toBeEnabled();
      await expect.soft(form.submitButton).toBeDisabled();
    });

    await test.step('Cancel returns to the list', async () => {
      await expect(form.cancelButton).toBeEnabled();
      await form.cancelButton.click();
      await expect(registriesPage.heading).toBeVisible();
    });
  });

  test('shows the registry detail page', { tag: '@needs-data' }, async ({ registriesPage }) => {
    await registriesPage.openFirstRegistry();
    const detail = registriesPage.detail;

    await test.step('heading, status badge and Start scan', async () => {
      await expect.soft(detail.heading).toHaveText(/^Registries Configuration:\s*\S+/);
      await expect.soft(detail.statusBadge).toBeVisible();
      await expect.soft(detail.startScanButton).toBeEnabled();
    });

    await test.step('registry information labels', async () => {
      await expect.soft(detail.namespaceLabel).toBeVisible();
      await expect.soft(detail.uriLabel).toBeVisible();
      await expect.soft(detail.scanIntervalLabel).toBeVisible();
      await expect.soft(detail.repositoriesLabel).toBeVisible();
      await expect.soft(detail.platformsLabel).toBeVisible();
    });

    await test.step('recent scans table columns', async () => {
      for (const name of ['Status', 'Since', 'Progress', 'Images scanned', 'Images found', 'Error']) {
        await expect.soft(detail.recentScansTable.columnHeader(name)).toBeVisible();
      }
    });

    await test.step('action menu', async () => {
      await detail.actionMenuButton.click();
      await expect.soft(registriesPage.actionMenu.items).toHaveText(['Edit Config', 'Edit YAML', 'Clone', 'Delete']);
      await registriesPage.actionMenu.close();
      await expect.soft(registriesPage.actionMenu.menu).toBeHidden();
    });
  });
});
