import { render, screen } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { Label } from "./Label";

describe("Label", () => {
  it("associates with a control via htmlFor", () => {
    render(
      <div>
        <Label htmlFor="x">Email</Label>
        <input id="x" />
      </div>
    );
    expect(screen.getByText("Email")).toHaveAttribute("for", "x");
  });

  it("applies data-slot and size class", () => {
    render(<Label size="lg">Caption</Label>);
    const el = screen.getByText("Caption");
    expect(el).toHaveAttribute("data-slot", "label");
    expect(el.className).toContain("text-lg");
  });
});
