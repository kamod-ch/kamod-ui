# Sidebar source downloads

Each sidebar detail page offers a ZIP containing **one installable variant**. Extract its folder into `src/components/blocks`, install the listed dependencies and configure the existing Kamod/Tailwind styles.

```tsx
import { Sidebar05 } from "./components/blocks/sidebar-05";
```

## How it works

1. Every `sidebar-XX/index.ts` exports its explicit page composition.
2. `scripts/lib/sidebar-downloads.mjs` follows relative imports, including type imports, and collects only the necessary source files.
3. It rewrites those imports into one destination folder:

   ```text
   sidebar-05/
   ├── index.ts
   ├── sidebar-05.tsx
   ├── components/     # Included navigation/layout helpers
   ├── data/           # Replaceable demo content
   ├── branding/       # Included only when used
   └── LICENSE.md
   ```

4. The generated `packages/blocks/src/sidebar/installation-manifest.json` supplies the registry, documentation file tree and source-viewer labels.
5. The docs Vite plugin emits ZIPs and matching source JSON at `blocks/downloads/`. Development serves the same assets and refreshes them when sidebar or branding source changes.

The **Code tab shows the installed paths and rewritten imports**, not the repository's internal paths. ZIP compression happens during development/build, never in the browser. Generated ZIP/JSON assets belong to the site output and are not checked in.

## When changing a sidebar

Keep its composition in `sidebar-XX.tsx`, demo fixtures in `sidebar/data/`, and reusable behavior in focused helpers. Shared branding lives in `shared/branding/`; authentication and sidebar blocks use the same source assets.

Regenerate the checked-in manifest after adding, removing or moving an import:

```sh
corepack pnpm --filter @kamod-ch/ui-docs blocks:downloads
```

The docs dev server and build also regenerate it. **Commit manifest changes with the source change.** Do not edit the manifest or exported copies manually.

The exporter currently supports TypeScript/TSX modules and textual SVG assets. It preserves asset queries such as `?url`. Unknown asset formats, unresolved imports, conflicting destinations and non-literal dynamic imports fail explicitly. Extend the generator and its tests before introducing another format or source location.

## Validation

```sh
corepack pnpm --filter @kamod-ch/ui-docs test
corepack pnpm --filter @kamod-ch/blocks test
corepack pnpm --filter @kamod-ch/ui-docs build
```

Installation tests check all 16 dependency graphs, manifest freshness, exact ZIP/source equality, license inclusion, deterministic output, and TypeScript plus bundler compilation of extracted folders **without repository aliases**. Browser coverage in `sidebar-installation.spec.ts` checks downloads, source loading, keyboard disclosure and narrow layouts.

Run the blocks build before its tests if workspace runtime exports have been cleared by a typecheck. Follow the repository's normal browser-test setup for Playwright.
