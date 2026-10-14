import { Locator, Page } from '@playwright/test';

// Rancher's RcDropdown action menu (role="menu" with role="menuitem" items).
// It is teleported to the end of <body>, so it is looked up from the page, not from <main>.
export class ActionMenu {
  readonly menu: Locator;
  readonly items: Locator;

  constructor(readonly page: Page) {
    this.menu = page.getByRole('menu');
    this.items = this.menu.getByRole('menuitem');
  }

  async close() {
    await this.page.keyboard.press('Escape');
  }
}
