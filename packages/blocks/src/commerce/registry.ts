import type { CatalogBlockDefinition } from "../shared";
import { type CommerceBlockId, definitions } from "./catalog-definitions";
import { CheckoutFlowPreview } from "./checkout-flow";
import { PaymentFormPreview } from "./payment-form";
import { SavedCardsListPreview } from "./saved-cards-list";

export type { CommerceBlockId } from "./catalog-definitions";

export type CommerceBlockDefinition = CatalogBlockDefinition<CommerceBlockId> & {
  props: { name: string; type: string; description: string }[];
  usage: string;
};

const components = {
  "checkout-flow": CheckoutFlowPreview,
  "payment-form": PaymentFormPreview,
  "saved-cards-list": SavedCardsListPreview,
} satisfies Record<CommerceBlockId, CommerceBlockDefinition["component"]>;

export const commerceBlocks: CommerceBlockDefinition[] = definitions.map((block) => ({
  ...(block as Omit<CommerceBlockDefinition, "component" | "installCommand" | "source">),
  source: "uipkge",
  component: components[block.id as CommerceBlockId],
  installCommand: `@kamod-ch/blocks/commerce/${block.id}`,
}));

export const commerceBlocksById = commerceBlocks.reduce(
  (acc, block) => {
    acc[block.id] = block;
    return acc;
  },
  {} as Record<CommerceBlockId, CommerceBlockDefinition>,
);
