import { sidebarBlockMetadata } from "./metadata";
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
import type { BlockDefinition, SidebarBlockId } from "./sidebar-data";

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

export const sidebarBlocks: BlockDefinition[] = sidebarBlockMetadata.map((block) => ({
  ...block,
  component: components[block.id],
}));

export const sidebarBlocksById = sidebarBlocks.reduce<Record<SidebarBlockId, BlockDefinition>>(
  (acc, block) => {
    acc[block.id] = block;
    return acc;
  },
  {} as Record<SidebarBlockId, BlockDefinition>,
);
