# Images UI Tests

## Application Overview

Test plan for the Images page, which displays scanned container images with filtering and download capabilities.

One scenario = one test; each numbered step = one `test.step` with soft assertions (see `CLAUDE.md`).

## Test Scenarios

### 1. Images

**Seed:** `tests/seed.spec.ts`

#### 1.1. page loads with the "Images" heading

**File:** `tests/ui/images.spec.ts`

**Tags:** @ui @smoke

**Steps:**
  1. Navigate to /imageScanner/images
    - expect: URL matches imageScanner/images
    - expect: Page heading reads 'Images'

#### 1.2. shows the filters, report buttons and image table

**File:** `tests/ui/images.spec.ts`

**Tags:** @ui

**Steps:**
  1. image reference search is empty
    - expect: Search box is visible and empty
  2. filters default to "Any"
    - expect: Severity, In use, Repository, Registry and Platform filters all show 'Any'
  3. report buttons
    - expect: 'Download full report' button is visible
    - expect: 'Download custom report' button is visible and disabled (nothing selected)
    - expect: Note: Do not click either button - it triggers a download
  4. "Group by repository" is unchecked
    - expect: Checkbox 'Group by repository' is visible and unchecked
  5. table columns and rows or empty state
    - expect: Column headers: Image reference, Affecting CVEs, In use, Repository, Registry, Platform, Digest
    - expect: Either image rows or 'There are no rows to show.' is visible - accept both

#### 1.3. enables download full report when images exist

**File:** `tests/ui/images.spec.ts`

**Tags:** @ui @needs-data

**Steps:**
  1. Check the table and the full report button
    - expect: At least one image row is visible
    - expect: 'Download full report' button is enabled
