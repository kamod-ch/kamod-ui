import type { CommerceBlockId } from "@kamod-ch/blocks";
import checkoutFlow from "../../../blocks/src/commerce/checkout-flow/checkout-flow.tsx?raw";
import paymentForm from "../../../blocks/src/commerce/payment-form/payment-form.tsx?raw";
import savedCards from "../../../blocks/src/commerce/saved-cards-list/saved-cards-list.tsx?raw";
import machine from "../../../blocks/src/commerce/shared/checkout-machine.ts?raw";
import fixtures from "../../../blocks/src/commerce/shared/fixtures.ts?raw";
import types from "../../../blocks/src/commerce/shared/types.ts?raw";

const sources: Record<CommerceBlockId, Record<string, string>> = {
  "payment-form": {
    "components/payment-form.tsx": paymentForm,
    "components/types.ts": types,
  },
  "saved-cards-list": {
    "components/saved-cards-list.tsx": savedCards,
    "components/types.ts": types,
    "components/fixtures.ts": fixtures,
  },
  "checkout-flow": {
    "components/checkout-flow.tsx": checkoutFlow,
    "components/checkout-machine.ts": machine,
    "components/types.ts": types,
    "components/fixtures.ts": fixtures,
  },
};

export const getCommerceBlockSource = (id: CommerceBlockId, fileLabel: string): string =>
  sources[id]?.[fileLabel] ?? Object.values(sources[id] ?? {})[0] ?? "";
