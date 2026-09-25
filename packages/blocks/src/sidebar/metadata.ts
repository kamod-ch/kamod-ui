/** Component-free registry data for lightweight documentation overviews. */
import type { BlockDefinition, BlockFile, SidebarBlockId } from "./sidebar-data";
import { sidebarVariants } from "./sidebar-data";

const blockFiles = (id: SidebarBlockId): BlockFile[] => {
  const shared: BlockFile[] = [
    {
      path: "src/sidebar/shared/app-sidebar.tsx",
      label: "components/app-sidebar.tsx",
      kind: "support",
    },
    {
      path: "src/sidebar/shared/dashboard-shell.tsx",
      label: "components/dashboard-shell.tsx",
      kind: "support",
    },
    {
      path: "src/sidebar/shared/search-form.tsx",
      label: "components/search-form.tsx",
      kind: "support",
    },
    {
      path: "src/sidebar/shared/version-switcher.tsx",
      label: "components/version-switcher.tsx",
      kind: "support",
    },
    {
      path: "src/sidebar/shared/nav.tsx",
      label: "components/nav.tsx",
      kind: "support",
    },
    {
      path: "src/sidebar/shared/nav-secondary.tsx",
      label: "components/nav-secondary.tsx",
      kind: "support",
    },
    {
      path: "src/sidebar/shared/nav-actions.tsx",
      label: "components/nav-actions.tsx",
      kind: "support",
    },
    {
      path: "src/sidebar/shared/nav-favorites.tsx",
      label: "components/nav-favorites.tsx",
      kind: "support",
    },
    {
      path: "src/sidebar/shared/sidebar-opt-in-form.tsx",
      label: "components/sidebar-opt-in-form.tsx",
      kind: "support",
    },
    {
      path: "src/sidebar/shared/site-header.tsx",
      label: "components/site-header.tsx",
      kind: "support",
    },
    {
      path: "src/sidebar/SidebarBlockShell.tsx",
      label: "components/sidebar-block-shell.tsx",
      kind: "support",
    },
  ];

  return [
    {
      path: `src/sidebar/${id}/${id}.tsx`,
      label: "app/dashboard/page.tsx",
      kind: "page",
    },
    ...shared,
  ];
};

export const sidebarBlockMetadata: Omit<BlockDefinition, "component">[] = sidebarVariants.map(
  (variant) => ({
    id: variant.id,
    title: variant.title,
    description: variant.description,
    category: "sidebar",
    files: blockFiles(variant.id),
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: [
      "Sidebar",
      "SidebarProvider",
      "SidebarInset",
      "SidebarTrigger",
      "Breadcrumb",
      "Separator",
    ],
    tags: ["application", "navigation", ...variant.features],
    features: variant.features,
    preview: { height: 800, fullWidth: true },
    installCommand: `@kamod-ch/blocks/sidebar/${variant.id}`,
  }),
);
