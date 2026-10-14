# Workloads Scan UI Tests

## Application Overview

Test plan for the Workloads Scan Configuration page, which configures automatic scanning of images in running pods.

**Read-only:** this page edits live cluster config. Never tick, select, type, or click Save.

One scenario = one test; each numbered step = one `test.step` with soft assertions (see `CLAUDE.md`).

## Test Scenarios

### 1. Workloads Scan

**Seed:** `tests/seed.spec.ts`

#### 1.1. page loads with the heading and a status badge

**File:** `tests/ui/workloads-scan.spec.ts`

**Tags:** @ui @smoke

**Steps:**
  1. Navigate to /imageScanner/sbomscanner.kubewarden.io.workloadscanconfiguration
    - expect: Redirects to .../default?mode=edit when the configuration exists, or to .../create on a fresh install
    - expect: Heading reads 'Workloads Scan Configuration' followed by an 'Active', 'Inactive' or 'Create' badge
    - expect: Note: Do not assert which one - it reflects the cluster state

#### 1.2. shows every section of the configuration form

**File:** `tests/ui/workloads-scan.spec.ts`

**Tags:** @ui

**Steps:**
  1. info banner and Enabled checkbox
    - expect: Info banner explaining Workloads Scan, with a documentation link
    - expect: 'Enabled' checkbox is visible (checked state is data-dependent)
  2. resource location
    - expect: 'Resource Location' section is visible
    - expect: One of the resource location banners is visible (edit warning, create-mode info, or locked-namespace info)
    - expect: Artifacts Namespace shows 'cattle-sbomscanner-system'
  3. authentication
    - expect: 'Authentication' section with the dropdown set to 'None'
    - expect: 'Allow insecure connections' checkbox is visible
    - expect: CA Cert Bundle textarea is visible and 'Read from File' is enabled
  4. scanning
    - expect: 'Scanning' section, scan interval select and scan-on-change checkbox are visible
  5. namespace selectors and platform filter
    - expect: Namespace selectors section with an enabled 'Add Rule' button
    - expect: Filter-by section with an enabled 'Add Platform' button
  6. Cancel and Save buttons
    - expect: Cancel is enabled and Save (edit) or Create (fresh install) is visible
    - expect: Note: Do not click it
