/** Component-free application shell registry data; source labels match the docs source map. */
export const applicationShellBlockMetadata = [
  {
    id: "application-shell-1",
    title: "application-shell-01",
    description:
      "A responsive application shell with grouped navigation, breadcrumbs and a user menu.",
    category: "application-shell",
    files: [
      "application-shell-1.tsx",
      "app-sidebar.tsx",
      "nav-main.tsx",
      "nav-user.tsx",
      "menu.tsx",
      "types.ts",
      "preview.tsx",
      "demo-data.tsx",
      "assets/kamod-ui-logo.svg",
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
