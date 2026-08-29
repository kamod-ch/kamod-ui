import type { CheckoutItem, SavedCardSummary } from "./types";

export const previewSavedCards: SavedCardSummary[] = [
  {
    id: "card_visa",
    brand: "visa",
    last4: "4242",
    expiryMonth: "12",
    expiryYear: "2028",
    holderName: "Ada Lovelace",
    isDefault: true,
  },
  {
    id: "card_mc",
    brand: "mastercard",
    last4: "4444",
    expiryMonth: "04",
    expiryYear: "2027",
  },
];

export const previewCheckoutItems: CheckoutItem[] = [
  { id: "seat", label: "Pro seat", quantity: 2, unitAmount: 2900 },
  { id: "usage", label: "Usage pack", quantity: 1, unitAmount: 1200 },
];
