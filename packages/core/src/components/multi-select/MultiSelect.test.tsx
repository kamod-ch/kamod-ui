import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { useMemo, useState } from "preact/hooks";
import { describe, expect, it, vi } from "vitest";
import { MultiSelect } from "./MultiSelect";
import type { MultiSelectOption, MultiSelectProps } from "./multi-select-types";

const TEAM_OPTIONS: MultiSelectOption[] = [
  { value: "maya", label: "Maya Chen" },
  { value: "tom", label: "Tomoko Sato" },
  { value: "leo", label: "Leo Müller" },
  { value: "sam", label: "Sam Rivera", disabled: true },
];

const ControlledMultiSelect = ({
  initial = [] as string[],
  options = TEAM_OPTIONS,
  onValueChange,
  ...rest
}: Omit<MultiSelectProps, "value" | "defaultValue" | "options"> & {
  initial?: string[];
  options?: MultiSelectOption[];
  onValueChange?: (values: string[]) => void;
}) => {
  const [value, setValue] = useState(initial);
  return (
    <MultiSelect
      options={options}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange?.(next);
      }}
      labels={{ searchPlaceholder: "Search team" }}
      {...rest}
    />
  );
};

const openAndSelect = async (label: string) => {
  const search = screen.getByPlaceholderText("Search team");
  fireEvent.focus(search);
  await waitFor(() => {
    expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
  });
  fireEvent.click(screen.getByRole("button", { name: label }));
};

describe("MultiSelect", () => {
  it("selects options and removes them via chip buttons", async () => {
    const onValueChange = vi.fn();
    render(<ControlledMultiSelect onValueChange={onValueChange} />);
    await openAndSelect("Maya Chen");
    expect(onValueChange).toHaveBeenLastCalledWith(["maya"]);
    fireEvent.click(screen.getByRole("button", { name: "Remove Maya Chen" }));
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });

  it("preserves selected ids when options reload and uses selectedLabels", async () => {
    const ExternalSearchHarness = () => {
      const [query, setQuery] = useState("");
      const [value, setValue] = useState<string[]>(["legacy"]);
      const filtered = useMemo(
        () =>
          TEAM_OPTIONS.filter((option) => option.label.toLowerCase().includes(query.toLowerCase())),
        [query],
      );
      return (
        <MultiSelect
          options={filtered}
          value={value}
          onValueChange={setValue}
          onSearchChange={setQuery}
          selectedLabels={{ legacy: "Legacy member" }}
          labels={{ searchPlaceholder: "Search team" }}
        />
      );
    };

    render(<ExternalSearchHarness />);
    expect(screen.getByText("Legacy member")).toBeInTheDocument();
    fireEvent.input(screen.getByPlaceholderText("Search team"), { target: { value: "zzz" } });
    expect(screen.getByText("Legacy member")).toBeInTheDocument();
  });

  it("notifies consumers when search changes for external filtering", async () => {
    const onSearchChange = vi.fn();
    render(<ControlledMultiSelect onSearchChange={onSearchChange} />);
    fireEvent.input(screen.getByPlaceholderText("Search team"), { target: { value: "may" } });
    expect(onSearchChange).toHaveBeenLastCalledWith("may");
  });

  it("supports keyboard highlight and Enter selection", async () => {
    const onValueChange = vi.fn();
    render(<ControlledMultiSelect onValueChange={onValueChange} />);
    const search = screen.getByPlaceholderText("Search team");
    fireEvent.focus(search);
    fireEvent.keyDown(search, { key: "ArrowDown" });
    fireEvent.keyDown(search, { key: "Enter" });
    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalled();
    });
  });

  it("collapses many selections and expands without losing remove actions", async () => {
    render(<ControlledMultiSelect maxVisible={2} />);
    await openAndSelect("Maya Chen");
    await openAndSelect("Tomoko Sato");
    await openAndSelect("Leo Müller");
    expect(screen.getByRole("button", { name: "+1 more" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "+1 more" }));
    expect(screen.getByRole("button", { name: "Remove Leo Müller" })).toBeInTheDocument();
  });

  it("renders disabled options as non-interactive", async () => {
    render(<ControlledMultiSelect />);
    fireEvent.focus(screen.getByPlaceholderText("Search team"));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Sam Rivera" })).toBeDisabled();
    });
  });
});
