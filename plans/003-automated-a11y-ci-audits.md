# Plan 003: Add automated accessibility audits as a focused CI gate

> **Executor instructions**: Follow this plan step by step. Run every verification command and
> confirm the expected result before moving to the next step. If anything in the "STOP conditions"
> section occurs, stop and report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they maintain the index.
>
> **Drift check (run first)**:
> `git diff --stat 71a9d27..HEAD -- package.json .github/workflows/ci.yml CONTRIBUTING.md docs/accessibility-testing.md packages/docs/e2e/a11y-utils.ts packages/docs/e2e/a11y.spec.ts packages/docs/e2e/components-smoke.spec.ts packages/docs/e2e/formisch.spec.ts`
> If any existing in-scope file changed since this plan was written, compare the "Current state"
> excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none
- **Category**: tests / dx
- **Planned at**: commit `71a9d27`, 2026-08-29

## Why this matters

Kamod UI already uses Playwright and `@axe-core/playwright`, but the browser accessibility checks do
not run in GitHub CI or the publish workflow. The existing Axe coverage is manually limited to nine
scans in two specs, while the generated documentation manifest contains 70 routes and hundreds of
examples. This plan adds a cost-bounded Chromium-only CI gate, automatically covers every manifest
route, checks important open overlay states, and adds a conservative static JSX accessibility gate
without re-enabling the full visual/WebKit E2E suite.

## Current state

### Relevant files

- `package.json` — root scripts used by contributors and CI.
- `.github/workflows/ci.yml` — the only pull-request CI workflow; currently has no browser job.
- `packages/docs/package.json` — owns Playwright, Axe, and docs scripts.
- `packages/docs/playwright.config.ts` — starts the docs server and defines Chromium, WebKit, and
  iPhone projects.
- `packages/docs/src/docs/generated-manifest.ts` — generated catalog of 70 documentation slugs and
  their section ids; this is the source of truth for automatic route coverage.
- `packages/docs/e2e/components-smoke.spec.ts` — contains eight manually written Axe scans mixed
  into a broad smoke/visual spec.
- `packages/docs/e2e/formisch.spec.ts` — contains one Axe scan whose blocking policy is only
  `serious` and `critical`.
- `packages/docs/src/docs/DocsComponentContent.tsx` — renders all component examples under `main`;
  previews use `.preview`, and overlay content may be portaled outside the originating section.
- `CONTRIBUTING.md` — documents the repository's verification commands.

### Existing scripts and CI gap

`package.json:30-37` currently separates unit tests from E2E:

```json
"test:ci": "pnpm test && pnpm test:openui && pnpm --filter @kamod-ch/ui build && pnpm --filter @kamod-ch/openui build && pnpm test:docs",
"test:docs": "pnpm --filter @kamod-ch/ui-docs test",
"test:e2e": "pnpm --filter @kamod-ch/ui-docs test:e2e"
```

`.github/workflows/ci.yml:57-61` only invokes the first command and then builds:

```yaml
- name: Run tests
  run: pnpm test:ci

- name: Build project
  run: pnpm build
```

Do not add the full `pnpm test:e2e` command to this job. Git history shows that the previous full
Playwright CI job was removed in commit `c3cba63`; the replacement in this plan must run only the
focused accessibility spec on Chromium, not visual snapshots or WebKit/iPhone projects.

### Existing Axe policies are inconsistent

`packages/docs/e2e/components-smoke.spec.ts:107-145` requires every Axe violation array to be empty:

```ts
const tooltipA11y = await new AxeBuilder({ page }).include("#basic-tooltip").analyze();
expect(tooltipA11y.violations).toEqual([]);
```

`packages/docs/e2e/formisch.spec.ts:125-133` blocks only serious and critical violations:

```ts
const results = await new AxeBuilder({ page })
  .include("section#demo")
  .exclude(".docs-code-wrap")
  .analyze();
expect(results.violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""))).toEqual(
  [],
);
```

Use one shared policy: `critical` and `serious` violations fail CI. Moderate and minor results are
non-blocking in this first baseline. Do not silently disable individual Axe rules to make the suite
pass.

