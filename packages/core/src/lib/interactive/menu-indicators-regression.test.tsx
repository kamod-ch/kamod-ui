import { cleanup, fireEvent, render } from "@testing-library/preact";
import { afterEach, expect, it, vi } from "vitest";
import { ContextMenuCheckboxItem } from "../../components/context-menu/ContextMenuCheckboxItem";
import { DropdownCheckboxItem } from "../../components/dropdown/DropdownCheckboxItem";
import { MenubarCheckboxItem } from "../../components/menubar/MenubarCheckboxItem";
import { MenubarRadioGroup } from "../../components/menubar/MenubarRadioGroup";
import { MenubarRadioItem } from "../../components/menubar/MenubarRadioItem";

afterEach(cleanup);

const checkboxes = [
  ["dropdown", DropdownCheckboxItem],
  ["context menu", ContextMenuCheckboxItem],
  ["menubar", MenubarCheckboxItem],
] as const;

it.each(checkboxes)("retains the %s checkmark and focus across repeated toggles", (_, Checkbox) => {
  const onCheckedChange = vi.fn();
  const view = render(<Checkbox onCheckedChange={onCheckedChange}>Show details</Checkbox>);
  const button = view.getByRole("menuitemcheckbox", { name: "Show details" });
  const icon = button.querySelector("svg")!;
  expect(icon).not.toBeVisible();
  button.focus();

  for (const checked of [true, false, true, false]) {
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-checked", String(checked));
    expect(onCheckedChange).toHaveBeenLastCalledWith(checked);
    expect(button.querySelector("svg")).toBe(icon);
    expect(document.activeElement).toBe(button);
    if (checked) expect(icon).toBeVisible();
    else expect(icon).not.toBeVisible();
  }
});

it.each(checkboxes)(
  "keeps %s checkmarks controlled and honors cancelled activation",
  (_, Checkbox) => {
    const onCheckedChange = vi.fn();
    const view = render(
      <Checkbox checked={false} onCheckedChange={onCheckedChange}>
        Show details
      </Checkbox>,
    );
    const button = view.getByRole("menuitemcheckbox", { name: "Show details" });
    const icon = button.querySelector("svg")!;
    fireEvent.click(button);
    expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(true);
    expect(button).toHaveAttribute("aria-checked", "false");
    expect(icon).not.toBeVisible();

    view.rerender(
      <Checkbox
        checked
        onCheckedChange={onCheckedChange}
        onClick={(event) => event.preventDefault()}
      >
        Show details
      </Checkbox>,
    );
    expect(button.querySelector("svg")).toBe(icon);
    expect(icon).toBeVisible();
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-checked", "true");
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
  },
);

it("retains both menubar radio glyphs while selection moves between items", () => {
  const onValueChange = vi.fn();
  const view = render(
    <MenubarRadioGroup defaultValue="source" onValueChange={onValueChange}>
      <MenubarRadioItem value="source">Source</MenubarRadioItem>
      <MenubarRadioItem value="preview">Preview</MenubarRadioItem>
    </MenubarRadioGroup>,
  );
  const items = view.getAllByRole("menuitemradio");
  const icons = items.map((item) => item.querySelector("svg")!);
  for (const selected of [1, 0, 1]) {
    items[selected].focus();
    fireEvent.click(items[selected]);
    expect(onValueChange).toHaveBeenLastCalledWith(selected ? "preview" : "source");
    items.forEach((item, index) => {
      expect(item).toHaveAttribute("aria-checked", String(index === selected));
      expect(item.querySelector("svg")).toBe(icons[index]);
      if (index === selected) expect(icons[index]).toBeVisible();
      else expect(icons[index]).not.toBeVisible();
    });
    expect(document.activeElement).toBe(items[selected]);
  }
});
