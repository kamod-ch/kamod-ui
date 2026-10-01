/** Component-free registry data for lightweight documentation overviews. */
/** Component-free registry data for lightweight documentation overviews. */
/** Component-free registry data for lightweight documentation overviews. */
/** Component-free registry data for lightweight documentation overviews. */

import installationManifest from "./installation-manifest.json";
import type { BlockDefinition, BlockFile } from "./sidebar-data";
import { sidebarVariants } from "./sidebar-data";

export const sidebarBlockMetadata: Omit<BlockDefinition, "component">[] = sidebarVariants.map(
  (variant) => ({
    id: variant.id,
    title: variant.title,
    description: variant.description,
    category: "sidebar",
    files: installationManifest[variant.id] as BlockFile[],
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
