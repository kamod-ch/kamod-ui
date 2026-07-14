# Maintainers guide

Internal notes for publishing and releasing `@kamod-ch/ui` from the kamod-ui monorepo.

## What gets published

Only **`packages/core`** (`@kamod-ch/ui`) is published to npm. The root workspace is `"private": true` so `npm publish` from the repo root cannot accidentally republish the unscoped `kamod-ui` name.

Publishing requires the npm organization **`kamod-ch`** (scope `@kamod-ch`). New installs should use **`@kamod-ch/ui`**.

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

### Recommended local release

1. Update [`CHANGELOG.md`](../CHANGELOG.md) for the release (optional but recommended).
2. Authenticate with npm (once per machine, or set `NODE_AUTH_TOKEN`):

   ```bash
   npm login
   # or: export NODE_AUTH_TOKEN=<your-npm-token>
   pnpm release:auth
   ```

3. Regenerate component size docs (optional but recommended before a release):

   ```bash
   pnpm docs:components
   ```

4. Dry-run first (checks, build, tests, and `npm pack` without publishing):

   ```bash
   pnpm release:dry
   ```

5. Version, tag, push, and publish:

   ```bash
   pnpm release          # patch bump (default)
   pnpm release:minor      # minor bump
   pnpm release:major      # major bump
   ```

   `pnpm release` runs [`scripts/release.mjs`](../scripts/release.mjs): pre-checks (`release:check`) → bump `packages/core/package.json` → `syncpack:fix` → commit + tag → `pnpm publish` → push `main` and tag.

   Requires branch `main` and a clean working tree.

   If you already ran `pnpm release` and CI fails on syncpack only, fix with `pnpm syncpack:fix && pnpm install`, commit, and `git push` — do **not** run `pnpm release` again (that would bump to the next version).

### CI release (tag push)

Tagged pushes (`v*`) trigger [`.github/workflows/publish.yml`](../.github/workflows/publish.yml), which runs typecheck, lint, tests, build, publint, attw, then publishes **`@kamod-ch/ui`** to [npmjs.org](https://www.npmjs.com/package/@kamod-ch/ui) with `--provenance` (requires GitHub Actions OIDC + `NPM_TOKEN` secret).

#### GitHub Actions `NPM_TOKEN` secret

CI publish fails with `ENEEDAUTH` when the secret is missing, empty, or invalid.

1. In npm, open the **`kamod-ch`** org → **Access Tokens** (or your user tokens if you publish under a user scope).
2. Create an **Automation** or **Granular** token with **publish** permission for `@kamod-ch/*`.
3. In GitHub → **kamod-ui** repo → **Settings** → **Secrets and variables** → **Actions**, add repository secret **`NPM_TOKEN`** with that token value.
4. Re-run the failed publish workflow or push the tag again after fixing the secret.

The workflow appends auth tokens to the committed [`.npmrc`](../.npmrc) (scope lines only; no secrets in git) and runs `npm whoami` before publish so auth problems fail with a clear message instead of only at `pnpm publish`.

### Script reference

| Script                     | What it does                                                    |
| -------------------------- | --------------------------------------------------------------- |
| `release:check`            | `test:ci` + `build` + `qa:publint` + `qa:attw`                  |
| `release:check:package`    | `qa:package` (core build + publint + attw only)                 |
| `release:auth`             | Verifies `npm whoami` against the npm registry                  |
| `release:publish`          | Publishes `@kamod-ch/ui` with `--access public --no-git-checks` |
| `release:deprecate-legacy` | Deprecates `@kamod-ui/core@*` on npm (one-time; needs 2FA)      |
| `release:quick`            | `install` → package checks → auth → publish (no version bump)   |
| `release`                  | Patch release via `scripts/release.mjs`                         |
| `release:minor`            | Minor release via `scripts/release.mjs`                         |
| `release:major`            | Major release via `scripts/release.mjs`                         |
| `release:dry`              | Pre-checks + `npm pack` dry run (no bump, no publish)           |
| `docs:components`          | Build core + regenerate [`.docs/COMPONENTS.md`](COMPONENTS.md)  |

Local `pnpm release:publish` does not pass `--provenance` (npm cannot detect a CI provider on your machine). Provenance is enabled only in GitHub Actions.

## Documentation maintenance

- **[`.docs/COMPONENTS.md`](COMPONENTS.md)** — auto-generated per-component bundle sizes and signals usage. Run `pnpm docs:components` after changing `packages/core` exports or build output.
- **[`README.md`](../README.md)** — public-facing; links to COMPONENTS.md instead of duplicating the full table. Run `pnpm docs:readme` after editing the root README (also runs via Lefthook when `README.md` is staged).

## See also

- [`.docs/interna.md`](interna.md) — monorepo layout, dev tooling (Biome, Knip, Lefthook)
- [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) — CI pipeline
- [`.github/workflows/publish.yml`](../.github/workflows/publish.yml) — npm publish on tags
