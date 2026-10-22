import type { CatalogBlockDefinition } from "../shared";
import { AuthMfa } from "./auth-mfa";
import { AuthPasswordReset } from "./auth-password-reset";
import { AuthSignIn } from "./auth-sign-in";
import { AuthSignUp } from "./auth-sign-up";
import { type CatalogAuthBlockId, definitions } from "./catalog-definitions";
import { AuthLogin01 } from "./login-01";
import { AuthLogin02 } from "./login-02";
import { Register01 } from "./register-01";

export type { CatalogAuthBlockId } from "./catalog-definitions";

export type CatalogAuthBlockDefinition = CatalogBlockDefinition<CatalogAuthBlockId> & {
  props: { name: string; type: string; description: string }[];
  usage: string;
};

const components = {
  "auth-mfa": AuthMfa,
  "auth-password-reset": AuthPasswordReset,
  "auth-sign-in": AuthSignIn,
  "auth-sign-up": AuthSignUp,
  "login-01": AuthLogin01,
  "login-02": AuthLogin02,
  "register-01": Register01,
} satisfies Record<CatalogAuthBlockId, CatalogAuthBlockDefinition["component"]>;

export const catalogAuthBlocks: CatalogAuthBlockDefinition[] = definitions.map((block) => ({
  ...(block as Omit<CatalogAuthBlockDefinition, "component" | "installCommand" | "source">),
  source: "uipkge",
  component: components[block.id as CatalogAuthBlockId],
  installCommand: `@kamod-ch/blocks/auth/${block.id}`,
}));

export const catalogAuthBlocksById = catalogAuthBlocks.reduce(
  (acc, block) => {
    acc[block.id] = block;
    return acc;
  },
  {} as Record<CatalogAuthBlockId, CatalogAuthBlockDefinition>,
);