### Existing overlay scans miss the open portal

`packages/docs/e2e/components-smoke.spec.ts:132-140` scans Sheet and Dialog before opening them and
limits Axe to the source section:

```ts
await page.goto("./docs/sheet/basic-sheet");
const sheetA11y = await new AxeBuilder({ page }).include("#basic-sheet").analyze();

await page.goto("./docs/dialog/basic-dialog");
const dialogA11y = await new AxeBuilder({ page }).include("#basic-dialog").analyze();
```

The same file later opens these components in behavior-only tests. The new stateful audit must open
the overlay first and scan the visible `[role="dialog"]`, which may be outside the section because it
is portaled.

### Static lint baseline

The normal root lint command is `oxlint .`; the JSX accessibility plugin is not enabled. The following
read-only command was verified at planning time and exits 0 on commit `71a9d27`:

```bash
pnpm exec oxlint --jsx-a11y-plugin -A all \
  -D jsx-a11y/alt-text \
  -D jsx-a11y/aria-props \
  -D jsx-a11y/aria-role \
  -D jsx-a11y/aria-unsupported-elements \
  -D jsx-a11y/heading-has-content \
  -D jsx-a11y/html-has-lang \
  -D jsx-a11y/iframe-has-title \
  -D jsx-a11y/no-access-key \
  -D jsx-a11y/no-autofocus \
  -D jsx-a11y/no-distracting-elements \
  -D jsx-a11y/scope \
  -D jsx-a11y/tabindex-no-positive \
  -D jsx-a11y/role-has-required-aria-props \
  packages
```

Running the plugin's complete recommended set currently emits 119 warnings, including false
positives around polymorphic/headless primitives. Do not use `--deny-warnings`, a numeric
`--max-warnings` baseline, or broad inline suppressions in this plan. Gate only the explicit
high-signal zero-baseline rules above.

## Commands you will need

| Purpose                | Command                               | Expected on success                                                        |
| ---------------------- | ------------------------------------- | -------------------------------------------------------------------------- |
| Install                | `pnpm install --frozen-lockfile`      | exit 0; lockfile unchanged                                                 |
| Static a11y            | `pnpm lint:a11y`                      | exit 0; zero violations for the selected rules                             |
| Focused browser a11y   | `pnpm test:a11y`                      | exit 0; all Chromium a11y tests pass                                       |
| Existing E2E           | `pnpm test:e2e`                       | exit 0; existing Playwright suite still passes when browsers are installed |
| Typecheck              | `pnpm typecheck`                      | exit 0; no TypeScript errors                                               |
| Lint                   | `pnpm lint`                           | exit 0                                                                     |
| Unit/integration tests | `pnpm test:ci`                        | exit 0; all existing tests pass                                            |
| Workflow syntax        | `actionlint .github/workflows/ci.yml` | exit 0 if `actionlint` is installed                                        |
| Full repository gate   | `pnpm check`                          | exit 0                                                                     |

If the local machine does not have Chromium installed, run
`pnpm --filter @kamod-ch/ui-docs exec playwright install chromium` before `pnpm test:a11y`. Do not
install WebKit solely for this plan.

## Scope

**In scope** (the only files you should modify or create):

- `package.json`
- `.github/workflows/ci.yml`
- `CONTRIBUTING.md`
- `docs/accessibility-testing.md` (create)
- `packages/docs/e2e/a11y-utils.ts` (create)
- `packages/docs/e2e/a11y.spec.ts` (create)
- `packages/docs/e2e/components-smoke.spec.ts`
- `packages/docs/e2e/formisch.spec.ts`
- `plans/README.md` (status update only)

**Out of scope** (do not touch):

- Component implementation files under `packages/core/src`, `packages/blocks/src`, or
  `packages/openui/src`. This plan creates detection infrastructure; it is not a broad remediation.
