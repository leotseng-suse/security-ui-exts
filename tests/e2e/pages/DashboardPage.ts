import { Locator, Page, expect } from '@playwright/test';

// SBOMScanner "Vulnerability Scanner > Dashboard".
// With no scan jobs the page renders only the empty state (no header, filter or stats).
export class DashboardPage {
  readonly url = '/dashboard/c/local/imageScanner/dashboard';

  // The title is a plain <div class="title"> with no heading role, so CSS is the only stable hook.
  readonly title: Locator;
  readonly subtitle: Locator;
  readonly emptyStateHeading: Locator;
  readonly registryFilter: Locator;

  readonly scanningStatsHeading: Locator;
  readonly totalScannedText: Locator;
  readonly lastScanLabel: Locator;
  readonly noScanYetText: Locator;
  readonly failedImagesValue: Locator;
  readonly failedImagesLabel: Locator;
  readonly detectedErrorsValue: Locator;
  readonly detectedErrorsLabel: Locator;

  constructor(readonly page: Page) {
    const main = page.getByRole('main');

    this.title = main.locator('.header-section .title');
    this.subtitle = main.getByText(/^Main highlights as of/);
    this.emptyStateHeading = main.getByRole('heading', { name: 'No scan results to show' });
    this.registryFilter = main.getByRole('combobox', { name: 'Search for option' });

    this.scanningStatsHeading = main.getByRole('heading', { name: 'Scanning stats' });
    this.totalScannedText = main.getByText(/^\d+ images? scanned in total$/);
    this.lastScanLabel = main.getByText('passed since the last scan', { exact: true });
    this.noScanYetText = main.getByText('No scan has been run yet', { exact: true });
    this.failedImagesValue = main.getByText(/^\d+ images?$/);
    this.failedImagesLabel = main.getByText('failed to be scanned', { exact: true });
    this.detectedErrorsValue = main.getByText(/^\d+ errors?$/);
    this.detectedErrorsLabel = main.getByText('detected in the last scan', { exact: true });
  }

  async goto() {
    await this.page.goto(this.url);
  }

  // Either the populated dashboard or its empty state counts as loaded.
  // A cold Rancher load shows a full-page spinner for well over the default 5s.
  async expectLoaded() {
    await expect(this.title.or(this.emptyStateHeading)).toBeVisible({ timeout: 30_000 });
  }
}
