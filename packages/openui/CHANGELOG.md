# Changelog

## 0.6.0

- Expand OpenUI adapter across Phases 1–4: overlays, forms, data, navigation, media, and chrome.
- Add `RadioGroup`, `Collapsible`, `Empty`, `Avatar`, `Label`, `Spinner`, `Tooltip`.
- Add `Dialog`, `AlertDialog`, `DatePicker`, `Combobox`, `RichSelect`, `Slider`.
- Add `Table`, `DataTable`, `Pagination`, `Breadcrumb`, overlays (`Popover`, `HoverCard`, `Dropdown`, `Drawer`, `Sheet`), media, OTP/input group, toggles, and related chrome.
- Add `Command`, `Calendar`, `Chart`, `Toast`, `Sonner`, `Sidebar`, menus, `AspectRatio`, `Prose`, `ThemeToggle`, `Kbd`, `LocaleSegmentGroup`.
- Add `validateMediaUrl` security helper and `presets/dashboard`.
- Raise `KAMOD_OPENUI_ADAPTER_VERSION` to `0.5.0`.
- Explicitly exclude `Dropzone` (file upload risk) and `Direction` (no LLM surface) from the adapter.

## 0.2.1

- Initial MVP release of `@kamod-ch/openui`.
- Secure OpenUI adapter for `@kamod-ch/ui` with Preact/`preact/compat` support.
- Layout, content, feedback, interaction, and form component presets.
- `KamodOpenUIRenderer`, action/navigation security policies, and system prompt helpers.
