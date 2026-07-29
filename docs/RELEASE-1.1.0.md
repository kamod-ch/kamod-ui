# Release 1.1.0 — Full Sidebar

Prepare and publish `@kamod-ch/ui@1.1.0` so Kamod UI Pro and other consumers can depend on npm instead of a local `link:` override.

## What ships

The npm package `@kamod-ch/ui@1.0.1` currently contains a **minimal sidebar stub** (`SidebarProvider` with signals only). The repository `main` branch builds the **full sidebar** (Sheet mobile drawer, icon collapse, menu primitives, `SidebarRail`, `useSidebar().toggleSidebar`, etc.).

This release publishes that full implementation as **1.1.0**.

## Pre-release checklist

- [x] `pnpm qa:package` passes (publint + attw)
- [x] `npm pack` in `packages/core` includes `SidebarRail`, `openMobile`, `toggleSidebar` in dist
- [ ] `pnpm release:check` passes (full CI locally)
- [ ] `CHANGELOG.md` section `[1.1.0]` reviewed
- [ ] Docs site sidebar blocks render correctly (`pnpm dev`)

## Release commands

From repo root on **`main`** with a **clean working tree**:

```bash
# Optional dry run (pack tarball, no version bump)
pnpm release:dry

# Minor bump 1.0.1 → 1.1.0, commit, tag, push
pnpm release:minor
```

The tag push triggers [`.github/workflows/publish.yml`](../.github/workflows/publish.yml) which runs tests, build, publint, attw, and publishes to npm with provenance.

Manual fallback:

```bash
pnpm release:check
pnpm release:auth
pnpm --filter @kamod-ch/ui publish --access public --no-git-checks
```

## Post-release

### npm

Verify: https://www.npmjs.com/package/@kamod-ch/ui/v/1.1.0

```bash
npm view @kamod-ch/ui@1.1.0 exports.sidebar
node -e "import('@kamod-ch/ui').then(m => console.log(Object.keys(m).filter(k=>k.startsWith('Sidebar'))))"
```

### Kamod UI Pro

In `kamod-ui-pro/package.json`, remove the dev override once 1.1.0 is live:

```json
"pnpm": {
  "overrides": {
    "preact": "10.29.7"
  }
}
```

Then:

```bash
cd kamod-ui-pro
pnpm install
pnpm test
pnpm build
```

### GitHub release notes (suggested)

**Title:** `@kamod-ch/ui@1.1.0` — Full application sidebar

**Body:**

- Full sidebar system for Preact dashboard shells (mobile sheet, desktop icon collapse, menu primitives)
- Unblocks `@kamod-ui-pro/application-shell` on npm without monorepo `link:` overrides
- Requires Tailwind v4 + `@kamod-ch/ui/theme.css`

## Deprecation (optional follow-up)

Consider deprecating `@kamod-ch/ui@1.0.1` on npm with message pointing to 1.1.0 for sidebar consumers:

```bash
pnpm release:deprecate-legacy  # if script covers ui versions; otherwise manual npm deprecate
npm deprecate @kamod-ch/ui@1.0.1 "Sidebar stub only; upgrade to >=1.1.0 for full sidebar support."
```
