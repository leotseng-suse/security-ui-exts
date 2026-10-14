import { Locator, Page, expect } from '@playwright/test';
import { ActionMenu } from './components/ActionMenu';
import { SortableTable } from './components/SortableTable';

// SBOMScanner "Vulnerability Scanner > Advanced > VEX Management": list, Create form and detail page.
export class VexManagementPage {
  readonly url = '/dashboard/c/local/imageScanner/sbomscanner.kubewarden.io.vexhub';

  readonly heading: Locator;
  readonly createButton: Locator;
  readonly disableButton: Locator;
  readonly deleteButton: Locator;
  readonly search: Locator;
  readonly table: SortableTable;
  readonly actionMenu: ActionMenu;

  readonly createForm: {
    readonly heading: Locator;
    readonly name: Locator;
    readonly description: Locator;
    readonly uri: Locator;
    readonly enabledCheckbox: Locator;
    readonly cancelButton: Locator;
    readonly editAsYamlButton: Locator;
    readonly submitButton: Locator;
  };

  readonly detail: {
    readonly heading: Locator;
    readonly statusBadge: Locator;
    readonly toggleButton: Locator;
    readonly actionMenuButton: Locator;
    readonly uriLabel: Locator;
    readonly createdByLabel: Locator;
    readonly lastSyncLabel: Locator;
    readonly updatedLabel: Locator;
  };

  constructor(readonly page: Page) {
    const main = page.getByRole('main');

    // The list masthead also holds a star button, so match the name as a prefix.
    this.heading = main.getByRole('heading', { level: 1, name: /^VEX Management/i });
    this.createButton = main.getByTestId('masthead-create');
    this.disableButton = main.getByRole('button', { name: 'Disable' });
    this.deleteButton = main.getByRole('button', { name: 'Delete' });
    this.search = main.getByRole('searchbox', { name: 'Filter table results' });
    this.table = new SortableTable(main);
    this.actionMenu = new ActionMenu(page);

    this.createForm = {
      heading: main.getByRole('heading', { level: 1, name: /^VEX Management:?\s*Create$/i }),
      name: main.getByRole('textbox', { name: 'Name' }),
      description: main.getByRole('textbox', { name: 'Description' }),
      uri: main.getByRole('textbox', { name: 'VEX hub URI' }),
      enabledCheckbox: main.getByRole('checkbox', { name: /^Enabled/ }),
      cancelButton: main.getByTestId('form-cancel'),
      editAsYamlButton: main.getByTestId('form-yaml'),
      submitButton: main.getByTestId('form-save'),
    };

    const detailHeading = main.getByRole('heading', { level: 1, name: /^VEX management:/i });
    this.detail = {
      heading: detailHeading,
      // StatusBadge has no role or accessible name of its own.
      statusBadge: detailHeading.locator('.badge'),
      // Matched by text: the extension sets aria-label="Refresh data" on this button (VexDetails.vue).
      toggleButton: main.getByRole('button').filter({ hasText: /(Disable|Enable)\s*$/ }),
      actionMenuButton: main.getByTestId('masthead-action-menu'),
      uriLabel: main.getByText('URI', { exact: true }),
      createdByLabel: main.getByText('Created by', { exact: true }),
      lastSyncLabel: main.getByText('Last sync', { exact: true }),
      updatedLabel: main.getByText('Updated', { exact: true }),
    };
  }

  async goto() {
    await this.page.goto(this.url);
  }

  // A cold Rancher load shows a full-page spinner for well over the default 5s.
  async expectLoaded() {
    await expect(this.heading).toBeVisible({ timeout: 30_000 });
  }

  async openCreateForm() {
    await this.createButton.click();
    await expect(this.createForm.heading).toBeVisible();
  }

  async openFirstVexHub() {
    await this.table.rowLink(0).click();
    await expect(this.detail.heading).toBeVisible();
  }
}
