import { fireEvent, render, screen } from "@testing-library/preact";
import { LocaleSegmentGroup } from "./LocaleSegmentGroup";

describe("LocaleSegmentGroup", () => {
  it("calls onValueChange when selecting a different locale", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <LocaleSegmentGroup value="de" onValueChange={onValueChange} aria-label="Test language" />
    );

    fireEvent.click(screen.getByRole("button", { name: "EN" }));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("en");

    rerender(
      <LocaleSegmentGroup value="en" onValueChange={onValueChange} aria-label="Test language" />
    );
    fireEvent.click(screen.getByRole("button", { name: "DE" }));
    expect(onValueChange).toHaveBeenCalledTimes(2);
    expect(onValueChange).toHaveBeenLastCalledWith("de");
  });

  it("does not call onValueChange when clicking the active locale", () => {
    const onValueChange = vi.fn();
    render(<LocaleSegmentGroup value="en" onValueChange={onValueChange} />);

    fireEvent.click(screen.getByRole("button", { name: "EN" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("marks the active option with aria-pressed", () => {
    render(<LocaleSegmentGroup value="de" onValueChange={() => {}} />);

    expect(screen.getByRole("button", { name: "DE" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "EN" })).toHaveAttribute("aria-pressed", "false");
  });
});
