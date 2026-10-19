import { cleanup, render, screen } from "@testing-library/preact";
import { afterEach, expect, it } from "vitest";
import { Spinner } from "./Spinner";

afterEach(cleanup);

it("keeps status semantics, sizing and custom props on the stationary outer element", () => {
  render(<Spinner size="lg" tone="primary" strokeWidth={3} aria-label="Saving" class="custom" />);
  const status = screen.getByRole("status", { name: "Saving" });
  expect(status).toHaveClass("size-8", "text-primary", "custom");
  expect(status.querySelector("svg")).toHaveAttribute("stroke-width", "3");
});

it("rotates an HTML box while keeping SVG static and reduced motion supported", () => {
  const { container } = render(<Spinner />);
  const glyph = container.querySelector('[data-slot="spinner"] > span')!;
  expect(glyph).toHaveClass("motion-safe:animate-spin", "motion-reduce:animate-none");
  expect(glyph).toHaveAttribute("aria-hidden", "true");
  expect(glyph.querySelector("svg")).not.toHaveClass("motion-safe:animate-spin");
});
