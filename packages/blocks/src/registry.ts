import type { AuthBlockId, BlockDefinition } from "./auth/types";
import { loginBlocks } from "./login/registry";
import { signupBlocks } from "./signup/registry";

export const authBlocks: BlockDefinition[] = [...loginBlocks, ...signupBlocks];
export const blocksRegistry = authBlocks;
export const authBlocksById = authBlocks.reduce<Record<AuthBlockId, BlockDefinition>>(
  (acc, block) => {
    acc[block.id] = block;
    return acc;
  },
  {} as Record<AuthBlockId, BlockDefinition>,
);
