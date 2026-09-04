import { render, screen } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button cn migration", () => {
  it("renders default classes without a consumer class", () => {
    render(<Button>Save</Button>);
    const el = screen.getByRole("button", { name: "Save" });
    expect(el).toHaveAttribute("data-slot", "button");
    expect(el.className).toContain("h-8");
    expect(el.className).toContain("bg-primary");
  });

  it("merges additional consumer classes", () => {
    render(<Button class="custom-utility">Save</Button>);
    const el = screen.getByRole("button", { name: "Save" });
    expect(el.className).toContain("custom-utility");
    expect(el.className).toContain("bg-primary");
  });

  it("lets consumer classes override conflicting defaults", () => {
    render(<Button class="h-12">Save</Button>);
    const el = screen.getByRole("button", { name: "Save" });
    expect(el.className).toContain("h-12");
    expect(el.className).not.toMatch(/\bh-8\b/);
  });

  it("applies conditional variant classes", () => {
    render(
      <Button variant="destructive" size="lg">
        Delete
      </Button>,
    );
    const el = screen.getByRole("button", { name: "Delete" });
    expect(el.className).toContain("bg-destructive");
    expect(el.className).toContain("h-9");
    expect(el).toHaveAttribute("data-variant", "destructive");
    expect(el).toHaveAttribute("data-size", "lg");
  });

  it("merges consumer class last for asChild", () => {
    render(
      <Button asChild class="h-12">
        <a href="/docs">Docs</a>
      </Button>,
    );
    const el = screen.getByRole("link", { name: "Docs" });
    expect(el.className).toContain("h-12");
    expect(el.className).not.toMatch(/\bh-8\b/);
    expect(el).toHaveAttribute("data-slot", "button");
  });
});
