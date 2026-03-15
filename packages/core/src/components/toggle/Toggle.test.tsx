import { fireEvent, render, screen } from "@testing-library/preact";
import { Toggle } from "./Toggle";

describe("Toggle", () => {
  it("toggles state in uncontrolled mode", () => {
    render(<Toggle aria-label="Toggle bold" />);
    const button = screen.getByRole("button", { name: "Toggle bold" });

    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).toHaveAttribute("data-state", "off");

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveAttribute("data-state", "on");

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).toHaveAttribute("data-state", "off");
  });

  it("respects controlled mode and calls onPressedChange", () => {
    const onPressedChange = vi.fn();
    const { rerender } = render(
      <Toggle aria-label="Toggle italic" pressed={false} onPressedChange={onPressedChange} />
    );
    const button = screen.getByRole("button", { name: "Toggle italic" });

    fireEvent.click(button);
    expect(onPressedChange).toHaveBeenCalledWith(true);
    expect(button).toHaveAttribute("aria-pressed", "false");

    rerender(<Toggle aria-label="Toggle italic" pressed onPressedChange={onPressedChange} />);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveAttribute("data-state", "on");
  });

  it("exposes variant and size data attributes", () => {
    render(
      <Toggle aria-label="Toggle underline" variant="outline" size="lg">
        Underline
      </Toggle>
    );
    const button = screen.getByRole("button", { name: "Toggle underline" });

    expect(button).toHaveAttribute("data-variant", "outline");
    expect(button).toHaveAttribute("data-size", "lg");
  });
});
