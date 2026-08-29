import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CheckoutFlow } from "./checkout-flow";
import { PaymentForm } from "./payment-form";
import { SavedCardsList } from "./saved-cards-list";
import { previewCheckoutItems, previewSavedCards } from "./shared/fixtures";

afterEach(() => cleanup());

describe("commerce blocks", () => {
  it("rejects an invalid PAN with Luhn and does not persist CVC", async () => {
    const onSubmit = vi.fn();
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    render(<PaymentForm onSubmit={onSubmit} now={new Date(2026, 7, 14)} />);
    fireEvent.input(screen.getByLabelText("Name on card"), { target: { value: "Ada Lovelace" } });
    fireEvent.input(screen.getByLabelText("Card number"), {
      target: { value: "4111111111111112" },
    });
    fireEvent.input(screen.getByLabelText("Expiry"), { target: { value: "1228" } });
    fireEvent.input(screen.getByLabelText("CVC"), { target: { value: "123" } });
    fireEvent.click(screen.getByRole("button", { name: "Pay" }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText("Enter a valid card number.")).toBeTruthy();
    expect(setItem).not.toHaveBeenCalled();
    setItem.mockRestore();
  });

  it("submits valid card digits only to the callback and clears CVC", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const { container } = render(<PaymentForm onSubmit={onSubmit} now={new Date(2026, 7, 14)} />);
    fireEvent.input(screen.getByLabelText("Name on card"), { target: { value: "Ada Lovelace" } });
    fireEvent.input(screen.getByLabelText("Card number"), {
      target: { value: "4111111111111111" },
    });
    fireEvent.input(screen.getByLabelText("Expiry"), { target: { value: "1228" } });
    fireEvent.input(screen.getByLabelText("CVC"), { target: { value: "123" } });
    fireEvent.click(screen.getByRole("button", { name: "Pay" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0]?.[0]).toMatchObject({
      pan: "4111111111111111",
      cvc: "123",
      brand: "visa",
      expiryMonth: "12",
      expiryYear: "2028",
    });
    expect((container.querySelector("#pay-cvc") as HTMLInputElement).value).toBe("");
  });

  it("surfaces async payment errors without logging secrets", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const onSubmit = vi.fn().mockRejectedValue(new Error("Declined"));
    render(<PaymentForm onSubmit={onSubmit} now={new Date(2026, 7, 14)} />);
    fireEvent.input(screen.getByLabelText("Name on card"), { target: { value: "Ada Lovelace" } });
    fireEvent.input(screen.getByLabelText("Card number"), {
      target: { value: "4111111111111111" },
    });
    fireEvent.input(screen.getByLabelText("Expiry"), { target: { value: "1228" } });
    fireEvent.input(screen.getByLabelText("CVC"), { target: { value: "123" } });
    fireEvent.click(screen.getByRole("button", { name: "Pay" }));
    expect(await screen.findByText("Declined")).toBeTruthy();
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it("confirms removal of a masked saved card", () => {
    const onRemove = vi.fn();
    render(<SavedCardsList cards={previewSavedCards} onRemove={onRemove} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Remove" })[0]!);
    fireEvent.click(screen.getByRole("button", { name: "Remove card" }));
    expect(onRemove).toHaveBeenCalledWith("card_visa");
  });

  it("ignores a second checkout click while submitting", async () => {
    let resolve!: (value: { orderId: string }) => void;
    const onSubmit = vi.fn(
      () =>
        new Promise<{ orderId: string }>((next) => {
          resolve = next;
        }),
    );
    render(
      <CheckoutFlow
        items={previewCheckoutItems}
        savedCard={previewSavedCards[0]}
        onSubmit={onSubmit}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Continue to payment" }));
    fireEvent.click(screen.getByRole("button", { name: /Use visa/i }));
    fireEvent.click(screen.getByRole("button", { name: "Place order" }));
    fireEvent.click(screen.getByRole("button", { name: "Placing order…" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    resolve({ orderId: "ord_99" });
    expect(await screen.findByText(/ord_99/)).toBeTruthy();
  });

  it("imports commerce modules without window access at load time", async () => {
    const mod = await import("./index");
    expect(mod.commerceBlocks).toHaveLength(3);
    expect(typeof mod.PaymentForm).toBe("function");
    expect(typeof mod.checkoutReducer).toBe("function");
  });
});
