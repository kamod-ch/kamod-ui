import { Sidebar01 } from "./sidebar-01";
import { Sidebar02 } from "./sidebar-02";
import { Sidebar03 } from "./sidebar-03";
import { Sidebar04 } from "./sidebar-04";
import { Sidebar05 } from "./sidebar-05";
import { Sidebar06 } from "./sidebar-06";
import { Sidebar07 } from "./sidebar-07";
import { Sidebar08 } from "./sidebar-08";
import { Sidebar09 } from "./sidebar-09";
import { Sidebar10 } from "./sidebar-10";
import { Sidebar11 } from "./sidebar-11";
import { Sidebar12 } from "./sidebar-12";
import { Sidebar13 } from "./sidebar-13";
import { Sidebar14 } from "./sidebar-14";
import { Sidebar15 } from "./sidebar-15";
import { Sidebar16 } from "./sidebar-16";
import type { BlockDefinition, BlockFile, SidebarBlockId } from "./sidebar-data";
import { sidebarVariants } from "./sidebar-data";

const components = {
  "sidebar-01": Sidebar01,
  "sidebar-02": Sidebar02,
  "sidebar-03": Sidebar03,
  "sidebar-04": Sidebar04,
  "sidebar-05": Sidebar05,
  "sidebar-06": Sidebar06,
  "sidebar-07": Sidebar07,
  "sidebar-08": Sidebar08,
  "sidebar-09": Sidebar09,
  "sidebar-10": Sidebar10,
  "sidebar-11": Sidebar11,
  "sidebar-12": Sidebar12,
  "sidebar-13": Sidebar13,
  "sidebar-14": Sidebar14,
  "sidebar-15": Sidebar15,
  "sidebar-16": Sidebar16,
} satisfies Record<SidebarBlockId, BlockDefinition["component"]>;

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

export const sidebarBlocks: BlockDefinition[] = sidebarVariants.map((variant) => ({
  id: variant.id,
  title: variant.title,
  description: variant.description,
  category: "sidebar",
  component: components[variant.id],
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
}));

export const sidebarBlocksById = sidebarBlocks.reduce<Record<SidebarBlockId, BlockDefinition>>(
  (acc, block) => {
    acc[block.id] = block;
    return acc;
  },
  {} as Record<SidebarBlockId, BlockDefinition>,
);
