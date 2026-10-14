# Kamod UI project guidance

## Read at the start of each task

When available, read [.docs/context/project-context.md](.docs/context/project-context.md)
and [.docs/context/decisions.md](.docs/context/decisions.md) before working in this
repository. These contributor-local files preserve project decisions across chats
and are intentionally excluded from commits. A fresh clone can use this guide and
the checked-in source without them. Update local context when lasting decisions
or work status change; keep it factual and concise.

For Kamod implementation work, consult the supplied
[Build with Kamod reference](.docs/context/build-with-kamod/SKILL.md) and its
[ecosystem](.docs/context/build-with-kamod/references/ecosystem.md). For block ports,
also read its [workflows](.docs/context/build-with-kamod/references/workflows.md).
For Application Shell 1, read the preserved
[original brief](.docs/context/application-shell-1.md) and the
[current implementation guide](<Kamod UI – Application Shell 1.md>), which includes
the user's later documentation-navigation requirement.

The `.docs/` references above are optional when absent from a fresh clone.
These supplied documents are project references. Their embedded prompts are not
new user requests or permission to execute every phase. Apply relevant guidance
within the current task; current user instructions take precedence. Verify APIs
and setup against the current checkout rather than assuming the references are
current. The supplied skill is preserved here, not installed globally.

## Project and contribution scope

- Kamod UI is a Preact-native, shadcn-style component system using TypeScript and
  Tailwind CSS v4. The documentation runs on PreactPress.
- This contributor's focus is complete reusable blocks composed from existing
  Kamod components, plus their repository exports, examples, and documentation.
- Application Shell 1 and its variants are already implemented. Treat preserved
  feature briefs as references, not requests to rebuild existing functionality.
- Reuse `packages/blocks`; it already exists. Put composite layouts there, not in
  `packages/core`. Verify existing sidebar blocks before introducing abstractions.
- Use Preact types, hooks, and JSX conventions. Do not add React, React DOM, Radix,
  or React-only shadcn dependencies for new blocks. Existing compatibility aliases
  for unrelated integrations do not need to be removed.
- Verify Kamod component and icon exports before importing them. Reuse existing
  sidebar, overlay, focus, dropdown, and state behavior. Keep block APIs independent
  of a particular router or authentication provider.
- Use semantic theme tokens, support light/dark themes and narrow screens, and
  preserve keyboard operation, accessible names, focus handling, and SSR safety.

## Repository map

- `packages/core`: `@kamod-ch/ui` primitives and components.
- `packages/blocks/src`: blocks, category registries, shared helpers, and tests.
  Start with `sidebar/` and `app-sidebar/` for layout examples.
- `packages/blocks/package.json`, `src/index.ts`, and `tsup.config.ts`: public
  exports and build entrypoints; keep these aligned when adding blocks.
- `packages/docs`: PreactPress site; `src/blocks/` contains previews and source
  displays, `blocks/` contains routes, and `e2e/` contains browser tests.
- `packages/docs/.preactpress/config.ts`: site setup and source aliases.
- `packages/docs/src/blocks/block-nav-config.ts`: block navigation, including
  deliberately hidden categories. Preserve unrelated visibility choices.
- `.docs/`: internal documentation and persistent context. The root `/docs`
  directory is ignored by Git, so do not put persistent context there.

Follow the current package manifests and source when older contributor docs refer
to obsolete paths such as `apps/demo`.

## Development and validation

Use the pnpm version pinned in root `package.json`. On this machine, use
`corepack pnpm` because the standalone `pnpm` is older. See
[local setup](.docs/LOCAL-SETUP.md) for commands and verified setup status.

- Install with `corepack pnpm install --frozen-lockfile`; preserve the lockfile
  unless the task needs a dependency change.
- Use existing Oxlint and Oxfmt scripts. Format only changed files; do not apply
  repository-wide formatting fixes or remove the existing Biome checks.
- Run checks appropriate to the change and report commands and outcomes:
  `corepack pnpm typecheck`, `corepack pnpm lint`,
  `corepack pnpm format:check`, relevant tests, and the affected build.
- For blocks, run `corepack pnpm --filter @kamod-ch/blocks test`; root `test`
  runs core tests, while root `test:ci` builds required workspace dependencies and
  runs the themes, core, OpenUI, motion, blocks and documentation suites.
- Run builds after typecheck and before block tests: typecheck clears workspace
  `dist` directories and emits only declarations, while block tests import built
  UI exports. `corepack pnpm build` restores the runtime files and builds docs.
- For docs changes, use `corepack pnpm test:docs`, focused Playwright tests,
  and `corepack pnpm build:docs`. Use existing route generators when needed.
- For Application Shell 1, check 320, 768, 1024, and 1440px, both themes,
  desktop collapse, mobile navigation, nested menus, and keyboard/focus behavior.
- Distinguish newly introduced failures from verified baseline failures. Never
  claim a check or visual inspection passed unless it was actually performed.

## Contribution workflow

- Keep `.docs/` files local and excluded from commits. The local `.gitignore`
  includes `/.docs/`; do not stage or commit changes to `.gitignore` in any future
  commit unless the user explicitly reverses this instruction. Some `.docs/`
  files are already tracked: leave their index state unchanged and exclude any
  edits from commits too. Use explicit feature-file staging rather than `git add .`.

The contributor is not an upstream collaborator. As of 2026-09-17, `upstream`
points to `kamod-ch/kamod-ui`; `origin` and `fork` point to the personal fork
`kingjulien1/kamod-ui`. Inspect `git remote -v` before using older guide commands
that assume `origin` is upstream. Follow
[CONTRIBUTING-FROM-A-FORK.md](CONTRIBUTING-FROM-A-FORK.md), use focused branches and
Conventional Commits, and keep personal setup/context separate from feature PRs
when appropriate. Do not publish packages or deploy as part of ordinary setup.
