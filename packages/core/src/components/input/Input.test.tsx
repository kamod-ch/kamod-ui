import { render, screen } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { Input } from "./Input";

describe("Input cn migration", () => {
  it("renders default classes without a consumer class", () => {
    render(<Input aria-label="Email" />);
    const el = screen.getByLabelText("Email");
    expect(el).toHaveAttribute("data-slot", "input");
    expect(el.className).toContain("h-8");
    expect(el.className).toContain("rounded-md");
  });

  it("merges additional consumer classes", () => {
    render(<Input aria-label="Email" class="custom-utility" />);
    const el = screen.getByLabelText("Email");
    expect(el.className).toContain("custom-utility");
    expect(el.className).toContain("border-input");
  });

  it("lets consumer classes override conflicting defaults", () => {
    render(<Input aria-label="Email" class="h-12" />);
    const el = screen.getByLabelText("Email");
    expect(el.className).toContain("h-12");
    expect(el.className).not.toMatch(/\bh-8\b/);
  });

  it("applies conditional size variant classes", () => {
    render(<Input aria-label="Search" size="lg" />);
    const el = screen.getByLabelText("Search");
    expect(el.className).toContain("h-9");
    expect(el.className).toContain("text-base");
  });

  it("accepts an empty consumer class", () => {
    render(<Input aria-label="Notes" class="" />);
    const el = screen.getByLabelText("Notes");
    expect(el.className).toContain("h-8");
  });
});
