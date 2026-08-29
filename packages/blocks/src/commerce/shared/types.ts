import type { CardBrand } from "../../shared";

export type WalletKind = "apple-pay" | "google-pay" | "card";

export type PaymentFormValues = {
  holderName: string;
  pan: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  brand: CardBrand;
};

export type SavedCardSummary = {
  id: string;
  brand: CardBrand;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  holderName?: string;
  isDefault?: boolean;
};

export type CheckoutItem = {
  id: string;
  label: string;
  quantity: number;
  unitAmount: number;
  currency?: string;
};

export type CheckoutStage = "cart" | "payment" | "confirm" | "submitting" | "success" | "error";

export type CheckoutState = {
  stage: CheckoutStage;
  orderId: string | null;
  error: string | null;
};

export type CheckoutSubmitPayload = {
  items: CheckoutItem[];
  card: SavedCardSummary | PaymentFormValues;
};
