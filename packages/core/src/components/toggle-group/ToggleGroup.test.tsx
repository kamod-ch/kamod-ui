import { fireEvent, render, screen } from "@testing-library/preact";
import { ToggleGroup } from "./ToggleGroup";
import { ToggleGroupItem } from "./ToggleGroupItem";

describe("ToggleGroup", () => {
  it("supports single selection", () => {
    render(
      <ToggleGroup type="single" defaultValue="left">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
      </ToggleGroup>
    );

    const left = screen.getByRole("button", { name: "Left" });
    const center = screen.getByRole("button", { name: "Center" });

    expect(left).toHaveAttribute("aria-pressed", "true");
    expect(center).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(center);
    expect(left).toHaveAttribute("aria-pressed", "false");
    expect(center).toHaveAttribute("aria-pressed", "true");
  });

  it("supports multiple selection", () => {
    render(
      <ToggleGroup type="multiple" defaultValue={["bold"]}>
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>
    );

    const bold = screen.getByRole("button", { name: "Bold" });
    const italic = screen.getByRole("button", { name: "Italic" });

    expect(bold).toHaveAttribute("aria-pressed", "true");
    expect(italic).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(italic);
    expect(bold).toHaveAttribute("aria-pressed", "true");
    expect(italic).toHaveAttribute("aria-pressed", "true");
  });

  it("respects disabled group and propagates attributes", () => {
    render(
      <ToggleGroup type="single" disabled orientation="vertical" variant="outline" size="lg">
        <ToggleGroupItem value="one">One</ToggleGroupItem>
        <ToggleGroupItem value="two">Two</ToggleGroupItem>
      </ToggleGroup>
    );

    const group = screen.getByRole("group");
    const one = screen.getByRole("button", { name: "One" });

    expect(group).toHaveAttribute("data-orientation", "vertical");
    expect(group).toHaveAttribute("data-variant", "outline");
    expect(group).toHaveAttribute("data-size", "lg");
    expect(one).toBeDisabled();
  });
});
