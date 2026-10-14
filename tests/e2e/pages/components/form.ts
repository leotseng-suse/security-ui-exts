import { Locator } from '@playwright/test';

// Matches a field label with or without Rancher's trailing required marker ("Namespace *").
function labelText(label: string): RegExp {
  return new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\*?$`);
}

// LabeledSelect's comboboxes are only named "Search for option", so scope by the .labeled-select wrapper
// that also holds the field label.
export function labeledSelect(scope: Locator, label: string): Locator {
  return scope.locator('.labeled-select').filter({ has: scope.page().getByText(labelText(label)) });
}

// List-page filter rows use a bare <label> with no `for`/aria link, so scope by the .filter-item wrapper.
function filterItem(scope: Locator, label: string): Locator {
  return scope.locator('.filter-item').filter({ has: scope.page().getByText(label, { exact: true }) });
}

export function filterTextbox(scope: Locator, label: string): Locator {
  return filterItem(scope, label).getByRole('textbox');
}

// LabeledSelect nests two comboboxes; the inner "Search for option" one holds the selected value.
export function filterSelect(scope: Locator, label: string): Locator {
  return filterItem(scope, label).getByRole('combobox', { name: 'Search for option' });
}
