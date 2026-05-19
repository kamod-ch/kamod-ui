# Changelog

All notable changes to **@kamod-ui/core** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Per-component subpath exports in `@kamod-ui/core`, e.g. `import { Button } from "@kamod-ui/core/button"`. The root barrel (`@kamod-ui/core`) keeps working and stays tree-shakeable thanks to the new `"sideEffects": false` flag.
- Additional subpath exports for shared utilities: `@kamod-ui/core/lib/utils`, `@kamod-ui/core/lib/signals`, `@kamod-ui/core/lib/interactive`.
- `pnpm test:coverage` script (Vitest + `@vitest/coverage-v8`).
- `pnpm qa:publint` and `pnpm qa:attw` (publint + `@arethetypeswrong/cli`) wired into CI to validate the published package shape.
- Repo-wide ESLint flat config (`@typescript-eslint`, `eslint-plugin-jsx-a11y`).
- Dependabot config for weekly npm + GitHub Actions updates.
- Node 20 + 22 CI matrix; Playwright browser cache; concurrency groups on all workflows.
- Dev-only warning in `<Button asChild>` when an invalid child is provided.

### Changed
- `@preact/signals` is now a **peer dependency** (and dev dependency for development) instead of a hard dependency, to avoid duplicate signal instances in consumer bundles.
- `packages/core/package.json` now ships full package metadata (description, license, repository, homepage, bugs, keywords, engines, publishConfig).
- `tsup` build emits one entry per component (`dist/components/<name>/index.js`) with code splitting and tree-shaking enabled, in addition to the root barrel.
- Root and workspace `lint` scripts now run ESLint (previously only `tsc --noEmit`). `typecheck` continues to run `tsc --noEmit`.
- `publish.yml` publishes with `--provenance` and is triggered only by tag pushes (deduplicating the prior `release` + `tag` double trigger).

### Removed
- Tracked-but-stale folders at the repo root (`data_old/`, `scripts_old/`, `inbox/`, `proofshot-artifacts/`, `kamod-ui-0.1.0.tgz`) — already gitignored and unused.

## [0.1.0] - Initial release

Initial public release of `@kamod-ui/core`.
