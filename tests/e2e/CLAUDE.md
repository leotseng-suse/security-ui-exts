# SBOMScanner UI e2e tests — conventions

Playwright tests for the SBOMScanner Rancher UI extension ("Vulnerability Scanner" in the
Rancher side menu). Run everything from this folder (`tests/e2e`). Credentials and
`RANCHER_URL` come from `../.env`.

## Layout

```
tests/e2e/
├── pages/                  # Page objects — the only place locators live
│   ├── components/         # Shared Rancher widgets (side nav, sortable table, action menu, ...)
│   └── <Name>Page.ts       # One class per page: DashboardPage, ImagesPage, ...
├── fixture/fixture.ts      # Exposes page objects as fixtures (dashboardPage, imagesPage, ...)
├── tests/
│   ├── global.setup.ts     # Logs in once, saves storage state
│   ├── data.setup.ts       # Seeds registry "e2e-seed" + a completed scan for @needs-data tests
│   ├── seed.spec.ts        # Seed for the Playwright agents
│   ├── ui/                 # Phase 1: basic UI element checks (read-only)
│   └── functional/         # Phase 2 (later): CRUD, scans, downloads
└── specs/                  # Markdown test plans written by the planner agent
```

## Naming

- Spec files: kebab-case, one per page: `tests/ui/images.spec.ts`, `tests/ui/vex-management.spec.ts`.
- `test.describe` = page name as shown in the UI, plus tags:
  `test.describe('Images', { tag: '@ui' }, () => { ... })`.
- Test titles describe behaviour in plain sentences, lower case:
  `'shows the list page controls and registry table'`, `'shows the create form defaults and returns to the list on cancel'`.
  No `***`, no `>` breadcrumbs, no numbered copies of the same test.
- Page objects: `<Name>Page` (no `Enhanced` suffix); fixtures use camelCase of the class name.

## Tags

| Tag | Meaning |
|---|---|
| `@ui` | Read-only checks of page elements and their default state |
| `@smoke` | Small subset of `@ui` that proves each page loads |
| `@functional` | Changes cluster state (create/edit/delete/scan) |
| `@needs-data` | Requires a registry, a completed scan and scanned images. Runs in the `chromium-data` project after `data.setup.ts` seeds them |

## Rules for `@ui` tests

- **Read-only.** Never click Save, Create (form submit), Delete confirm, Start scan, Enable/Disable,
  or anything that changes cluster state. Opening a form or menu and then Cancel/Escape is fine.
- **Data-independent.** The cluster may have empty tables. Assert structure (headings, column headers,
  controls, default values) and accept either rows or the `There are no rows to show.` empty state.
  Never assert counts, dates, or durations (e.g. "19 days").
- `@needs-data` tests may rely only on what `data.setup.ts` seeds (registry `e2e-seed`, one completed
  scan, its images) plus the VEX hubs SBOMScanner installs by default. Seed more data there, via the API -
  never create data through the UI inside a `@ui` test.
- Navigate with `page.goto(pageObject.url)` in each test; only `navigation.spec.ts` uses the side menu.
- Each test is independent — no ordering, no shared state between tests.

## Test structure: one scenario per area

Every test pays for a new browser context and a full Rancher page load (~8s), so don't write one
test per element. Per spec:

- One `@smoke` test that only proves the page loads (URL + heading).
- One test per **area** of the page (list controls and table, row menu, create form, detail page,
  form section group). Each area check is a `test.step('<area>', ...)` with `expect.soft`, so one
  failing element doesn't hide the rest.
- Use a hard `expect` only before an action that later steps depend on (e.g. the Cancel button is
  enabled before clicking it).
- Keep `@needs-data` checks in their own tests. Never put them in a test that must pass on an empty
  cluster, otherwise the tag filter can't exclude them.
- Open forms or detail pages inside the test (`await registriesPage.openCreateForm()`), not in a
  nested `beforeEach`.
- `navigation.spec.ts` is the exception: one test per side-menu entry.

## Locators and waiting

- Prefer `getByRole` > `getByLabel` / `getByPlaceholder` > `getByTestId` > `getByText`.
  CSS like `.col.span-12 > ...` or `nth-of-type` only as a last resort, with a comment why.
- Locators are `readonly` `Locator` properties on the page object, built in the constructor.
- Use web-first assertions (`await expect(locator).toBeVisible()`). No `waitForTimeout`, no `delay()`,
  no `setTimeout`. Always `await` every `expect`.
- Page objects expose a `url`, a `goto()`, and an `expectLoaded()` that asserts the heading.
  Keep other assertions in the spec, not hidden inside page-object helpers.
- No `console.log` banners; use `test.step()` if a test needs structure in the report.

## Legacy code

The old suite was removed. For its CRUD flows (registries, VEX), use git history as reference when
writing `@functional` tests, e.g. `git show main:tests/e2e/tests/sbomscanner_vex_management.test.ts`.
