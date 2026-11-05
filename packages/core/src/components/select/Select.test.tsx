import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./index";

const renderSelect = (props?: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}) =>
  render(
    <Select
      value={props?.value}
      defaultValue={props?.defaultValue}
      onValueChange={props?.onValueChange}
    >
      <SelectTrigger aria-label="Framework">
        <SelectValue placeholder="Pick a framework" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="preact">Preact</SelectItem>
        <SelectItem value="solid">Solid</SelectItem>
        <SelectItem value="vue" disabled>
          Vue
        </SelectItem>
      </SelectContent>
    </Select>,
  );

describe("Select", () => {
  it("opens from the trigger and selects an enabled item", () => {
    const onValueChange = vi.fn();
    renderSelect({ onValueChange });

    const trigger = screen.getByRole("button", { name: "Framework" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Pick a framework")).toBeInTheDocument();

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("listbox")).toHaveAttribute("data-state", "open");

    fireEvent.click(screen.getByRole("option", { name: "Solid" }));

    expect(onValueChange).toHaveBeenCalledWith("solid");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.getByText("solid")).toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("does not select disabled items", () => {
    const onValueChange = vi.fn();
    renderSelect({ onValueChange });

    fireEvent.click(screen.getByRole("button", { name: "Framework" }));
    fireEvent.click(screen.getByRole("option", { name: "Vue" }));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByText("Pick a framework")).toBeInTheDocument();
  });

  it("respects controlled value updates", () => {
    const onValueChange = vi.fn();
    const { rerender } = renderSelect({ value: "preact", onValueChange });

    expect(screen.getByText("preact")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Framework" }));
    fireEvent.click(screen.getByRole("option", { name: "Solid" }));

    expect(onValueChange).toHaveBeenCalledWith("solid");
    expect(screen.getByText("preact")).toBeInTheDocument();

    rerender(
      <Select value="solid" onValueChange={onValueChange}>
        <SelectTrigger aria-label="Framework">
          <SelectValue placeholder="Pick a framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="preact">Preact</SelectItem>
          <SelectItem value="solid">Solid</SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByText("solid")).toBeInTheDocument();
  });

  it("supports keyboard open, selection and escape close", async () => {
    const onValueChange = vi.fn();
    renderSelect({ defaultValue: "preact", onValueChange });

    const trigger = screen.getByRole("button", { name: "Framework" });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });

    const listbox = screen.getByRole("listbox");
    await waitFor(() => expect(listbox).toHaveAttribute("aria-activedescendant"));

    fireEvent.keyDown(listbox, { key: "ArrowDown" });
    fireEvent.keyDown(listbox, { key: "Enter" });

    expect(onValueChange).toHaveBeenCalledWith("solid");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    fireEvent.click(trigger);
    fireEvent.keyDown(screen.getByRole("listbox"), { key: "Escape" });

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("typeahead skips disabled options and focuses the next prefix match", async () => {
    render(
      <Select defaultValue="preact">
        <SelectTrigger aria-label="Framework">
          <SelectValue placeholder="Pick a framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="preact">Preact</SelectItem>
          <SelectItem value="svelte" disabled>
            Svelte
          </SelectItem>
          <SelectItem value="solid">Solid</SelectItem>
        </SelectContent>
      </Select>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Framework" }));
    const listbox = screen.getByRole("listbox");

    fireEvent.keyDown(listbox, { key: "s" });

    await waitFor(() =>
      expect(listbox).toHaveAttribute(
        "aria-activedescendant",
        screen.getByRole("option", { name: "Solid" }).id,
      ),
    );
    expect(screen.getByRole("option", { name: "Solid" })).toHaveFocus();
  });

  it("portals the listbox to document.body and returns focus on Escape", async () => {
    render(
      <Select>
        <SelectTrigger aria-label="Framework">
          <SelectValue placeholder="Pick a framework" />
        </SelectTrigger>
        <SelectContent portal>
          <SelectItem value="preact">Preact</SelectItem>
          <SelectItem value="solid">Solid</SelectItem>
        </SelectContent>
      </Select>,
    );

    const trigger = screen.getByRole("button", { name: "Framework" });
    fireEvent.click(trigger);
    const listbox = screen.getByRole("listbox");
    expect(listbox.parentElement).toBe(document.body);

    fireEvent.keyDown(listbox, { key: "Escape" });
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
