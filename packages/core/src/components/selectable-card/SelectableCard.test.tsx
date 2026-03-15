import { fireEvent, render, screen } from "@testing-library/preact";
import { RadioGroup } from "../radio-group/RadioGroup";
import { SelectableCard } from "./SelectableCard";

describe("SelectableCard", () => {
  it("toggles selection inside RadioGroup and shows selected indicator only when checked", () => {
    render(
      <RadioGroup defaultValue="a">
        <SelectableCard value="a">
          <span>Alpha</span>
        </SelectableCard>
        <SelectableCard value="b">
          <span>Bravo</span>
        </SelectableCard>
      </RadioGroup>
    );

    const a = screen.getByRole("radio", { name: "Alpha" });
    const b = screen.getByRole("radio", { name: "Bravo" });

    const cardA = a.closest("[data-slot='selectable-card']");
    const cardB = b.closest("[data-slot='selectable-card']");

    expect(cardA).toHaveAttribute("data-state", "checked");
    expect(cardB).toHaveAttribute("data-state", "unchecked");
    expect(cardA?.querySelector("[data-slot='selectable-card-indicator']")).toBeTruthy();
    expect(cardB?.querySelector("[data-slot='selectable-card-indicator']")).toBeNull();

    fireEvent.click(b);
    expect(b).toBeChecked();
    expect(cardB).toHaveAttribute("data-state", "checked");
    expect(cardB?.querySelector("[data-slot='selectable-card-indicator']")).toBeTruthy();
    expect(cardA?.querySelector("[data-slot='selectable-card-indicator']")).toBeNull();
  });
});