- `packages/docs/src/docs/generated-manifest.ts`; consume it, but do not hand-edit generated output.
- Playwright screenshot baselines.
- WebKit/iPhone visual test behavior or `packages/docs/playwright.config.ts` project definitions.
- WCAG conformance claims, screen-reader certification, Lighthouse scoring, Pa11y, or Storybook.
- Suppressing or allowlisting a real critical/serious Axe violation.
- Enabling all 119 current JSX-a11y warnings.
- `.github/workflows/publish.yml`; pull-request CI is the gate in this plan, and the publish job does
  not install browsers.

## Git workflow

- Suggested branch: `advisor/003-automated-a11y-ci-audits`.
- Use Conventional Commits, matching `CONTRIBUTING.md`; suitable examples are
  `test(a11y): add manifest-driven axe audits` and `ci: gate pull requests on a11y audits`.
- Keep the test implementation and workflow wiring in separate logical commits if committing.
- Do not push or open a pull request unless explicitly instructed by the operator.

## Steps

### Step 1: Add shared Axe policy and failure formatting

Create `packages/docs/e2e/a11y-utils.ts`.

Requirements:

1. Import Axe result types from the already installed Axe packages; do not add a dependency.
2. Export a constant containing exactly the blocking impacts `critical` and `serious`.
3. Export an async helper that accepts `page`, a human-readable context string, and optional
   `include`/`exclude` selectors.
4. Construct `AxeBuilder`, apply selectors, and run `analyze()`.
5. Filter violations using the shared blocking-impact constant.
6. Assert that the filtered list is empty. The assertion payload must be concise and actionable:
   include context, rule id, impact, help URL, and affected target selectors. Do not dump entire HTML
   nodes into CI logs.
7. Do not disable Axe rules. Use Axe's default rules so new serious/critical regressions are caught.
8. Return the complete results so future tests can inspect non-blocking findings if needed.

Use `@playwright/test`'s `expect`; model TypeScript style and import ordering after the existing files
in `packages/docs/e2e/`.

**Verify**:

```bash
pnpm --filter @kamod-ch/ui-docs typecheck
```

Expected: exit 0 with no errors, including the new utility.

### Step 2: Add a manifest-driven initial-state audit

Create `packages/docs/e2e/a11y.spec.ts` and import `docsRouteManifest` from
`../src/docs/generated-manifest` plus the helper from Step 1.

Implement one Playwright test per manifest entry, declared synchronously at module load:

```ts
for (const { slug } of docsRouteManifest) {
  test(`${slug} docs have no blocking initial-state violations`, async ({ page }) => {
    // ...
  });
}
```

Each test must:

1. Navigate to `./docs/${slug}/installation` so base paths remain compatible with the existing
   Playwright configuration.
2. Assert that the page's level-one heading is visible and that `main` contains at least one
   `.preview`. If a legitimate manifest entry has no live preview, use a small, explicitly named
   constant of preview-less slugs in this test file and assert only `main` for those entries. Every
   exception must have a one-line reason; do not broadly skip a route.
3. Run the shared Axe helper against `main`. This scans all initially rendered docs sections and
   previews on that component page with one analysis call, avoiding one browser navigation per
   section.
4. Keep tests isolated: a failure for one slug must identify that slug in the Playwright report.

Do not generate or commit a second route list. The test count must track
`docsRouteManifest.length` automatically.

**Verify**:

```bash
pnpm --filter @kamod-ch/ui-docs exec playwright test e2e/a11y.spec.ts \
  --project=chromium --list
```

Expected: exit 0; output lists exactly `docsRouteManifest.length + 3` tests after Step 3 is complete
(currently 73: 70 route tests and 3 stateful tests). Before Step 3, exactly 70 tests is expected.

### Step 3: Audit open overlay and invalid-form states

In `packages/docs/e2e/a11y.spec.ts`, add a separate `test.describe("interactive accessibility
states", ...)` with exactly these three reliable scenarios:

