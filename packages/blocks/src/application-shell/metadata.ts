const additionalShells = [
  {
    number: 2,
    layoutName: "Inset Workspace",
    description:
      "An inset application workspace with a framed content surface, grouped navigation and account actions.",
    tags: ["inset", "workspace", "responsive"],
  },
  {
    number: 3,
    layoutName: "Compact Navigation Rail",
    description:
      "A space-efficient application shell that starts with an icon rail and expands into fully labeled navigation.",
    tags: ["rail", "compact", "responsive"],
  },
  {
    number: 4,
    layoutName: "Horizontal Workspace",
    description:
      "A horizontal application shell with top-level destinations, a centered content area and mobile sidebar navigation.",
    tags: ["horizontal", "team", "responsive"],
  },
  {
    number: 5,
    layoutName: "Right-Hand Navigation",
    description:
      "A content-first application shell with navigation and account tools on the right, including a right-side mobile sheet.",
    tags: ["right-sidebar", "support", "responsive"],
  },
  {
    number: 6,
    layoutName: "Split Workspace",
    description:
      "An application shell with grouped navigation and a toggleable inspector that sits beside content or stacks below it.",
    tags: ["inspector", "editor", "responsive"],
  },
  {
    number: 7,
    layoutName: "Sectioned Workspace",
    description:
      "An application workspace with contextual section links beneath the header and grouped global navigation in the sidebar.",
    tags: ["sections", "project", "responsive"],
  },
  {
    number: 8,
    layoutName: "Persistent Action Workspace",
    description:
      "A workspace for long forms with a sticky action footer, save status and responsive grouped navigation.",
    tags: ["forms", "actions", "responsive"],
  },
] as const;

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
  ...additionalShells.map(({ number, ...profile }) => ({
    ...profile,
    id: `application-shell-${number}`,
    title: `application-shell-0${number}`,
    category: "application-shell" as const,
    files: [
      `application-shell-${number}/application-shell-${number}.tsx`,
      `application-shell-${number}/index.ts`,
      `application-shell-${number}/preview.tsx`,
      "shared/shell-frame.tsx",
      "shared/types.ts",
      "shared/shell-breadcrumbs.tsx",
      "shared/shell-navigation.tsx",
      "shared/preview-data.ts",
      "shared/preview.tsx",
      "application-shell-1/app-sidebar.tsx",
      "application-shell-1/nav-main.tsx",
      "application-shell-1/nav-user.tsx",
      "application-shell-1/menu.tsx",
      "application-shell-1/types.ts",
      "application-shell-1/assets/kamod-ui-logo.svg",
    ].map((label) => ({ label, path: `src/application-shell/${label}` })),
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Sidebar", "Breadcrumb", "Button", "Dropdown", "Avatar", "Collapsible"],
    preview: { height: 860, fullWidth: true },
    installCommand: `@kamod-ch/blocks/application-shell/application-shell-${number}`,
    sourceUrl: `https://github.com/kamod-ch/kamod-ui/tree/main/packages/blocks/src/application-shell/application-shell-${number}`,
  })),
] as const;
