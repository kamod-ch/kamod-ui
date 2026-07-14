# Plan 002: @kamod-ch/openui package

> Status snapshot for the OpenUI adapter package. Full requirements live in the Cursor plan; this file tracks repo integration.

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED (Preact/`preact/compat` + React peer)
- **Depends on**: `@kamod-ch/ui` 0.2.x
- **Category**: direction
- **Status**: DONE (Phases 1–4 expansion)

## Delivered

- Workspace package `packages/openui` published as `@kamod-ch/openui` (`0.6.0`)
- Preact/compat spike validated (Vitest aliases + SSR via `preact-render-to-string`)
- Full OpenUI component set (60+ registered adapters) with Zod schemas and token mappings
- `KamodOpenUIRenderer`, presets (`basic`, `forms`, `dashboard`), prompts, security/navigation/media policies
- Demo doc page `/openui` with fixtures + simulated streaming
- Root scripts: `test:openui`, `qa:openui`; CI `test:ci` / publint / attw include openui

## Adapter deviations (documented)

- `Stack`, `Inline`, `Grid`, `Form`, `Link`, `SubmitButton` are adapter primitives
- `Heading`/`Text` → `Typography`; `Divider` → `Separator`; `Select` → `NativeSelect`
- `RichSelect` maps to the full `@kamod-ch/ui/select` surface
- No nested Stack/Grid/Card recursion (bounds tree depth)

## Explicit exclusions

- `Dropzone` — file upload risk; not exposed to the LLM
- `Direction` — host-owned RTL/LTR provider

## Follow-ups

- npm publish workflow (same gap as `@kamod-ch/themes`)
- Controlled Tabs in core (OpenUI still uses `defaultValue`)
- Optional controlled nesting depth for Stack/Grid/Card (max 2)
