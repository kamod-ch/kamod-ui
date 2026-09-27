/** Loaded only when a sidebar source file is requested. */
import type { SidebarBlockId } from "@kamod-ch/blocks";
import { sidebarBlockMetadata } from "../../../blocks/src/sidebar/metadata";
import { sourceFromManifest } from "./source-manifest";

const sources = import.meta.glob<string>(
  [
    "../../../blocks/src/sidebar/sidebar-*/sidebar-*.tsx",
    "../../../blocks/src/sidebar/SidebarBlockShell.tsx",
    "../../../blocks/src/sidebar/sidebar-data.ts",
    "../../../blocks/src/sidebar/shared/*.{ts,tsx}",
    "../../../blocks/src/auth/shared/kamod-{icon,icon-frame,brand-sizes}.{ts,tsx}",
  ],
  { query: "?raw", import: "default", eager: true },
);
export function getSidebarBlockSource(id: SidebarBlockId, label: string): string {
  return sourceFromManifest(
    sidebarBlockMetadata.find((block) => block.id === id)?.files ?? [],
    label,
    sources,
  );
}
