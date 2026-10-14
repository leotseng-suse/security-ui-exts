// spec: specs/ui/vex-management.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixture/fixture';

// One test per area (list, rows and row menu, create form, detail page) so each costs a single page load.
// Soft assertions report every missing element; hard ones guard the clicks that later steps depend on.
test.describe('VEX Management', { tag: '@ui' }, () => {
  test.beforeEach(async ({ vexManagementPage }) => {
    await vexManagementPage.goto();
    await vexManagementPage.expectLoaded();
  });

  test('page loads with the "VEX Management" heading', { tag: '@smoke' }, async ({ vexManagementPage }) => {
    await expect(vexManagementPage.page).toHaveURL(/sbomscanner\.kubewarden\.io\.vexhub$/);
    await expect(vexManagementPage.heading).toBeVisible();
  });

  test('shows the list page controls and vex hub table', async ({ vexManagementPage }) => {
    await test.step('Create button', async () => {
      await expect.soft(vexManagementPage.createButton).toBeVisible();
    });

    await test.step('Disable and Delete are disabled when nothing is selected', async () => {
      await expect.soft(vexManagementPage.disableButton).toBeDisabled();
      await expect.soft(vexManagementPage.deleteButton).toBeDisabled();
    });

    await test.step('filter search is empty', async () => {
      await expect.soft(vexManagementPage.search).toBeVisible();
      await expect.soft(vexManagementPage.search).toHaveValue('');
    });

    await test.step('table columns and rows or empty state', async () => {
      for (const name of ['Status', 'Name', 'URI', 'Created by', 'Updated']) {
        await expect.soft(vexManagementPage.table.columnHeader(name)).toBeVisible();
      }
      await expect.soft(vexManagementPage.table.rows.first().or(vexManagementPage.table.emptyState)).toBeVisible();
    });
  });

  test('shows the row status, uri link and row action menu', { tag: '@needs-data' }, async ({ vexManagementPage }) => {
    const firstRow = vexManagementPage.table.rows.first();

    await test.step('status and uri link', async () => {
      await expect.soft(firstRow).toContainText(/Enabled|Disabled/);
      await expect.soft(firstRow.getByRole('link', { name: /^https?:\/\// })).toBeVisible();
    });

    await test.step('row action menu', async () => {
      await vexManagementPage.table.rowActionButton(0).click();
      // The first item toggles with the hub's state.
      await expect.soft(vexManagementPage.actionMenu.items).toHaveText([/^\s*(Disable|Enable)$/, 'Edit configuration', 'Edit YAML', 'Clone', 'Delete']);
      await vexManagementPage.actionMenu.close();
      await expect.soft(vexManagementPage.actionMenu.menu).toBeHidden();
    });
  });

  test('shows the create form defaults and returns to the list on cancel', async ({ vexManagementPage }) => {
    await vexManagementPage.openCreateForm();
    const form = vexManagementPage.createForm;

    await test.step('name, description and uri are empty', async () => {
      await expect.soft(form.name).toHaveAttribute('placeholder', 'A unique name');
      await expect.soft(form.name).toHaveValue('');
      await expect.soft(form.description).toHaveValue('');
      await expect.soft(form.uri).toHaveAttribute('placeholder', 'A valid URI address');
      await expect.soft(form.uri).toHaveValue('');
    });

    await test.step('Enabled is checked', async () => {
      await expect.soft(form.enabledCheckbox).toBeChecked();
    });

    // The VEX form has no client-side validation (unlike Registries), so whether Create is disabled
    // while empty depends on the Rancher version - only check that it is there.
    await test.step('Edit as YAML and Create buttons', async () => {
      await expect.soft(form.editAsYamlButton).toBeEnabled();
      await expect.soft(form.submitButton).toBeVisible();
    });

    await test.step('Cancel returns to the list', async () => {
      await expect(form.cancelButton).toBeEnabled();
      await form.cancelButton.click();
      await expect(vexManagementPage.heading).toBeVisible();
    });
  });

  test('shows the vex hub detail page', { tag: '@needs-data' }, async ({ vexManagementPage }) => {
    await vexManagementPage.openFirstVexHub();
    const detail = vexManagementPage.detail;

    await test.step('heading, status badge and Disable/Enable button', async () => {
      await expect.soft(detail.heading).toHaveText(/^VEX management:\s*\S+/i);
      await expect.soft(detail.statusBadge).toHaveText(/^(Enabled|Disabled)$/);
      await expect.soft(detail.toggleButton).toBeEnabled();
    });

    await test.step('vex hub information labels', async () => {
      await expect.soft(detail.uriLabel).toBeVisible();
      await expect.soft(detail.createdByLabel).toBeVisible();
      await expect.soft(detail.lastSyncLabel).toBeVisible();
      await expect.soft(detail.updatedLabel).toBeVisible();
    });

    await test.step('action menu', async () => {
      await detail.actionMenuButton.click();
      await expect.soft(vexManagementPage.actionMenu.items).toHaveText(['Edit configuration', 'Edit YAML', 'Clone', 'Delete']);
      await vexManagementPage.actionMenu.close();
      await expect.soft(vexManagementPage.actionMenu.menu).toBeHidden();
    });
  });
});
