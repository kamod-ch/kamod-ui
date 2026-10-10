# @kamod-ch/blocks

Preact blocks built with Kamod UI. The package is the source of truth for block components and metadata used by the docs.

## Shared Theme Picker

Import `ThemePicker` from `@kamod-ch/blocks/shared` and load
`@kamod-ch/blocks/theme-picker.css` alongside your Kamod styles. The controlled
`preset` / `onPresetChange` and `scheme` / `onSchemeChange` pairs let the host own
the theme target and persistence; opening a picker never changes global state.
Use `resolveHref` for local documentation routes, `triggerClass` for trigger
sizing, and `children` for extra controls such as radius or Copy CSS.

## Application Shells

The `application-shell` category includes eight responsive compositions: grouped
sidebar (1), inset workspace (2), compact rail (3), horizontal navigation (4),
right-hand navigation (5), split workspace with an inspector (6), contextual sections
(7), and persistent form actions (8). Import an
individual workspace entry from `@kamod-ch/blocks/application-shell/application-shell-N`.
The package is private; documentation readers copy each detail page’s complete
source bundle rather than installing this workspace package from npm.

Shells 2–8 share a frame and the existing Shell 1 navigation adapters. Each exposes
typed application-owned identity, destination data, callbacks and route content;
demos use local fixtures and do not implement authentication or persistence.
The inspector variant adds optional contextual content and a named visibility toggle.
