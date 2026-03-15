import { render, screen } from "@testing-library/preact";
import { ScrollArea } from "./ScrollArea";
import { ScrollBar } from "./ScrollBar";

describe("ScrollArea", () => {
  it("renders a scrollable root with hidden native scrollbars", () => {
    render(
      <ScrollArea data-testid="scroll-area">
        <p>Content</p>
      </ScrollArea>
    );

    const root = screen.getByTestId("scroll-area");
    expect(root).toHaveAttribute("data-slot", "scroll-area");
    expect(root.className).toContain("[scrollbar-width:none]");
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
