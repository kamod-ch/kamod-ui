# Maintainers guide

Internal notes for publishing and releasing `@kamod-ch/ui` from the kamod-ui monorepo.

## What gets published

Publishing is **not** limited to `packages/core` alone, but the automated publish script only publishes a **fixed list** of packages.

### Packages published by CI / `scripts/publish-packages.mjs`

[`scripts/publish-packages.mjs`](../scripts/publish-packages.mjs) iterates:

| npm package        | Workspace         |
| ------------------ | ----------------- |
| `@kamod-ch/ui`     | `packages/core`   |
| `@kamod-ch/themes` | `packages/themes` |

Tagged releases (`v*`) run [`.github/workflows/publish.yml`](../.github/workflows/publish.yml), which uses this script (via `pnpm release:publish` in maintainer flows). Each package is skipped if that exact version is already on npm.

The root workspace stays **`"private": true`** so `npm publish` from the repo root cannot accidentally ship the unscoped `kamod-ui` name.

### Other packages with `publishConfig`

These workspaces declare npm `publishConfig` in their `package.json` but are **not** in the `publish-packages.mjs` array today — they are **not** published by the default release script unless you add them there and run a manual publish:

- `@kamod-ch/ui-motion` (`packages/motion`)
- `@kamod-ch/openui` (`packages/openui`)

Do **not** extend `publish-packages.mjs` without an explicit maintainer decision; document any change here first.

### Not published from this repo

Examples: `@kamod-ch/ui-docs`, `@kamod-ch/blocks`, `@kamod-ch/typeset` (consumers install `@kamod-ch/ui` and peers from npm; docs and blocks stay monorepo-local).

### Legacy packages on npm

| Package               | Status                               | Action                                                         |
| --------------------- | ------------------------------------ | -------------------------------------------------------------- |
| `@kamod-ui/core`      | Renamed → `@kamod-ch/ui`             | **Deprecate** (do not unpublish — keeps old lockfiles working) |
| `kamod-ui` (unscoped) | Already **unpublished** (2026-05-19) | Nothing to do                                                  |

Prefer **deprecation** over `npm unpublish`: npm blocks unpublish after 72 hours or when dependents exist; deprecation shows a migration message on every install.

One-time deprecation (requires `npm login` as an owner of `@kamod-ui/core`; confirm 2FA if prompted):

```bash
pnpm release:deprecate-legacy
```

Or manually:

```bash
npm deprecate '@kamod-ui/core@*' 'Renamed to @kamod-ch/ui — install with: pnpm add @kamod-ch/ui'
npm view @kamod-ui/core deprecated
```

## Release workflow

### Recommended release

1. Update [`CHANGELOG.md`](../CHANGELOG.md) for the release (optional but recommended).
2. Regenerate component size docs (optional but recommended before a release):

   ```bash
   pnpm docs:components
   ```

3. Dry-run first (checks, build, tests, and `npm pack` without publishing):

   ```bash
   pnpm release:dry
   ```

4. Bump version, commit, tag, and push:

   ```bash
   pnpm release          # patch bump (default)
   pnpm release:minor    # minor bump
   pnpm release:major    # major bump
   ```

   `pnpm release` runs [`scripts/release.mjs`](../scripts/release.mjs): pre-checks (`release:check`) → bump `packages/core/package.json` → `syncpack:fix` → commit + tag → push `main` and tag.

   Requires branch `main` and a clean working tree. **npm publish happens in CI only** — no local `pnpm publish`.

   After the tag push, watch [`.github/workflows/publish.yml`](../.github/workflows/publish.yml) on GitHub Actions for the npm publish step.

   If you already ran `pnpm release` and CI fails on syncpack only, fix with `pnpm syncpack:fix && pnpm install`, commit, and `git push` — do **not** run `pnpm release` again (that would bump to the next version).

### CI publish (tag push)

Tagged pushes (`v*`) trigger [`.github/workflows/publish.yml`](../.github/workflows/publish.yml), which runs typecheck, lint, tests, build, publint, attw, then publishes **`@kamod-ch/ui`** to [npmjs.org](https://www.npmjs.com/package/@kamod-ch/ui) via [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers/) (GitHub Actions OIDC — no long-lived `NPM_TOKEN`). This is the **only** path used by `pnpm release`.

#### npm Trusted Publisher (one-time setup)

CI publish authenticates with a short-lived OIDC token from GitHub Actions. No `NPM_TOKEN` repository secret is required.

1. On [npmjs.com](https://www.npmjs.com/package/@kamod-ch/ui/access), open **`@kamod-ch/ui`** → **Settings** → **Trusted Publisher**.
2. Add a **GitHub Actions** publisher:
   - **Organization or user:** `kamod-ch`
   - **Repository:** `kamod-ui`
   - **Workflow filename:** `publish.yml` (filename only, must match [`.github/workflows/publish.yml`](../.github/workflows/publish.yml))
   - **Environment name:** leave empty (unless the workflow uses a GitHub environment)
   - **Allow npm publish:** enabled
3. Click **Set up connection**.

The workflow sets `permissions.id-token: write`, uses `registry-url` in `setup-node`, and runs `pnpm publish --provenance`. Do not set `NODE_AUTH_TOKEN` in the publish job — that would bypass OIDC.

If publish fails with auth errors, verify the trusted publisher workflow filename matches exactly and re-run the failed workflow.

### Script reference

| Script                     | What it does                                                    |
| -------------------------- | --------------------------------------------------------------- |
| `release:check`            | `test:ci` + `build` + `qa:publint` + `qa:attw`                  |
| `release:check:package`    | `qa:package` (core build + publint + attw only)                 |
| `release:auth`             | Verifies `npm whoami` against the npm registry                  |
| `release:publish`          | Publishes `@kamod-ch/ui` with `--access public --no-git-checks` |
| `release:deprecate-legacy` | Deprecates `@kamod-ui/core@*` on npm (one-time; needs 2FA)      |
| `release:quick`            | `install` → package checks → auth → publish (no version bump)   |
| `release`                  | Patch release: bump, commit, tag, push (CI publishes to npm)    |
| `release:minor`            | Minor release via `scripts/release.mjs`                         |
| `release:major`            | Major release via `scripts/release.mjs`                         |
| `release:dry`              | Pre-checks + `npm pack` dry run (no bump, no publish)           |
| `docs:components`          | Build core + regenerate [`.docs/COMPONENTS.md`](COMPONENTS.md)  |

`pnpm release` does not publish locally. Use `release:quick` / `release:publish` only for manual republish edge cases (no `--provenance`).

## Documentation maintenance

- **[`.docs/COMPONENTS.md`](COMPONENTS.md)** — auto-generated per-component bundle sizes and signals usage. Run `pnpm docs:components` after changing `packages/core` exports or build output.
- **[`README.md`](../README.md)** — public-facing; links to COMPONENTS.md instead of duplicating the full table. Run `pnpm docs:readme` after editing the root README (also runs via Lefthook when `README.md` is staged).

## See also

- [`.docs/interna.md`](interna.md) — monorepo layout, dev tooling (Biome, Knip, Lefthook)
- [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) — CI pipeline
- [`.github/workflows/publish.yml`](../.github/workflows/publish.yml) — npm publish on tags
