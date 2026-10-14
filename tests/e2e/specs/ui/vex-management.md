# VEX Management UI Tests

## Application Overview

Test plan for the VEX Management page: the VEX hub list, the Create form, and the VEX hub detail page.

**Read-only:** open forms and menus, then Cancel/Escape. Never submit Create, Enable/Disable, or Delete.

One scenario = one test; each numbered step = one `test.step` with soft assertions (see `CLAUDE.md`).

## Test Scenarios

### 1. VEX Management

**Seed:** `tests/seed.spec.ts`

#### 1.1. page loads with the "VEX Management" heading

**File:** `tests/ui/vex-management.spec.ts`

**Tags:** @ui @smoke

**Steps:**
  1. Navigate to /imageScanner/sbomscanner.kubewarden.io.vexhub
    - expect: URL ends with sbomscanner.kubewarden.io.vexhub
    - expect: Heading 'VEX Management' is visible

#### 1.2. shows the list page controls and vex hub table

**File:** `tests/ui/vex-management.spec.ts`

**Tags:** @ui

**Steps:**
  1. Create button
    - expect: 'Create' button is visible
  2. Disable and Delete are disabled when nothing is selected
  3. filter search is empty
  4. table columns and rows or empty state
    - expect: Column headers: Status, Name, URI, Created by, Updated
    - expect: Either VEX hub rows or 'There are no rows to show.' is visible - accept both

#### 1.3. shows the row status, uri link and row action menu

**File:** `tests/ui/vex-management.spec.ts`

**Tags:** @ui @needs-data

**Steps:**
  1. status and uri link
    - expect: First row shows 'Enabled' or 'Disabled'
    - expect: First row has a link whose name starts with http(s)://
  2. row action menu
    - Open the first row's action menu
    - expect: Items are Disable or Enable (depends on the hub's state), Edit configuration, Edit YAML, Clone, Delete
    - Press Escape
    - expect: Menu is closed
    - expect: Note: Do not click any item

#### 1.4. shows the create form defaults and returns to the list on cancel

**File:** `tests/ui/vex-management.spec.ts`

**Tags:** @ui

**Steps:**
  1. Click Create (inside the test, not in beforeEach)
  2. name, description and uri are empty
    - expect: Name is empty with placeholder 'A unique name'
    - expect: Description is empty
    - expect: URI is empty with placeholder 'A valid URI address'
  3. Enabled is checked
  4. Edit as YAML and Create buttons
    - expect: 'Edit as YAML' is enabled; Create (submit) is visible
    - expect: Note: The VEX form has no client-side validation, so Create may be enabled while empty depending on the Rancher version
  5. Cancel returns to the list
    - expect: Cancel is enabled (hard assertion - the click depends on it)
    - Click Cancel
    - expect: List heading is visible again

#### 1.5. shows the vex hub detail page

**File:** `tests/ui/vex-management.spec.ts`

**Tags:** @ui @needs-data

**Steps:**
  1. Open the first VEX hub from the list
  2. heading, status badge and Disable/Enable button
    - expect: Heading matches 'VEX management: <name>' (case-insensitive)
    - expect: Status badge reads 'Enabled' or 'Disabled'
    - expect: The Disable/Enable button is enabled
    - expect: Note: Do not click it
  3. vex hub information labels
    - expect: URI, Created by, Last sync and Updated labels are visible
  4. action menu
    - Open the header action menu
    - expect: Items are Edit configuration, Edit YAML, Clone, Delete
    - Press Escape
    - expect: Menu is closed
