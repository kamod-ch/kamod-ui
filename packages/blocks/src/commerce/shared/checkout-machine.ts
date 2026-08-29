import type { CheckoutStage, CheckoutState } from "./types";

export type CheckoutAction =
  | { type: "to-payment" }
  | { type: "to-confirm" }
  | { type: "back" }
  | { type: "submit" }
  | { type: "success"; orderId: string }
  | { type: "fail"; message: string }
  | { type: "retry" };

const BACK: Record<CheckoutStage, CheckoutStage | null> = {
  cart: null,
  payment: "cart",
  confirm: "payment",
  submitting: null,
  success: null,
  error: "confirm",
};

export const initialCheckoutState = (): CheckoutState => ({
  stage: "cart",
  orderId: null,
  error: null,
});

export const canSubmitCheckout = (state: CheckoutState): boolean =>
  state.stage === "confirm" || state.stage === "error";

export const checkoutReducer = (state: CheckoutState, action: CheckoutAction): CheckoutState => {
  switch (action.type) {
    case "to-payment":
      return state.stage === "cart" ? { ...state, stage: "payment", error: null } : state;
    case "to-confirm":
      return state.stage === "payment" ? { ...state, stage: "confirm", error: null } : state;
    case "back": {
      const previous = BACK[state.stage];
      return previous ? { ...state, stage: previous, error: null } : state;
    }
    case "submit":
      return canSubmitCheckout(state) ? { ...state, stage: "submitting", error: null } : state;
    case "success":
      return state.stage === "submitting"
        ? { stage: "success", orderId: action.orderId, error: null }
        : state;
    case "fail":
      return state.stage === "submitting"
        ? { stage: "error", orderId: null, error: action.message }
        : state;
    case "retry":
      return state.stage === "error" ? { ...state, stage: "confirm", error: null } : state;
    default:
      return state;
  }
};
