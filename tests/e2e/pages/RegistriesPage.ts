import { Locator, Page, expect } from '@playwright/test';
import { ActionMenu } from './components/ActionMenu';
import { SortableTable } from './components/SortableTable';
import { filterSelect, filterTextbox, labeledSelect } from './components/form';

// SBOMScanner "Vulnerability Scanner > Advanced > Registries configuration": list, Create form and detail page.
export class RegistriesPage {
  readonly url = '/dashboard/c/local/imageScanner/sbomscanner.kubewarden.io.registry';

  readonly heading: Locator;
  readonly createButton: Locator;

  // Rendered only once at least one scan job exists.
  readonly latestStatusUpdatesPanel: Locator;
  readonly statusDistributionPanel: Locator;

  readonly registryFilter: Locator;
  readonly uriFilter: Locator;
  readonly repositoriesFilter: Locator;
  readonly statusFilter: Locator;

  readonly startScanButton: Locator;
  readonly deleteButton: Locator;
  readonly table: SortableTable;
  readonly actionMenu: ActionMenu;

  readonly createForm: {
    readonly heading: Locator;
    readonly namespace: Locator;
    readonly name: Locator;
    readonly description: Locator;
    readonly type: Locator;
    readonly uri: Locator;
    readonly caCertBundle: Locator;
    readonly readFromFileButton: Locator;
    readonly allowInsecureCheckbox: Locator;
    readonly authentication: Locator;
    readonly repositories: Locator;
    readonly scanInterval: Locator;
    readonly addPlatformButton: Locator;
    readonly cancelButton: Locator;
    readonly editAsYamlButton: Locator;
    readonly submitButton: Locator;
  };

  readonly detail: {
    readonly heading: Locator;
    readonly statusBadge: Locator;
    readonly startScanButton: Locator;
    readonly actionMenuButton: Locator;
    readonly namespaceLabel: Locator;
    readonly uriLabel: Locator;
    readonly scanIntervalLabel: Locator;
    readonly repositoriesLabel: Locator;
    readonly platformsLabel: Locator;
    readonly recentScansTable: SortableTable;
  };

  constructor(readonly page: Page) {
    const main = page.getByRole('main');

    this.heading = main.getByRole('heading', { level: 1, name: 'Registries Configuration' });
    this.createButton = main.getByTestId('masthead-create');

    this.latestStatusUpdatesPanel = main.getByText('Latest status updates', { exact: true });
    this.statusDistributionPanel = main.getByText('Status distribution', { exact: true });

    this.registryFilter = filterTextbox(main, 'Registry');
    this.uriFilter = filterTextbox(main, 'URI');
    this.repositoriesFilter = filterTextbox(main, 'Repositories');
    this.statusFilter = filterSelect(main, 'Status');

    this.startScanButton = main.getByRole('button', { name: 'Start scan' });
    this.deleteButton = main.getByRole('button', { name: 'Delete' });
    this.table = new SortableTable(main);
    this.actionMenu = new ActionMenu(page);

    this.createForm = {
      // Breadcrumb link + text; the link's own name drops the colon, so the heading is "Registries Configuration Create".
      heading: main.getByRole('heading', { level: 1, name: /^Registries Configuration:?\s*Create$/ }),
      namespace: labeledSelect(main, 'Namespace'),
      name: main.getByRole('textbox', { name: 'Registry' }),
      description: main.getByRole('textbox', { name: 'Description' }),
      type: labeledSelect(main, 'Type'),
      uri: main.getByRole('textbox', { name: 'URI' }),
      caCertBundle: main.getByRole('textbox', { name: 'CA Cert Bundle' }),
      readFromFileButton: main.getByRole('button', { name: 'Read from File' }),
      allowInsecureCheckbox: main.getByRole('checkbox', { name: /^Allow insecure connections/ }),
      authentication: labeledSelect(main, 'Authentication'),
      repositories: labeledSelect(main, 'Repositories to scan'),
      scanInterval: labeledSelect(main, 'Scan Interval'),
      addPlatformButton: main.getByRole('button', { name: 'Add Platform' }),
      cancelButton: main.getByTestId('form-cancel'),
      editAsYamlButton: main.getByTestId('form-yaml'),
      submitButton: main.getByTestId('form-save'),
    };

    const detailHeading = main.getByRole('heading', { level: 1, name: /^Registries Configuration:/ });
    this.detail = {
      heading: detailHeading,
      // StatusBadge has no role or accessible name of its own.
      statusBadge: detailHeading.locator('.badge'),
      startScanButton: main.getByRole('button', { name: 'Start scan' }),
      actionMenuButton: main.getByRole('button', { name: /^More actions/ }),
      namespaceLabel: main.getByText('Namespace', { exact: true }),
      uriLabel: main.getByText('URI', { exact: true }),
      scanIntervalLabel: main.getByText('Scan Interval', { exact: true }),
      repositoriesLabel: main.getByText('Repositories', { exact: true }),
      platformsLabel: main.getByText('Platforms', { exact: true }),
      recentScansTable: new SortableTable(main),
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

  async openFirstRegistry() {
    await this.table.rowLink(0).click();
    await expect(this.detail.heading).toBeVisible();
  }
}
