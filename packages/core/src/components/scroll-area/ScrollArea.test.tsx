import { render, screen } from "@testing-library/preact";
import { ScrollArea } from "./ScrollArea";
import { ScrollBar } from "./ScrollBar";

describe("ScrollArea", () => {
  it("renders root, viewport with hidden native scrollbars, and content wrapper", () => {
    render(
      <ScrollArea data-testid="scroll-area">
        <p>Content</p>
      </ScrollArea>
    );

    const root = screen.getByTestId("scroll-area");
    expect(root).toHaveAttribute("data-slot", "scroll-area");
    expect(root.className).toContain("overflow-hidden");

    const viewport = root.querySelector("[data-slot='scroll-area-viewport']");
    expect(viewport).not.toBeNull();
    expect(viewport?.className).toContain("[scrollbar-width:none]");

    expect(root.querySelector("[data-slot='scroll-area-content']")).not.toBeNull();
  });
});

describe("ScrollBar", () => {
  it("renders track and thumb slots", () => {
    render(
      <ScrollArea>
        <p>Content</p>
        <ScrollBar data-testid="scroll-bar" />
      </ScrollArea>
    );

    const bar = screen.getByTestId("scroll-bar");
    expect(bar).toHaveAttribute("data-slot", "scroll-bar");
    expect(bar.querySelector("[data-slot='scroll-bar-thumb']")).not.toBeNull();
  });
});
