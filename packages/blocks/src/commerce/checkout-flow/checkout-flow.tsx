import { Button } from "@kamod-ch/ui";
import { useEffect, useReducer, useRef, useState } from "preact/hooks";
import { canUseDOM, prefersReducedMotion } from "../../shared";
import { PaymentForm } from "../payment-form/payment-form";
import { checkoutReducer, initialCheckoutState } from "../shared/checkout-machine";
import type {
  CheckoutItem,
  CheckoutSubmitPayload,
  PaymentFormValues,
  SavedCardSummary,
} from "../shared/types";

export type CheckoutFlowProps = {
  items?: CheckoutItem[];
  savedCard?: SavedCardSummary;
  onSubmit?: (payload: CheckoutSubmitPayload) => Promise<{ orderId: string }>;
  confetti?: boolean;
};

const money = (value: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value / 100);

export const CheckoutFlow = ({
  items = [],
  savedCard,
  onSubmit,
  confetti = false,
}: CheckoutFlowProps) => {
  const [state, dispatch] = useReducer(checkoutReducer, undefined, initialCheckoutState);
  const [card, setCard] = useState<PaymentFormValues | SavedCardSummary | null>(savedCard ?? null);
  const rootRef = useRef<HTMLDivElement>(null);
  const inflight = useRef(false);
  const total = items.reduce((sum, item) => sum + item.unitAmount * item.quantity, 0);

  useEffect(() => {
    if (state.stage !== "success" || !confetti || !canUseDOM() || prefersReducedMotion()) return;
    void import("../shared/confetti").then((mod) => {
      if (rootRef.current) mod.burstConfetti(rootRef.current);
    });
  }, [confetti, state.stage]);

  const submitOrder = async () => {
    if (!card || inflight.current) return;
    inflight.current = true;
    dispatch({ type: "submit" });
    try {
      const result = await onSubmit?.({ items, card });
      dispatch({ type: "success", orderId: result?.orderId ?? "unknown" });
    } catch (cause) {
      inflight.current = false;
      dispatch({
        type: "fail",
        message: cause instanceof Error ? cause.message : "Checkout failed.",
      });
    }
  };

  return (
    <div
      ref={rootRef}
      data-slot="block-checkout-flow"
      data-stage={state.stage}
      class="bg-background text-foreground relative mx-auto w-full max-w-lg space-y-4 rounded-xl border p-4"
    >
      <ol class="text-muted-foreground flex gap-2 text-xs">
        {(["cart", "payment", "confirm", "success"] as const).map((step) => (
          <li key={step} class={state.stage === step ? "text-foreground font-medium" : ""}>
            {step}
          </li>
        ))}
      </ol>
      {state.stage === "cart" ? (
        <div class="space-y-3">
          <ul class="space-y-2">
            {items.map((item) => (
              <li key={item.id} class="flex justify-between text-sm">
                <span>
                  {item.label} × {item.quantity}
                </span>
                <span>{money(item.unitAmount * item.quantity, item.currency)}</span>
              </li>
            ))}
          </ul>
          <p class="font-medium">Total {money(total)}</p>
          <Button type="button" onClick={() => dispatch({ type: "to-payment" })}>
            Continue to payment
          </Button>
        </div>
      ) : null}
      {state.stage === "payment" ? (
        <div class="space-y-3">
          {savedCard ? (
            <Button
              type="button"
              variant="outline"
              class="w-full"
              onClick={() => {
                setCard(savedCard);
                dispatch({ type: "to-confirm" });
              }}
            >
              Use {savedCard.brand} •••• {savedCard.last4}
            </Button>
          ) : null}
          <PaymentForm
            onSubmit={(values) => {
              setCard(values);
              dispatch({ type: "to-confirm" });
            }}
          />
          <Button type="button" variant="ghost" onClick={() => dispatch({ type: "back" })}>
            Back
          </Button>
        </div>
      ) : null}
      {state.stage === "confirm" || state.stage === "submitting" || state.stage === "error" ? (
        <div class="space-y-3">
          <p class="text-sm">
            {items.length} items · {money(total)}
            {card && "last4" in card
              ? ` · ${card.brand} •••• ${card.last4}`
              : card
                ? ` · ${card.brand}`
                : ""}
          </p>
          {state.error ? (
            <p role="alert" class="text-destructive text-sm">
              {state.error}
            </p>
          ) : null}
          <div class="flex gap-2">
            <Button
              type="button"
              disabled={state.stage === "submitting"}
              onClick={() => {
                void submitOrder();
              }}
            >
              {state.stage === "submitting"
                ? "Placing order…"
                : state.stage === "error"
                  ? "Retry"
                  : "Place order"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={state.stage === "submitting"}
              onClick={() => dispatch({ type: "back" })}
            >
              Back
            </Button>
          </div>
        </div>
      ) : null}
      {state.stage === "success" ? (
        <div class="space-y-2">
          <h2 class="text-lg font-semibold">Order confirmed</h2>
          <p class="text-sm">Order ID {state.orderId}</p>
        </div>
      ) : null}
    </div>
  );
};
