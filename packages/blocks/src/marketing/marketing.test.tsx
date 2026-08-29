import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Contact01 } from "./contact-01";
import { ContactUs } from "./contact-us";
import { Faq01 } from "./faq-01";
import { Footer01 } from "./footer-01";
import { Header01 } from "./header-01";
import { Logos02 } from "./logos-02";
import { Pricing01 } from "./pricing-01";
import { Testimonials01 } from "./testimonials-01";

afterEach(() => cleanup());

const mockMatchMedia = (reduced: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: query.includes("prefers-reduced-motion: reduce") ? reduced : false,
      media: query,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
};

const fillContactForm = () => {
  fireEvent.input(screen.getByLabelText("Name"), { target: { value: "Ada Lovelace" } });
  fireEvent.input(screen.getByLabelText("Work email"), { target: { value: "ada@example.com" } });
  fireEvent.input(screen.getByLabelText("Message"), { target: { value: "We would like a demo." } });
};

describe("marketing block interactions", () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  it("validates contact-01 and reports pending, error, and success", async () => {
    let resolveSubmit: ((value?: unknown) => void) | undefined;
    const onSubmit = vi.fn(
      () =>
        new Promise<void>((resolve, reject) => {
          resolveSubmit = (value) => {
            if (value instanceof Error) reject(value);
            else resolve();
          };
        }),
    );
    render(<Contact01 onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(document.body.contains(await screen.findByText("Enter your name."))).toBe(true);
    expect(document.activeElement).toBe(screen.getByLabelText("Name"));

    fillContactForm();
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect((screen.getByRole("button", { name: "Sending…" }) as HTMLButtonElement).disabled).toBe(
      true,
    );

    resolveSubmit?.(new Error("network"));
    expect(document.body.contains(await screen.findByRole("alert"))).toBe(true);
    expect(screen.getByText("Something went wrong. Please try again.")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    resolveSubmit?.();
    expect(document.body.contains(await screen.findByRole("status"))).toBe(true);
    expect(screen.getByText(/Thanks Ada Lovelace/)).toBeTruthy();
  });

  it("shows an SSR-safe map placeholder for contact-us without a token", () => {
    render(<ContactUs locationLabel="Zurich, CH" />);
    expect(screen.getByRole("img", { name: "Map unavailable for Zurich, CH" })).toBeTruthy();
    expect(screen.queryByTestId("mapbox")).toBeNull();
  });

  it("opens header-01 mobile sheet, restores focus, and closes on Escape", async () => {
    render(<Header01 />);
    const trigger = screen.getByRole("button", { name: "Open menu" });
    trigger.focus();
    fireEvent.click(trigger);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeTruthy();
    expect(screen.getByText("Site menu")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Close menu" })).toBeTruthy();

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it("validates footer newsletter submit and announces status", async () => {
    const onSubscribe = vi.fn().mockResolvedValue(undefined);
    render(<Footer01 onSubscribe={onSubscribe} />);

    fireEvent.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(document.body.contains(await screen.findByRole("alert"))).toBe(true);

    fireEvent.input(screen.getByLabelText("Email address"), {
      target: { value: "team@acme.test" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Subscribe" }));
    await waitFor(() => expect(onSubscribe).toHaveBeenCalledWith("team@acme.test"));
    expect(document.body.contains(await screen.findByRole("status"))).toBe(true);
  });

  it("toggles pricing billing cycle and supports controlled yearly prices", async () => {
    const onCycleChange = vi.fn();
    const { rerender } = render(<Pricing01 cycle="monthly" onCycleChange={onCycleChange} />);
    expect(screen.getByText("$29")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /Yearly/ }));
    expect(onCycleChange).toHaveBeenCalledWith("yearly");

    rerender(<Pricing01 cycle="yearly" onCycleChange={onCycleChange} />);
    expect(screen.getByText("$24")).toBeTruthy();
  });

  it("announces the active testimonial and supports manual controls", async () => {
    render(<Testimonials01 />);
    expect(screen.getByText(/Showing testimonial 1 of 3 from Aisha Rahman/)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Next testimonial" }));
    expect(await screen.findByText(/Showing testimonial 2 of 3 from Marco Vidal/)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Show testimonial from Tomoko Saito" }));
    expect(screen.getByText(/Showing testimonial 3 of 3 from Tomoko Saito/)).toBeTruthy();
  });

  it("does not duplicate logo-02 wordmarks when reduced motion is preferred", async () => {
    mockMatchMedia(true);
    render(<Logos02 />);
    await waitFor(() => expect(screen.getAllByText("Northwind")).toHaveLength(1));
  });

  it("toggles faq accordion items", async () => {
    render(<Faq01 />);
    const first = screen.getByRole("button", { name: "How does the 14-day free trial work?" });
    const second = screen.getByRole("button", { name: "Can we migrate from our current tool?" });
    expect(first.getAttribute("aria-expanded")).toBe("true");

    fireEvent.click(second);
    await waitFor(() => expect(second.getAttribute("aria-expanded")).toBe("true"));
    expect(first.getAttribute("aria-expanded")).toBe("false");
  });
});
