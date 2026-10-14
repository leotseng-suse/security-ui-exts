# Dashboard UI Tests

## Application Overview

Test plan for the SBOMScanner Dashboard page, which displays scanning statistics and registry scan status.

One scenario = one test; each numbered step = one `test.step` with soft assertions (see `CLAUDE.md`).

## Test Scenarios

### 1. Dashboard

**Seed:** `tests/seed.spec.ts`

#### 1.1. loads the dashboard or its empty state

**File:** `tests/ui/dashboard.spec.ts`

**Tags:** @ui @smoke

**Steps:**
  1. Navigate to /imageScanner/dashboard
    - expect: URL matches imageScanner/dashboard
    - expect: Either the 'Dashboard' heading or the empty-state heading is visible

#### 1.2. shows the header, registry filter and scanning stats

**File:** `tests/ui/dashboard.spec.ts`

**Tags:** @ui @needs-data

**Steps:**
  1. header
    - expect: Page heading contains 'Dashboard'
    - expect: Subtitle starting with 'Main highlights as of' is visible
    - expect: Note: Do not assert the date/time that follows - it changes on every load
  2. registry filter defaults to "All matching registries"
    - expect: Dropdown is visible in the top right area with value 'All matching registries'
  3. scanning stats
    - expect: Heading 'Scanning stats' is visible
    - expect: '[number] image(s) scanned in total' is visible
    - expect: 'passed since the last scan' or the no-scan-yet text is visible
    - expect: Failed images value and 'failed to be scanned' label are visible
    - expect: Detected errors value and 'detected in the last scan' label are visible
    - expect: Note: Do not assert numbers or durations - they are data-dependent
