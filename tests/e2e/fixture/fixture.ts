/* Filename: fixture.ts
 * Test fixture that provides the page objects (see pages/index.ts)
 */

import { test as base, expect } from '@playwright/test';
import {
  DashboardPage,
  ImagesPage,
  WorkloadsScanPage,
  RegistriesPage,
  VexManagementPage,
  SideNav
} from '../pages';

type PageObjects = {
  dashboardPage: DashboardPage;
  imagesPage: ImagesPage;
  workloadsScanPage: WorkloadsScanPage;
  registriesPage: RegistriesPage;
  vexManagementPage: VexManagementPage;
  sideNav: SideNav;
};

export const test = base.extend<PageObjects>({
  page: async ({ page }, use) => {
    const consolelogs: string[] = [];

    // capture errors like failed network calls, etc.
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consolelogs.push(`[${msg.type()}] ${msg.text()}`);
      }
    });

    // capture uncaught exceptions error
    page.on('pageerror', (exception) => {
      consolelogs.push(`[${exception.name}] ${exception.message}`);
    });

    await use(page);

    // assertions - can be disabled via SHOW_CONSOLE_ERRORS=false for demo screenshots
    const showConsoleErrors = process.env.SHOW_CONSOLE_ERRORS !== 'false';

    if (showConsoleErrors) {
      console.log("");
      console.log(" ------------------------------------------------------------------------- ");
      console.log(" >>> Captured Browser Console Log Errors <<<  ");
      console.log(" ------------------------------------------------------------------------- ");
      console.log(consolelogs);
      console.log("");
      console.log(" ------------------------------------------------------------------------- ");
      console.log("");
    }

    /* Failed the test if error is captured in the console log */
    // expect(consolelogs).toStrictEqual([]);
    // expect(consolelogs).toHaveLength(0);
  },

  // Provide page objects as fixtures
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  imagesPage: async ({ page }, use) => {
    await use(new ImagesPage(page));
  },

  workloadsScanPage: async ({ page }, use) => {
    await use(new WorkloadsScanPage(page));
  },

  registriesPage: async ({ page }, use) => {
    await use(new RegistriesPage(page));
  },

  vexManagementPage: async ({ page }, use) => {
    await use(new VexManagementPage(page));
  },

  sideNav: async ({ page }, use) => {
    await use(new SideNav(page));
  },
});

export { expect };
