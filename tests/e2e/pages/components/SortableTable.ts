import { Locator } from '@playwright/test';

// Rancher's SortableTable / PaginatedResourceTable (rows carry data-testid="sortable-table-<i>-row").
export class SortableTable {
  readonly rows: Locator;
  readonly emptyState: Locator;

  constructor(readonly root: Locator) {
    this.rows = root.getByTestId(/^sortable-table-\d+-row$/);
    this.emptyState = root.getByText('There are no rows to show.');
  }

  columnHeader(name: string): Locator {
    return this.root.getByRole('columnheader', { name, exact: true });
  }

  // The ⋮ button at the end of a row, named "More actions - <namespace>/<name>".
  rowActionButton(index: number): Locator {
    return this.root.getByTestId(`sortable-table-${index}-action-button`);
  }

  // The resource name link in a row, which opens its detail page.
  rowLink(index: number): Locator {
    return this.root.getByTestId(`sortable-table-${index}-row`).getByRole('link').first();
  }
}