1. **Dialog open state**
   - Navigate to `./docs/dialog/basic-dialog`.
   - Locate the trigger inside `#basic-dialog` by role/name, following the existing behavior test in
     `components-smoke.spec.ts`.
   - Open the dialog and assert the visible dialog role.
   - Run Axe with the visible dialog as the include selector. Include the overlay/portal container as
     well if the live DOM shows accessibility-relevant content outside the dialog node.
   - Press Escape, assert the dialog is hidden, and assert focus returns to the trigger.
2. **Sheet open state**
   - Navigate to `./docs/sheet/basic-sheet`.
   - Open the first preview Sheet and assert the visible dialog role with heading `Edit profile`.
   - Audit the visible dialog, close with Escape, and verify focus returns to the trigger.
3. **Formisch invalid state**
   - Navigate to `./docs/formisch/demo`.
   - Submit the empty form using the existing selectors in `formisch.spec.ts`.
   - Assert both existing validation messages are visible.
   - Audit `section#demo` while excluding `.docs-code-wrap`, matching the existing scan boundary.

Use role-based locators wherever the existing tests already establish stable accessible names. Do not
add arbitrary timeouts or retries inside tests.

**Verify**:

```bash
pnpm --filter @kamod-ch/ui-docs exec playwright test e2e/a11y.spec.ts \
  --project=chromium --list
```

Expected: exactly 73 tests at the planned manifest size.

Then run:

```bash
pnpm --filter @kamod-ch/ui-docs exec playwright test e2e/a11y.spec.ts \
  --project=chromium
```

Expected: all 73 pass. If a critical/serious violation appears, follow the STOP condition instead of
excluding it.

### Step 4: Remove duplicate, weaker Axe checks from mixed specs

After the centralized spec passes:

- Remove the `AxeBuilder` import and the combined Axe test from
  `packages/docs/e2e/components-smoke.spec.ts`.
- Remove only the Axe-specific test and import from `packages/docs/e2e/formisch.spec.ts`.
- Preserve every behavior, visual, navigation, and interaction test in those files unchanged.

This prevents two severity policies and avoids running duplicate scans when developers execute the
full E2E suite.

**Verify**:

```bash
rg -n "AxeBuilder|\.analyze\(\)|violations" packages/docs/e2e
```

Expected: matches occur only in `a11y-utils.ts` (analysis/policy) and, if directly referenced there,
`a11y.spec.ts`; no match remains in `components-smoke.spec.ts` or `formisch.spec.ts`.

### Step 5: Add focused root commands and conservative static lint

Edit root `package.json`:

1. Add `test:a11y` that delegates to the docs workspace and runs only
   `e2e/a11y.spec.ts --project=chromium`.
2. Add `lint:a11y` using the exact verified high-signal Oxlint command from "Static lint baseline".
   Keep the selected rules explicit in the script; do not use `--max-warnings`.
3. Do not add `test:a11y` to `test:ci` or `check`, because those commands do not install a browser in
   all current environments. GitHub CI receives a dedicated browser job in Step 6.
4. Adding `lint:a11y` to `check` is optional only if it does not alter unrelated local workflows; it
   must run explicitly in GitHub CI either way.

Use JSON formatting consistent with the existing script block.

**Verify**:

```bash
pnpm lint:a11y
```

Expected: exit 0 and zero findings for the selected rules.

```bash
pnpm test:a11y -- --list
```

Expected: exit 0 and 73 listed Chromium tests. If pnpm argument forwarding makes this command invalid,
change the root script so both `pnpm test:a11y` and direct docs-workspace invocation work; do not add a
second test implementation.

### Step 6: Add a dedicated Chromium accessibility CI job

Edit `.github/workflows/ci.yml` and add an `a11y` job alongside `test` and `workflows`.

The job must:

1. Use `ubuntu-latest`.
2. Check out with `actions/checkout@v6`.
3. Set up pnpm with `pnpm/action-setup@v4`, matching the existing workflow.
4. Set up Node 22 with `actions/setup-node@v6` and pnpm caching.
5. Run `pnpm install --frozen-lockfile`.
6. Run `pnpm lint:a11y`.
7. Install Chromium and its Linux dependencies with:
   `pnpm --filter @kamod-ch/ui-docs exec playwright install --with-deps chromium`.
