import { fireEvent, render, screen } from "@testing-library/preact";
import { RadioGroup } from "./RadioGroup";
import { RadioGroupItem } from "./RadioGroupItem";

describe("RadioGroup", () => {
  it("selects options in uncontrolled mode", () => {
    render(
      <RadioGroup name="plan" defaultValue="a">
        <RadioGroupItem value="a">A</RadioGroupItem>
        <RadioGroupItem value="b">B</RadioGroupItem>
      </RadioGroup>
    );

    const a = screen.getByRole("radio", { name: "A" });
    const b = screen.getByRole("radio", { name: "B" });

    expect(a).toBeChecked();
    expect(b).not.toBeChecked();

    fireEvent.click(b);
    expect(b).toBeChecked();
    expect(a).not.toBeChecked();
  });

  it("calls onValueChange and respects controlled value", () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <RadioGroup name="ctl" value="x" onValueChange={onValueChange}>
        <RadioGroupItem value="x">X</RadioGroupItem>
        <RadioGroupItem value="y">Y</RadioGroupItem>
      </RadioGroup>
    );

    const y = screen.getByRole("radio", { name: "Y" });
    fireEvent.click(y);
    expect(onValueChange).toHaveBeenCalledWith("y");
    expect(y).not.toBeChecked();

    rerender(
      <RadioGroup name="ctl" value="y" onValueChange={onValueChange}>
        <RadioGroupItem value="x">X</RadioGroupItem>
        <RadioGroupItem value="y">Y</RadioGroupItem>
      </RadioGroup>
    );
    expect(y).toBeChecked();
  });

  it("exposes data-state on items", () => {
    render(
      <RadioGroup defaultValue="on">
        <RadioGroupItem value="on">On</RadioGroupItem>
        <RadioGroupItem value="off">Off</RadioGroupItem>
      </RadioGroup>
    );

    expect(screen.getByRole("radio", { name: "On" }).closest("[data-slot='radio-group-item']")).toHaveAttribute(
      "data-state",
      "checked"
    );
  });
});
