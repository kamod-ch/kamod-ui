import type { BlockDefinition, SignupBlockId } from "../auth/types";
import { signupBlockMetadata } from "./metadata";
import { Signup01 } from "./signup-01";
import { Signup02 } from "./signup-02";
import { Signup03 } from "./signup-03";
import { Signup04 } from "./signup-04";
import { Signup05 } from "./signup-05";

const components = {
  "signup-01": Signup01,
  "signup-02": Signup02,
  "signup-03": Signup03,
  "signup-04": Signup04,
  "signup-05": Signup05,
} satisfies Record<SignupBlockId, BlockDefinition["component"]>;

export const signupBlocks: BlockDefinition[] = signupBlockMetadata.map((block) => ({
  ...block,
  component: components[block.id],
}));

export const signupBlocksById = signupBlocks.reduce<Record<SignupBlockId, BlockDefinition>>(
  (acc, block) => {
    acc[block.id as SignupBlockId] = block;
    return acc;
  },
  {} as Record<SignupBlockId, BlockDefinition>,
);
