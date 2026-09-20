/**
 * @file Application shell metadata shared by the documentation overview and detail routes.
 * Source-file labels correspond to the docs application's applicationShellSources map.
 */
import { ApplicationShell1Preview } from "./application-shell-1/preview";

/**
 * Registered variants with their preview component, source files and dependency metadata.
 * `id` is the route/import identifier; `title` is the zero-padded name displayed to readers.
 * The inherited `installCommand` field holds a workspace import path, not an installation
 * command: this private blocks package is distributed to users as copyable source.
 */
export const applicationShellBlocks = [
  {
    id: "application-shell-1",
    title: "application-shell-01",
    description:
      "A responsive application shell with grouped navigation, breadcrumbs and a user menu.",
    category: "application-shell",
    component: ApplicationShell1Preview,
    files: [
      "application-shell-1.tsx",
      "app-sidebar.tsx",
      "nav-main.tsx",
      "nav-user.tsx",
      "menu.tsx",
      "types.ts",
      "preview.tsx",
      "demo-data.tsx",
      "index.ts",
    ].map((label) => ({
      label,
      path: `src/application-shell/application-shell-1/${label}`,
    })),
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Sidebar", "Breadcrumb", "Collapsible", "Dropdown", "Avatar", "Separator"],
    tags: ["application", "navigation", "responsive", "icon-mode"],
    preview: { height: 760, fullWidth: true },
    installCommand: "@kamod-ch/blocks/application-shell/application-shell-1",
    sourceUrl: "https://www.shadcnblocks.com/block/application-shell1",
  },
] as const;
