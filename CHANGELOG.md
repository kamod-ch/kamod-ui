# Changelog

All notable changes to this project will be documented in this file. Update manually before running `pnpm release`.

## [1.1.0] - Unreleased

### Features

- **Sidebar:** ship the full application-shell sidebar system (replacing the minimal 1.0.1 stub in published builds).
  - `SidebarProvider` with controlled/uncontrolled desktop `open` state and mobile `openMobile` sheet
  - `Sidebar`, `SidebarHeader`, `SidebarContent`, `SidebarFooter`, `SidebarInset`, `SidebarRail`, `SidebarTrigger`
  - Menu primitives: `SidebarMenu`, `SidebarMenuButton`, `SidebarMenuSub`, badges, skeletons, groups
  - Mobile drawer via `Sheet` (focus trap, body scroll lock, escape to close)
  - Desktop collapse modes: `offcanvas`, `icon`, `none`; variants `sidebar`, `floating`, `inset`
  - Keyboard shortcut `Ctrl/Cmd + B` to toggle
- **Sidebar blocks:** 16 documented sidebar block variants in `@kamod-ch/blocks` (docs site)

### Notes for consumers

- `@kamod-ui-pro/application-shell` (`DashboardShell`) requires `@kamod-ch/ui` **>= 1.1.0**.
- Import `@kamod-ch/ui/theme.css` and scan `@kamod-ch/ui/dist/**/*.js` in Tailwind `content` when using sidebar tokens.

## [0.2.1](https://github.com/kamod-ch/kamod-ui/compare/v0.1.5...v0.2.1) (2026-06-10)

## [0.2.0](https://github.com/kamod-ch/kamod-ui/compare/v0.1.5...v0.2.0) (2026-06-10)

### ⚠ BREAKING CHANGES

- The npm package was renamed from `@kamod-ui/core` to `@kamod-ch/ui`. Update all imports and CSS paths accordingly.

## [0.1.5](https://github.com/kamod-ch/kamod-ui/compare/v0.1.4...v0.1.5) (2026-06-08)

## [0.1.4](https://github.com/kamod-ch/kamod-ui/compare/v0.1.3...v0.1.4) (2026-06-03)

## [0.1.3](https://github.com/kamod-ch/kamod-ui/compare/v0.1.2...v0.1.3) (2026-06-03)

## [0.1.2](https://github.com/kamod-ch/kamod-ui/compare/v0.1.1...v0.1.2) (2026-06-03)

## 0.1.1 (2026-06-02)

### Features

- **Dialog:** optimizations ([361113c](https://github.com/kamod-ch/kamod-ui/commit/361113cf969948b885de894641766fca3a7d6e54))
- github icon link added ([2f8f0cd](https://github.com/kamod-ch/kamod-ui/commit/2f8f0cd267d7e5718a6f29404cdef7d6d6178081))
- locale switch included ([fcfc881](https://github.com/kamod-ch/kamod-ui/commit/fcfc88158397bedce664441404f0fddfa1ee6bb5))
- optimizations ([d3c5f28](https://github.com/kamod-ch/kamod-ui/commit/d3c5f28efad615b8c0b15569e776f06f384a6177))
- package.json update ([d9e2930](https://github.com/kamod-ch/kamod-ui/commit/d9e2930365fa8423c7233a33b4993bd47446a57d))
- readme update ([c54badf](https://github.com/kamod-ch/kamod-ui/commit/c54badf52729c881db564b297e000360abdfc888))

### Bug Fixes

- feedback block ([a61e212](https://github.com/kamod-ch/kamod-ui/commit/a61e212b2f1602580025570c3e57906cacc87e80))
- oxc ([0603bca](https://github.com/kamod-ch/kamod-ui/commit/0603bca47e1b1e3b7345958ea65cd37b8288fa11))
- PostCSS has XSS via Unescaped </style> in its CSS Stringify Output ([15be05d](https://github.com/kamod-ch/kamod-ui/commit/15be05d04460e7da083842ca43433c234d21a533))

## [0.1.0] - Initial release

Initial public release of `@kamod-ui/core` (later renamed to `@kamod-ch/ui` in 0.2.0).
