import { Locator, Page, expect } from '@playwright/test';
import { labeledSelect } from './components/form';

// SBOMScanner "Vulnerability Scanner > Advanced > Workloads Scan".
// A form for the cluster's single WorkloadScanConfiguration ("default") - never Save/Create from @ui tests.
// The list URL redirects to "default?mode=edit" when the config exists, or to "create" on a fresh install.
export class WorkloadsScanPage {
  readonly url = '/dashboard/c/local/imageScanner/sbomscanner.kubewarden.io.workloadscanconfiguration';
  readonly formUrl = /\/sbomscanner\.kubewarden\.io\.workloadscanconfiguration\/(default\?mode=edit|create)$/;

  // The <h1> also contains the status badge, so its accessible name is
  // "Workloads Scan Configuration Active|Inactive" (edit) or "... Create" (fresh install).
  readonly heading: Locator;
  readonly infoBanner: Locator;
  readonly documentationLink: Locator;
  readonly enabledCheckbox: Locator;

  readonly resourceLocationLabel: Locator;
  readonly resourceLocationWarning: Locator;
  readonly resourceLocationLockedInfo: Locator;
  readonly artifactsNamespaceSelect: Locator;

  readonly authenticationLabel: Locator;
  readonly authenticationSelect: Locator;
  readonly allowInsecureCheckbox: Locator;
  readonly caCertBundle: Locator;
  readonly readFromFileButton: Locator;

  readonly scanningLabel: Locator;
  readonly scanIntervalSelect: Locator;
  readonly scanOnChangeCheckbox: Locator;
  readonly namespaceSelectorsLabel: Locator;
  readonly addRuleButton: Locator;
  readonly filterByLabel: Locator;
  readonly addPlatformButton: Locator;

  readonly cancelButton: Locator;
  readonly saveButton: Locator;

  constructor(readonly page: Page) {
    const main = page.getByRole('main');

    this.heading = main.getByRole('heading', { level: 1, name: /^Workloads Scan Configuration/ });
    this.infoBanner = main.getByText(/^The Workloads Scan automatically discovers images in running pods/);
    this.documentationLink = main.getByRole('link', { name: /documentation/ });
    this.enabledCheckbox = main.getByRole('checkbox', { name: 'Enabled', exact: true });

    // Section titles are plain <div class="input-label">, not headings.
    this.resourceLocationLabel = main.getByText('Resource Location', { exact: true });
    // Edit mode warns about rescans; create mode only explains the default.
    this.resourceLocationWarning = main.getByText(/^(Changing the Artifacts Namespace is an expensive operation|If the Artifacts Namespace is not specified)/);
    this.resourceLocationLockedInfo = main.getByText(/^If you want to change the Artifacts Namespace, first you have to disable/);
    this.artifactsNamespaceSelect = labeledSelect(main, 'Artifacts Namespace');

    // The section title comes before the select's own "Authentication" label.
    this.authenticationLabel = main.getByText('Authentication', { exact: true }).first();
    this.authenticationSelect = labeledSelect(main, 'Authentication');
    this.allowInsecureCheckbox = main.getByRole('checkbox', { name: /^Allow insecure connections/ });
    this.caCertBundle = main.getByRole('textbox', { name: 'CA Cert Bundle' });
    this.readFromFileButton = main.getByRole('button', { name: 'Read from File' });

    this.scanningLabel = main.getByText('Scanning', { exact: true });
    this.scanIntervalSelect = labeledSelect(main, 'Scan Interval');
    this.scanOnChangeCheckbox = main.getByRole('checkbox', { name: /^Scan on registry change/ });
    this.namespaceSelectorsLabel = main.getByText('Namespace selectors', { exact: true });
    this.addRuleButton = main.getByRole('button', { name: 'Add Rule' });
    this.filterByLabel = main.getByText('Filter by', { exact: true });
    this.addPlatformButton = main.getByRole('button', { name: 'Add Platform' });

    this.cancelButton = main.getByRole('button', { name: 'Cancel' });
    // "Save" in edit mode, "Create" on a fresh install.
    this.saveButton = main.getByRole('button', { name: /^(Save|Create)$/ });
  }

  async goto() {
    await this.page.goto(this.url);
  }

  // A cold Rancher load shows a full-page spinner for well over the default 5s.
  async expectLoaded() {
    await expect(this.heading).toBeVisible({ timeout: 30_000 });
  }
}
