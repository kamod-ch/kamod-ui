import { render, screen } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";

describe("Card cn migration", () => {
  it("renders default classes without a consumer class", () => {
    render(<Card>Content</Card>);
    const el = screen.getByText("Content").closest("[data-slot='card']");
    expect(el).not.toBeNull();
    expect(el).toHaveAttribute("data-size", "default");
    expect((el as HTMLElement).className).toContain("gap-6");
    expect((el as HTMLElement).className).toContain("rounded-xl");
  });

  it("merges additional consumer classes", () => {
    render(<Card class="custom-utility">Content</Card>);
    const el = screen.getByText("Content").closest("[data-slot='card']");
    expect((el as HTMLElement).className).toContain("custom-utility");
    expect((el as HTMLElement).className).toContain("bg-card");
  });

  it("lets consumer classes override conflicting defaults", () => {
    render(<Card class="gap-2">Content</Card>);
    const el = screen.getByText("Content").closest("[data-slot='card']");
    expect((el as HTMLElement).className).toContain("gap-2");
    expect((el as HTMLElement).className).not.toMatch(/\bgap-6\b/);
  });

  it("applies conditional size variant classes", () => {
    render(<Card size="sm">Content</Card>);
    const el = screen.getByText("Content").closest("[data-slot='card']");
    expect(el).toHaveAttribute("data-size", "sm");
    expect((el as HTMLElement).className).toContain("gap-4");
    expect((el as HTMLElement).className).toContain("py-4");
  });

  it("accepts an empty consumer class", () => {
    render(<Card class="">Content</Card>);
    const el = screen.getByText("Content").closest("[data-slot='card']");
    expect((el as HTMLElement).className).toContain("bg-card");
  });
});
