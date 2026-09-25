import type { BlockDefinition, LoginBlockId } from "../auth/types";
import { Login01 } from "./login-01";
import { Login02 } from "./login-02";
import { Login03 } from "./login-03";
import { Login04 } from "./login-04";
import { Login05 } from "./login-05";

import { loginBlockMetadata } from "./metadata";

const components = {
  "login-01": Login01,
  "login-02": Login02,
  "login-03": Login03,
  "login-04": Login04,
  "login-05": Login05,
} satisfies Record<LoginBlockId, BlockDefinition["component"]>;

export const loginBlocks: BlockDefinition[] = loginBlockMetadata.map((block) => ({
  ...block,
  component: components[block.id],
}));

export const loginBlocksById = loginBlocks.reduce<Record<LoginBlockId, BlockDefinition>>(
  (acc, block) => {
    acc[block.id as LoginBlockId] = block;
    return acc;
  },
  {} as Record<LoginBlockId, BlockDefinition>,
);
