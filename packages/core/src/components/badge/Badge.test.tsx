import { render, screen } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge cn migration", () => {
  it("renders default classes without a consumer class", () => {
    render(<Badge>Beta</Badge>);
    const el = screen.getByText("Beta");
    expect(el).toHaveAttribute("data-slot", "badge");
    expect(el.className).toContain("bg-foreground");
    expect(el.className).toContain("text-sm");
  });

  it("merges additional consumer classes", () => {
    render(<Badge class="custom-utility">Beta</Badge>);
    const el = screen.getByText("Beta");
    expect(el.className).toContain("custom-utility");
    expect(el.className).toContain("rounded-full");
  });

  it("lets consumer classes override conflicting defaults", () => {
    render(<Badge class="text-xs">Beta</Badge>);
    const el = screen.getByText("Beta");
    expect(el.className).toContain("text-xs");
    expect(el.className).not.toMatch(/\btext-sm\b/);
  });

  it("applies conditional variant classes", () => {
    render(
      <Badge variant="success" size="lg">
        Live
      </Badge>,
    );
    const el = screen.getByText("Live");
    expect(el.className).toContain("bg-success");
    expect(el.className).toContain("text-base");
    expect(el).toHaveAttribute("data-variant", "success");
  });

  it("merges consumer class last for asChild", () => {
    render(
      <Badge asChild class="text-xs">
        <a href="/status">Status</a>
      </Badge>,
    );
    const el = screen.getByRole("link", { name: "Status" });
    expect(el.className).toContain("text-xs");
    expect(el.className).not.toMatch(/\btext-sm\b/);
    expect(el).toHaveAttribute("data-slot", "badge");
  });
});
