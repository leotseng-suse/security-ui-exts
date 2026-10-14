import { Locator, Page, expect } from '@playwright/test';
import { SortableTable } from './components/SortableTable';
import { filterSelect } from './components/form';

// SBOMScanner "Vulnerability Scanner > Images".
export class ImagesPage {
  readonly url = '/dashboard/c/local/imageScanner/images';

  // The title is a plain <div class="title"> with no heading role, so CSS is the only stable hook.
  readonly title: Locator;
  readonly downloadFullReportButton: Locator;

  readonly imageSearch: Locator;
  readonly severityFilter: Locator;
  readonly inUseFilter: Locator;
  readonly repositoryFilter: Locator;
  readonly registryFilter: Locator;
  readonly platformFilter: Locator;

  readonly downloadCustomReportButton: Locator;
  readonly groupByRepositoryCheckbox: Locator;
  readonly table: SortableTable;

  constructor(readonly page: Page) {
    const main = page.getByRole('main');

    this.title = main.locator('.header-section .title');
    this.downloadFullReportButton = main.getByRole('button', { name: 'Download full report' });

    this.imageSearch = main.getByPlaceholder('Search by name');
    this.severityFilter = filterSelect(main, 'Severity');
    this.inUseFilter = filterSelect(main, 'In use');
    this.repositoryFilter = filterSelect(main, 'Repository');
    this.registryFilter = filterSelect(main, 'Registry');
    this.platformFilter = filterSelect(main, 'Platform');

    this.downloadCustomReportButton = main.getByRole('button', { name: 'Download custom report' });
    this.groupByRepositoryCheckbox = main.getByRole('checkbox', { name: 'Group by repository' });
    this.table = new SortableTable(main);
  }

  async goto() {
    await this.page.goto(this.url);
  }

  // A cold Rancher load shows a full-page spinner for well over the default 5s.
  async expectLoaded() {
    await expect(this.title).toHaveText('Images', { timeout: 30_000 });
  }
}
