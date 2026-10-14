# Registries Configuration UI Tests

## Application Overview

Test plan for the Registries Configuration page: the registry list, the Create form, and the registry detail page.

**Read-only:** open forms and menus, then Cancel/Escape. Never submit Create, Start scan, or Delete.

One scenario = one test; each numbered step = one `test.step` with soft assertions (see `CLAUDE.md`).

## Test Scenarios

### 1. Registries Configuration

**Seed:** `tests/seed.spec.ts`

#### 1.1. page loads with the "Registries Configuration" heading

**File:** `tests/ui/registries.spec.ts`

**Tags:** @ui @smoke

**Steps:**
  1. Navigate to /imageScanner/sbomscanner.kubewarden.io.registry
    - expect: URL ends with sbomscanner.kubewarden.io.registry
    - expect: Heading 'Registries Configuration' is visible

#### 1.2. shows the list page controls and registry table

**File:** `tests/ui/registries.spec.ts`

**Tags:** @ui

**Steps:**
  1. Create button
    - expect: 'Create' button is visible
  2. search filters are empty and status is "Any"
    - expect: Registry search (placeholder 'Search by name'), URI search ('Search by address') and Repositories search ('Search by name') are empty
    - expect: Status filter shows 'Any'
  3. Start scan and Delete are disabled when nothing is selected
  4. table columns and rows or empty state
    - expect: Column headers: Registry, Namespace, URI, Repositories, Scan interval, Status, Progress, Previous scan
    - expect: Either registry rows or 'There are no rows to show.' is visible - accept both

#### 1.3. shows the status panels and the row action menu

**File:** `tests/ui/registries.spec.ts`

**Tags:** @ui @needs-data

**Steps:**
  1. status panels
    - expect: 'Latest status updates' and 'Status distribution' panels are visible
  2. row action menu
    - Open the first row's action menu
    - expect: Items are Start scan, Edit Config, Edit YAML, Clone, Delete
    - Press Escape
    - expect: Menu is closed
    - expect: Note: Do not click any item

#### 1.4. shows the create form defaults and returns to the list on cancel

**File:** `tests/ui/registries.spec.ts`

**Tags:** @ui

**Steps:**
  1. Click Create (inside the test, not in beforeEach)
  2. namespace, name and description
    - expect: Namespace select is visible (Rancher pre-selects it from the namespace filter, so don't assert the value)
    - expect: Name is empty with placeholder 'A unique name'; Description is empty
  3. type "OCI Distribution" and uri "ghcr.io"
  4. CA cert bundle, insecure connections and authentication
    - expect: CA Cert Bundle is empty and 'Read from File' is enabled
    - expect: 'Allow insecure connections' is unchecked
    - expect: Authentication shows 'None'
  5. repositories, scan interval "Manual" and platforms
    - expect: Repositories field is visible, scan interval shows 'Manual', 'Add Platform' is enabled
  6. Create is disabled until the required fields are filled
    - expect: 'Edit as YAML' is enabled; Create (submit) is disabled
  7. Cancel returns to the list
    - expect: Cancel is enabled (hard assertion - the click depends on it)
    - Click Cancel
    - expect: List heading is visible again

#### 1.5. shows the registry detail page

**File:** `tests/ui/registries.spec.ts`

**Tags:** @ui @needs-data

**Steps:**
  1. Open the first registry from the list
  2. heading, status badge and Start scan
    - expect: Heading matches 'Registries Configuration: <name>'
    - expect: Status badge is visible; 'Start scan' is enabled
    - expect: Note: Do not click Start scan
  3. registry information labels
    - expect: Namespace, URI, Scan interval, Repositories and Platforms labels are visible
  4. recent scans table columns
    - expect: Status, Since, Progress, Images scanned, Images found, Error
  5. action menu
    - Open the header action menu
    - expect: Items are Edit Config, Edit YAML, Clone, Delete
    - Press Escape
    - expect: Menu is closed
