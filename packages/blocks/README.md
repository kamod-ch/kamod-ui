# @kamod-ch/blocks

Preact blocks built with Kamod UI. The package is the source of truth for block components and metadata used by the docs.

## Shared Theme Picker

Import `ThemePicker` from `@kamod-ch/blocks/shared` and load
`@kamod-ch/blocks/theme-picker.css` alongside your Kamod styles. The controlled
`preset` / `onPresetChange` and `scheme` / `onSchemeChange` pairs let the host own
the theme target and persistence; opening a picker never changes global state.
Use `resolveHref` for local documentation routes, `triggerClass` for trigger
sizing, and `children` for extra controls such as radius or Copy CSS.
