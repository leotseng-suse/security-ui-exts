import { test, expect } from '../../fixture/fixture';

// The only spec that navigates through the side menu; every other spec uses page.goto().
test.describe('Navigation', { tag: '@ui' }, () => {
  test('opens the dashboard from the "Vulnerability Scanner" menu entry', async ({ imagesPage, dashboardPage, sideNav }) => {
    await imagesPage.goto();
    await imagesPage.expectLoaded();

    await sideNav.vulnerabilityScannerLink.click();
    await expect(dashboardPage.page).toHaveURL(/\/imageScanner\/dashboard$/);
    await dashboardPage.expectLoaded();
  });

  test('opens images from the side menu', async ({ dashboardPage, imagesPage, sideNav }) => {
    await dashboardPage.goto();
    await dashboardPage.expectLoaded();

    await sideNav.imagesLink.click();
    await expect(imagesPage.page).toHaveURL(/\/imageScanner\/images$/);
    await imagesPage.expectLoaded();
  });

  test('opens workloads scan from the advanced group', async ({ dashboardPage, workloadsScanPage, sideNav }) => {
    await dashboardPage.goto();
    await dashboardPage.expectLoaded();

    await sideNav.expandAdvanced();
    await sideNav.workloadsScanLink.click();
    // The list route redirects to "default" in edit mode, or to the create form on a fresh install.
    await expect(workloadsScanPage.page).toHaveURL(workloadsScanPage.formUrl);
    await workloadsScanPage.expectLoaded();
  });

  test('opens registries configuration from the advanced group', async ({ dashboardPage, registriesPage, sideNav }) => {
    await dashboardPage.goto();
    await dashboardPage.expectLoaded();

    await sideNav.expandAdvanced();
    await sideNav.registriesLink.click();
    await expect(registriesPage.page).toHaveURL(/\/sbomscanner\.kubewarden\.io\.registry$/);
    await registriesPage.expectLoaded();
  });

  test('opens vex management from the advanced group', async ({ dashboardPage, vexManagementPage, sideNav }) => {
    await dashboardPage.goto();
    await dashboardPage.expectLoaded();

    await sideNav.expandAdvanced();
    await sideNav.vexManagementLink.click();
    await expect(vexManagementPage.page).toHaveURL(/\/sbomscanner\.kubewarden\.io\.vexhub$/);
    await vexManagementPage.expectLoaded();
  });
});