8. Run `pnpm test:a11y`.
9. On failure, upload `packages/docs/playwright-report` using `actions/upload-artifact@v4`, with a
   descriptive artifact name and seven-day retention.
10. Stay independent of the main `test` job so both can run concurrently. Do not add `needs: test`.

Do not install WebKit, run visual snapshots, or call the full `pnpm test:e2e` command.

Also add a `Static accessibility lint` step running `pnpm lint:a11y` to the existing main `test` job
only if duplicate execution is acceptable. Preferred: keep it solely in the dedicated job so there
is one owner and no redundant work.

**Verify**:

```bash
pnpm exec prettier --check .github/workflows/ci.yml 2>/dev/null || true
pnpm format:check
```

Expected: `pnpm format:check` exits 0. The optional Prettier command must not modify files.

If `actionlint` is available:

```bash
actionlint .github/workflows/ci.yml
```

Expected: exit 0. If it is unavailable, rely on the repository's existing `workflows` CI job; do not
install a global tool solely for this verification.

### Step 7: Document policy, local usage, and limitations

Create `docs/accessibility-testing.md` and add a concise accessibility-testing section or link in
`CONTRIBUTING.md`.

The documentation must state:

- `pnpm lint:a11y` is the fast static check and names the selected-rule strategy.
- `pnpm test:a11y` is the Chromium Playwright/Axe check.
- CI blocks critical and serious Axe findings; moderate/minor findings are currently advisory.
- Route coverage is sourced from `generated-manifest.ts`; contributors must not maintain a parallel
  list.
- Interactive components require explicit open/error-state scenarios; initial DOM scans are not
  sufficient.
- Axe cannot prove keyboard usability, focus order, screen-reader quality, or complete WCAG
  conformance.
- Suppressions require a code comment explaining why the rule is inapplicable and should be narrowly
  scoped. Broad rule disablement is forbidden.
- Full visual/WebKit E2E remains available via `pnpm test:e2e` but is not part of this focused gate.

Update the command table in `CONTRIBUTING.md` with `pnpm lint:a11y` and `pnpm test:a11y`.

**Verify**:

```bash
rg -n "pnpm (lint:a11y|test:a11y)|critical|serious|generated-manifest|WCAG" \
  CONTRIBUTING.md docs/accessibility-testing.md
```

Expected: both commands are documented; the policy, manifest source, and limitation language are
present.

### Step 8: Run final gates and confirm no generated drift

Run, in order:

```bash
pnpm typecheck
pnpm lint
pnpm lint:a11y
pnpm test:ci
pnpm test:a11y
pnpm format:check
pnpm biome:ci
```

Expected: every command exits 0.

Then inspect scope:

```bash
git status --short
git diff --check
git diff --exit-code -- packages/docs/src/docs/generated-manifest.ts packages/docs/public
```

Expected:

- `git diff --check` exits 0.
- The generated-manifest/public command exits 0; starting the docs server did not create committed
  drift.
- Modified files are limited to the in-scope list plus ignored Playwright output.

Finally update Plan 003's status in `plans/README.md` to `DONE`.

## Test plan

### New automated coverage

`packages/docs/e2e/a11y.spec.ts` must contain:

- 70 manifest-driven initial-state route tests at the planned commit, one per slug.
- One open Dialog audit with Escape/focus-return assertion.
- One open Sheet audit with Escape/focus-return assertion.
- One invalid Formisch audit after validation messages appear.

### Existing patterns to follow

- Route syntax and role locators: `packages/docs/e2e/components-smoke.spec.ts`.
- Form submission/error selectors: `packages/docs/e2e/formisch.spec.ts`.
- Manifest iteration and docs route assumptions: `packages/docs/e2e/docs-components-audit.spec.ts`.
- Playwright project/config conventions: `packages/docs/playwright.config.ts`.
- GitHub setup/action versions: existing `test` job in `.github/workflows/ci.yml`.

### Required regression checks

