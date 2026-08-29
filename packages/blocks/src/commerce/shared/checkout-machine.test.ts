import { describe, expect, it } from "vitest";
import { canSubmitCheckout, checkoutReducer, initialCheckoutState } from "./checkout-machine";

describe("checkout state machine", () => {
  it("walks cart → payment → confirm → submitting → success", () => {
    let state = initialCheckoutState();
    state = checkoutReducer(state, { type: "to-payment" });
    state = checkoutReducer(state, { type: "to-confirm" });
    expect(canSubmitCheckout(state)).toBe(true);
    state = checkoutReducer(state, { type: "submit" });
    expect(state.stage).toBe("submitting");
    const ignored = checkoutReducer(state, { type: "submit" });
    expect(ignored.stage).toBe("submitting");
    state = checkoutReducer(state, { type: "success", orderId: "ord_1" });
    expect(state).toEqual({ stage: "success", orderId: "ord_1", error: null });
  });

  it("blocks skip-ahead and supports retry after failure", () => {
    let state = initialCheckoutState();
    expect(checkoutReducer(state, { type: "to-confirm" }).stage).toBe("cart");
    expect(checkoutReducer(state, { type: "submit" }).stage).toBe("cart");
    state = checkoutReducer(state, { type: "to-payment" });
    state = checkoutReducer(state, { type: "to-confirm" });
    state = checkoutReducer(state, { type: "submit" });
    state = checkoutReducer(state, { type: "fail", message: "Declined" });
    expect(state.stage).toBe("error");
    expect(state.error).toBe("Declined");
    state = checkoutReducer(state, { type: "retry" });
    expect(state.stage).toBe("confirm");
    state = checkoutReducer(state, { type: "back" });
    expect(state.stage).toBe("payment");
  });
});
