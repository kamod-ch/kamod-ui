# Plan 002: @kamod-ch/openui package

> Status snapshot for the OpenUI adapter package. Full requirements live in the Cursor plan; this file tracks repo integration.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED (Preact/`preact/compat` + React peer)
- **Depends on**: `@kamod-ch/ui` 0.2.x
- **Category**: direction
- **Status**: DONE (MVP)

## Delivered

- Workspace package `packages/openui` published as `@kamod-ch/openui`
- Preact/compat spike validated (Vitest aliases + SSR via `preact-render-to-string`)
- 23 MVP OpenUI components with Zod schemas and token mappings
- `KamodOpenUIRenderer`, presets, prompts, security/navigation policies
- Demo doc page `/openui` with three static fixtures + simulated streaming
- Root scripts: `test:openui`, `qa:openui`; CI `test:ci` / publint / attw include openui

## Adapter deviations (documented)

- `Stack`, `Inline`, `Grid`, `Form`, `Link`, `SubmitButton` are adapter primitives
- `Heading`/`Text` → `Typography`; `Divider` → `Separator`; `Select` → `NativeSelect`
- No nested Stack/Grid/Card recursion in MVP

## Follow-ups

- npm publish workflow (same gap as `@kamod-ch/themes`)
- Dashboard preset, dialogs, controlled Tabs in core