- `pnpm test:a11y -- --list` reflects manifest growth automatically.
- `pnpm test:a11y` passes on Chromium.
- `pnpm test:e2e` still discovers the non-a11y smoke and visual specs; removing duplicate Axe tests
  must not remove behavior coverage.
- `pnpm lint:a11y` passes with zero findings for the selected high-signal rules.
- Existing `pnpm test:ci` and `pnpm typecheck` remain green.

## Done criteria

- [ ] Root scripts `test:a11y` and `lint:a11y` exist and exit 0.
- [ ] `a11y.spec.ts` imports `docsRouteManifest`; there is no copied slug array.
- [ ] Chromium lists 73 focused a11y tests at the planned manifest size.
- [ ] All 70 docs slugs receive an initial-state `main` Axe scan.
- [ ] Dialog and Sheet are opened before their visible dialog nodes are scanned.
- [ ] Dialog and Sheet tests verify Escape closes and focus returns to the trigger.
- [ ] Formisch is scanned after invalid state is rendered.
- [ ] One shared helper defines the `critical`/`serious` blocking policy and actionable formatting.
- [ ] Duplicate Axe imports/scans are removed from `components-smoke.spec.ts` and `formisch.spec.ts`.
- [ ] `.github/workflows/ci.yml` has an independent Chromium-only a11y job and uploads failure reports.
- [ ] The CI job does not run WebKit, iPhone, visual snapshots, or the complete E2E suite.
- [ ] `CONTRIBUTING.md` and `docs/accessibility-testing.md` document commands, policy, and Axe limits.
- [ ] `pnpm typecheck`, `pnpm lint`, `pnpm lint:a11y`, `pnpm test:ci`, `pnpm test:a11y`,
      `pnpm format:check`, and `pnpm biome:ci` all exit 0.
- [ ] `git diff --check` exits 0 and no generated manifest/public drift exists.
- [ ] No component implementation or screenshot baseline is modified.
- [ ] `plans/README.md` marks Plan 003 `DONE` after completion.

## STOP conditions

Stop and report back; do not improvise if any of these occurs:

- Any in-scope current-state excerpt no longer matches after the drift check.
- The docs manifest cannot be imported from a Playwright spec without modifying generated source.
- More than a small explicit set of legitimate package/docs routes has no `.preview`; investigate the
  renderer rather than weakening the assertion globally.
- A critical or serious Axe violation is found in existing component/docs code. Report rule id,
  route/state, help URL, and target selectors; do not suppress it or edit component code under this
  plan.
- Dialog or Sheet does not return focus on Escape. Report it as a separate component defect rather
  than deleting the assertion.
- The focused route sweep is observably flaky after one retry-free local rerun, or exceeds ten minutes
  on Chromium locally. Report measured runtime and slow routes before adding timeouts, retries, or
  reducing route coverage.
- Running the docs server modifies `generated-manifest.ts` or tracked files under
  `packages/docs/public`; report the drift before committing generated changes.
- Enabling a selected static rule exposes existing violations. Report the exact rule and locations;
  do not switch to a numeric warning baseline.
- Passing CI requires installing WebKit, changing screenshot baselines, or editing an out-of-scope
  component implementation.
- Any verification command fails twice after one reasonable correction.

## Maintenance notes

- Every new docs slug is automatically audited because tests derive from `docsRouteManifest`; review
  future changes for accidental filtering or skips that break this invariant.
- Axe initial-state scans do not exercise closed menus, popovers, comboboxes, drawers, or validation
  states. Add one focused state scenario whenever a new interaction pattern is introduced.
- Keep Chromium-only browser audits as the default cost boundary. Add another browser only after a
  concrete browser-specific accessibility regression demonstrates value.
- Review `moderate` and `minor` findings periodically. Tightening the blocking policy should be a
  deliberate follow-up after the baseline is measured, not an unreviewed CI change.
- Expand static JSX-a11y rules one at a time after triaging current headless/polymorphic false
  positives. Never encode the current warning count as a permanent baseline.
- A green Axe result is not a WCAG certification. Manual keyboard and screen-reader checks remain
  necessary for release-critical interactive primitives.
