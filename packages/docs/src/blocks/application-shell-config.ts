/** Shared route and repository metadata for application-shell documentation. */
import type { applicationShellBlocks } from "@kamod-ch/blocks/application-shell";
import { withBasePath } from "../base-path";
import { demoTopNavItems } from "../layout/DemoShell";

export const categoryPath = "/blocks/application-shell";
export const blocksOverviewHref =
  demoTopNavItems.find((item) => item.label === "Blocks")?.href ?? withBasePath("/blocks/sidebar");
export const repositoryUrl = "https://github.com/kamod-ch/kamod-ui";
/** One registry entry, keeping page props aligned with the available block metadata. */
export type ApplicationShellBlock = (typeof applicationShellBlocks)[number];
