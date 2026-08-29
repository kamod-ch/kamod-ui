import { PaymentForm } from "./payment-form";

export const PaymentFormPreview = () => (
  <div class="p-4">
    <PaymentForm now={new Date(2026, 7, 14)} />
  </div>
);
