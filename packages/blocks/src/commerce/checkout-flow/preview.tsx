import { previewCheckoutItems, previewSavedCards } from "../shared/fixtures";
import { CheckoutFlow } from "./checkout-flow";

export const CheckoutFlowPreview = () => (
  <div class="p-4">
    <CheckoutFlow items={previewCheckoutItems} savedCard={previewSavedCards[0]} confetti />
  </div>
);
