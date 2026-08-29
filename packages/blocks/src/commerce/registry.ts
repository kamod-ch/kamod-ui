import type { CatalogBlockDefinition, CatalogBlockFile } from "../shared";
import { CheckoutFlowPreview } from "./checkout-flow";
import { PaymentFormPreview } from "./payment-form";
import { SavedCardsListPreview } from "./saved-cards-list";

export type CommerceBlockId = "checkout-flow" | "payment-form" | "saved-cards-list";

export type CommerceBlockDefinition = CatalogBlockDefinition<CommerceBlockId> & {
  props: { name: string; type: string; description: string }[];
  usage: string;
};

const catalog = (id: CommerceBlockId) => `https://uipkge.dev/react/blocks/${id}`;
const componentFile = (id: CommerceBlockId, fileName: string): CatalogBlockFile => ({
  path: `src/commerce/${id}/${fileName}`,
  label: `components/${fileName}`,
  kind: "component",
});
const support = (path: string, label: string): CatalogBlockFile => ({
  path,
  label,
  kind: "support",
});

const types = support("src/commerce/shared/types.ts", "components/types.ts");
const machine = support(
  "src/commerce/shared/checkout-machine.ts",
  "components/checkout-machine.ts",
);
const fixtures = support("src/commerce/shared/fixtures.ts", "components/fixtures.ts");

const components = {
  "checkout-flow": CheckoutFlowPreview,
  "payment-form": PaymentFormPreview,
  "saved-cards-list": SavedCardsListPreview,
} satisfies Record<CommerceBlockId, CommerceBlockDefinition["component"]>;

const definitions: Omit<CommerceBlockDefinition, "component" | "installCommand" | "source">[] = [
  {
    id: "payment-form",
    title: "Payment Form",
    description:
      "Wallet actions and a card form with Luhn/expiry/CVC as pure functions. PAN/CVC are passed only to the callback and never persisted. This block alone is not PCI compliant — use PSP-hosted fields or tokenization.",
    category: "commerce",
    catalogUrl: catalog("payment-form"),
    files: [componentFile("payment-form", "payment-form.tsx"), types],
    dependencies: ["@kamod-ch/ui", "preact"],
    uiComponents: ["Button", "Input", "Label", "FieldError"],
    tags: ["commerce", "payments"],
    features: ["luhn", "brand-detect", "no-pan-persist"],
    preview: { height: 720, fullWidth: true },
    props: [
      {
        name: "onSubmit",
        type: "(values: PaymentFormValues) => void | Promise<void>",
        description: "Receives digits-only PAN/CVC once. Clear local fields after success.",
      },
      {
        name: "onWallet",
        type: "(wallet) => void | Promise<void>",
        description: "Apple Pay / Google Pay.",
      },
    ],
    usage: `import { PaymentForm } from "@kamod-ch/blocks/commerce/payment-form";

export const Example = () => (
  <PaymentForm onSubmit={(values) => fetch("/psp", { method: "POST", body: JSON.stringify(values) })} />
);`,
  },
  {
    id: "saved-cards-list",
    title: "Saved Cards List",
    description:
      "Masked, tokenized card summaries only. Controlled add/remove/setDefault with a confirm dialog and empty state.",
    category: "commerce",
    catalogUrl: catalog("saved-cards-list"),
    files: [componentFile("saved-cards-list", "saved-cards-list.tsx"), types, fixtures],
    dependencies: ["@kamod-ch/ui", "preact"],
    uiComponents: ["AlertDialog", "Button", "Dialog", "Empty"],
    tags: ["commerce", "payments"],
    features: ["masked-only", "confirm-remove", "empty-state"],
    preview: { height: 560, fullWidth: true },
    props: [
      {
        name: "cards",
        type: "SavedCardSummary[]",
        description: "last4, brand, expiry, token id. Never PAN/CVC.",
      },
      { name: "onRemove", type: "(id: string) => void", description: "After confirm." },
      { name: "onSetDefault", type: "(id: string) => void", description: "Default card callback." },
    ],
    usage: `import { SavedCardsList } from "@kamod-ch/blocks/commerce/saved-cards-list";

export const Example = () => (
  <SavedCardsList cards={[{ id: "tok_1", brand: "visa", last4: "4242", expiryMonth: "12", expiryYear: "2028" }]} />
);`,
  },
  {
    id: "checkout-flow",
    title: "Checkout Flow",
    description:
      "Explicit cart → payment → confirm → submitting → success/error machine. onSubmit returns orderId. Double submit is ignored. Confetti is optional, lazy, and skipped when reduced motion is preferred.",
    category: "commerce",
    catalogUrl: catalog("checkout-flow"),
    files: [componentFile("checkout-flow", "checkout-flow.tsx"), machine, types, fixtures],
    dependencies: ["@kamod-ch/ui", "preact"],
    uiComponents: ["Button"],
    tags: ["commerce", "checkout"],
    features: ["state-machine", "no-double-submit", "lazy-confetti"],
    preview: { height: 720, fullWidth: true },
    props: [
      { name: "items", type: "CheckoutItem[]", description: "Cart lines in minor units." },
      {
        name: "onSubmit",
        type: "(payload) => Promise<{ orderId: string }>",
        description: "Called once from confirm. Ignored while submitting.",
      },
      {
        name: "confetti",
        type: "boolean",
        description: "Lazy success burst. Off when reduced motion is set.",
      },
    ],
    usage: `import { CheckoutFlow } from "@kamod-ch/blocks/commerce/checkout-flow";

export const Example = () => (
  <CheckoutFlow
    items={[{ id: "seat", label: "Pro seat", quantity: 1, unitAmount: 2900 }]}
    onSubmit={async () => ({ orderId: "ord_1" })}
  />
);`,
  },
];

export const commerceBlocks: CommerceBlockDefinition[] = definitions.map((block) => ({
  ...block,
  source: "uipkge",
  component: components[block.id],
  installCommand: `@kamod-ch/blocks/commerce/${block.id}`,
}));

export const commerceBlocksById = commerceBlocks.reduce(
  (acc, block) => {
    acc[block.id] = block;
    return acc;
  },
  {} as Record<CommerceBlockId, CommerceBlockDefinition>,
);
