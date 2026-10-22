import type { CatalogBlockDefinition } from "../shared";
import { type AppSidebarBlockId, definitions } from "./catalog-definitions";
import { AppSidebar01Preview } from "./sidebar-01";
import { AppSidebar02Preview } from "./sidebar-02";
import { AppSidebar03Preview } from "./sidebar-03";
import { AppSidebar04Preview } from "./sidebar-04";
import { AppSidebar05Preview } from "./sidebar-05";
import { AppSidebar06Preview } from "./sidebar-06";
import { AppSidebar07Preview } from "./sidebar-07";

export type { AppSidebarBlockId } from "./catalog-definitions";

export type AppSidebarBlockDefinition = CatalogBlockDefinition<AppSidebarBlockId> & {
  props: { name: string; type: string; description: string }[];
  usage: string;
};

const components = {
  "sidebar-01": AppSidebar01Preview,
  "sidebar-02": AppSidebar02Preview,
  "sidebar-03": AppSidebar03Preview,
  "sidebar-04": AppSidebar04Preview,
  "sidebar-05": AppSidebar05Preview,
  "sidebar-06": AppSidebar06Preview,
  "sidebar-07": AppSidebar07Preview,
} satisfies Record<AppSidebarBlockId, AppSidebarBlockDefinition["component"]>;

export const appSidebarBlocks: AppSidebarBlockDefinition[] = definitions.map((block) => ({
  ...(block as Omit<AppSidebarBlockDefinition, "component" | "installCommand" | "source">),
  source: "uipkge",
  component: components[block.id as AppSidebarBlockId],
  installCommand: `@kamod-ch/blocks/app-sidebar/${block.id}`,
}));

export const appSidebarBlocksById = appSidebarBlocks.reduce(
  (acc, block) => {
    acc[block.id] = block;
    return acc;
  },
  {} as Record<AppSidebarBlockId, AppSidebarBlockDefinition>,
);
