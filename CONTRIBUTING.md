# Contributing

Thanks for your interest in contributing to **Kamod UI**. Pull requests and issues are welcome.

Please read this document before your first contribution. Check open issues and pull requests to avoid duplicate work.

If you report a security issue, use the process in [SECURITY.md](./SECURITY.md) instead of a public issue.

## About this repository

This repository is a **pnpm monorepo** ([workspaces](https://pnpm.io/workspaces)).

- **Package manager:** [pnpm](https://pnpm.io) (version pinned via `packageManager` in the root `package.json`).
- **Runtime / UI:** [Preact](https://preactjs.com/) component library plus a Vite-powered demo app.

There is no Turborepo or Changesets setup in this repo; releases and tooling follow what is defined in the root and package `package.json` files.

## Structure

```
packages
└── core          # @kamod-ch/ui — published-style component library (tsup, Vitest)
apps
└── demo          # Vite + Preact kitchen sink and in-app documentation
```

| Path            | Description                                                |
| --------------- | ---------------------------------------------------------- |
| `packages/core` | Component library source, types, and unit tests.           |
| `packages/docs` | Local docs UI, examples, Vitest tests, and Playwright E2E. |

Component documentation pages and registry wiring live under `packages/docs/src/docs/` (for example `docs/pages/*-doc.tsx` and `docs/registry.ts`).

## Development

### Fork and clone

Clone the repository:

```bash
git clone https://github.com/kamod-ch/kamod-ui.git
cd kamod-ui
```

For pull requests from a fork, [fork the repo on GitHub](https://github.com/kamod-ch/kamod-ui/fork) and add your fork as a remote:

```bash
git remote add fork https://github.com/<your-username>/kamod-ui.git
```

### Branch

```bash
git checkout -b my-feature-branch
```

### Install dependencies

From the repository root:

```bash
pnpm install
```

### Run the demo (kitchen sink + docs)

```bash
pnpm dev
```

This runs the `@kamod-ch/ui-docs` workspace. Open the URL printed in the terminal.

You can also target the workspace explicitly:

```bash
pnpm --filter @kamod-ch/ui-docs dev
```

### Build and quality checks

From the root:

| Command          | Purpose                                   |
| ---------------- | ----------------------------------------- |
| `pnpm build`     | Build all packages (recursive).           |
| `pnpm typecheck` | Typecheck all workspaces.                 |
| `pnpm lint`      | Lint/typecheck scripts per workspace.     |
| `pnpm lint:a11y` | Static JSX accessibility lint (selected rules). |
| `pnpm test`      | Run **@kamod-ch/ui** unit tests (Vitest). |
| `pnpm test:docs` | Run **docs** unit tests (Vitest).         |
| `pnpm test:e2e`  | Run **docs** Playwright tests.            |
| `pnpm test:a11y` | Chromium Playwright/Axe accessibility audits. |

See [docs/accessibility-testing.md](docs/accessibility-testing.md) for the a11y policy, coverage
model, and automation limits.

In `packages/docs` you can also run `pnpm qa:themes` for theme regression checks, and use `pnpm format` / `pnpm format:check` (oxfmt) for formatting when working in that app.

Please ensure `pnpm typecheck`, `pnpm lint`, and relevant tests pass before opening a pull request.

## Components and documentation

- **Library code** belongs in `packages/core`. Match existing patterns for exports, styling, and accessibility.
- **Docs and live examples** are maintained in `packages/docs` alongside the kitchen sink. When you add or change a component’s public API or behavior, update the corresponding doc page and registry entry under `packages/docs/src/docs/` as needed.

A practical order for larger contributions:

1. Harden accessibility and interaction behavior of existing components.
2. Implement missing components or parity gaps.
3. Expand documentation in the demo docs system.

## Commit convention

Use [Conventional Commits](https://www.conventionalcommits.org/) style when possible:

`category(scope): message`

Common categories:

- `feat` — new feature or API
- `fix` — bug fix
- `refactor` — internal change, same outward behavior
- `docs` — documentation only
- `build` — build, tooling, or dependency changes
- `test` — tests only
- `ci` — CI configuration
- `chore` — maintenance that does not fit above

Example: `feat(core): add optional size prop to Button`

## Requests for new components

Open a GitHub issue (or discussion, if enabled) with the use case, expected API, and any accessibility requirements. That helps maintainers and contributors align before large changes.

## Testing

- **Core:** Vitest in `packages/core` (`pnpm test` from root).
- **Docs:** Vitest and Playwright in `packages/docs` (`pnpm test:docs`, `pnpm test:e2e` from root).
- **Accessibility:** Static JSX-a11y lint and Chromium Axe audits (`pnpm lint:a11y`, `pnpm test:a11y`). Details in [docs/accessibility-testing.md](docs/accessibility-testing.md).

New behavior should include tests where it is practical (unit tests for logic and components; E2E or visual checks when the demo flow is critical).
