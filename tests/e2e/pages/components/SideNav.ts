import { Locator, Page, expect } from '@playwright/test';

// Rancher's cluster side menu, "Vulnerability Scanner" group.
// The group header itself links to the SBOMScanner dashboard; there is no separate "Dashboard" entry.
export class SideNav {
  readonly root: Locator;
  readonly vulnerabilityScannerLink: Locator;
  readonly imagesLink: Locator;
  readonly advancedGroup: Locator;
  readonly workloadsScanLink: Locator;
  readonly registriesLink: Locator;
  readonly vexManagementLink: Locator;

  constructor(readonly page: Page) {
    this.root = page.getByRole('navigation', { name: 'Secondary menu' });
    this.vulnerabilityScannerLink = this.root.getByRole('link', { name: 'Vulnerability Scanner', exact: true });
    this.imagesLink = this.root.getByRole('link', { name: 'Images', exact: true });
    this.advancedGroup = this.root.getByRole('button', { name: 'Advanced', exact: true });
    this.workloadsScanLink = this.root.getByRole('link', { name: 'Workloads Scan', exact: true });
    this.registriesLink = this.root.getByRole('link', { name: 'Registries Configuration', exact: true });
    this.vexManagementLink = this.root.getByRole('link', { name: 'VEX Management', exact: true });
  }

  // Expanding a Rancher nav group also navigates to its first entry (Workloads Scan).
  async expandAdvanced() {
    if ((await this.advancedGroup.getAttribute('aria-expanded')) !== 'true') {
      await this.advancedGroup.click();
    }
    await expect(this.advancedGroup).toHaveAttribute('aria-expanded', 'true');
  }
}
