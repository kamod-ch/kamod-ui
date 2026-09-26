import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { useState } from "preact/hooks";
import { describe, expect, it, vi } from "vitest";
import { atNoon } from "../date-range-picker/date-range-utils";
import { FilterBar } from "./FilterBar";
import { FilterBarChip } from "./FilterBarChip";
import { FilterBarChips } from "./FilterBarChips";
import { FilterBarControls } from "./FilterBarControls";
import { FilterBarSearch } from "./FilterBarSearch";
import {
  DEFAULT_DEMO_FILTERS,
  DEMO_TASKS,
  type DemoFilters,
  FilterBarDemo,
  filterDemoTasks,
} from "./filter-bar-demo";

describe("filterDemoTasks", () => {
  it("combines search, status, assignee, and date range filters", () => {
    const filtered = filterDemoTasks(DEMO_TASKS, {
      search: "dashboard",
      status: "open",
      assignee: "Ada",
      dateRange: {
        from: atNoon(new Date(2024, 5, 1)),
        to: atNoon(new Date(2024, 5, 10)),
      },
    });
    expect(filtered.map((task) => task.id)).toEqual(["t1"]);
  });
});

describe("FilterBarDemo", () => {
  it("filters the local task list through multiple controls", () => {
    render(<FilterBarDemo debounceMs={0} />);

    fireEvent.input(screen.getByLabelText("Search tasks"), { target: { value: "dashboard" } });
    expect(screen.getByTestId("filter-bar-demo-results").querySelectorAll("li")).toHaveLength(1);
    expect(screen.getByText("Wire dashboard filters")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Status"), { target: { value: "done" } });
    expect(screen.getByTestId("filter-bar-demo-empty")).toBeTruthy();
  });

  it("removes a single active chip without resetting other filters", () => {
    const Stateful = () => {
      const [filters, setFilters] = useState<DemoFilters>({
        search: "dashboard",
        status: "open",
        assignee: "all",
        dateRange: undefined,
      });
      return <FilterBarDemo filters={filters} onFiltersChange={setFilters} debounceMs={0} />;
    };

    render(<Stateful />);

    fireEvent.click(screen.getByRole("button", { name: "Remove search filter dashboard" }));
    expect(screen.queryByRole("button", { name: "Remove search filter dashboard" })).toBeNull();
    expect(screen.getByRole("button", { name: "Remove status filter open" })).toBeTruthy();
  });

  it("resets all filters and keeps focus on the reset control", () => {
    const onFiltersChange = vi.fn();
    const Stateful = () => {
      const [filters, setFilters] = useState<DemoFilters>({
        search: "KPI",
        status: "open",
        assignee: "Grace",
        dateRange: undefined,
      });
      return (
        <FilterBarDemo
          filters={filters}
          onFiltersChange={(next) => {
            setFilters(next);
            onFiltersChange(next);
          }}
          debounceMs={0}
        />
      );
    };

    render(<Stateful />);

    const reset = screen.getByRole("button", { name: "Reset filters" });
    fireEvent.click(reset);
    expect(onFiltersChange).toHaveBeenCalledWith(DEFAULT_DEMO_FILTERS);
    expect(reset).toHaveFocus();
  });

  it("supports controlled filter updates from the consumer", async () => {
    const Controlled = () => {
      const [filters, setFilters] = useState<DemoFilters>(DEFAULT_DEMO_FILTERS);
      return <FilterBarDemo filters={filters} onFiltersChange={setFilters} debounceMs={0} />;
    };

    render(<Controlled />);
    fireEvent.change(screen.getByLabelText("Assignee"), { target: { value: "Alan" } });
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Remove assignee filter Alan" })).toBeTruthy();
    });
    expect(screen.getByTestId("filter-bar-demo-results").querySelectorAll("li")).toHaveLength(1);
  });

  it("announces result count updates", () => {
    render(<FilterBarDemo debounceMs={0} />);
    const liveRegion = screen.getByText(`${DEMO_TASKS.length} results`);
    expect(liveRegion).toHaveAttribute("aria-live", "polite");
    fireEvent.input(screen.getByLabelText("Search tasks"), { target: { value: "zzzzz" } });
    expect(screen.getByText("0 results")).toBeTruthy();
  });
});

describe("FilterBarChip focus", () => {
  it("moves focus to the next chip remove button", async () => {
    render(
      <FilterBar>
        <FilterBarControls>
          <FilterBarSearch label="Search" value="" onValueChange={() => {}} />
        </FilterBarControls>
        <FilterBarChips>
          <FilterBarChip
            label="Status: open"
            removeLabel="Remove status open"
            onRemove={() => {}}
          />
          <FilterBarChip
            label="Assignee: Ada"
            removeLabel="Remove assignee Ada"
            onRemove={() => {}}
          />
        </FilterBarChips>
      </FilterBar>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Remove status open" }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Remove assignee Ada" })).toHaveFocus();
    });
  });

  it("returns focus to the first filter control when the last chip is removed", async () => {
    const Controlled = () => {
      const [show, setShow] = useState(true);
      return (
        <FilterBar>
          <FilterBarControls>
            <FilterBarSearch label="Search" value="" onValueChange={() => {}} />
          </FilterBarControls>
          <FilterBarChips>
            {show ? (
              <FilterBarChip
                label="Status: open"
                removeLabel="Remove status open"
                onRemove={() => setShow(false)}
              />
            ) : null}
          </FilterBarChips>
        </FilterBar>
      );
    };

    render(<Controlled />);
    fireEvent.click(screen.getByRole("button", { name: "Remove status open" }));
    await waitFor(() => {
      expect(screen.getByLabelText("Search")).toHaveFocus();
    });
  });
});

describe("FilterBarSearch", () => {
  it("forwards search changes immediately", () => {
    const onValueChange = vi.fn();
    render(<FilterBarSearch label="Search projects" value="" onValueChange={onValueChange} />);
    fireEvent.input(screen.getByLabelText("Search projects"), { target: { value: "alpha" } });
    expect(onValueChange).toHaveBeenCalledWith("alpha");
  });
});

describe("FilterBar primitives", () => {
  it("uses type button for chip remove controls", () => {
    render(
      <FilterBar>
        <FilterBarControls>
          <FilterBarSearch label="Search" value="" onValueChange={() => {}} />
        </FilterBarControls>
        <FilterBarChips>
          <FilterBarChip label="Status: open" removeLabel="Remove status" onRemove={() => {}} />
        </FilterBarChips>
      </FilterBar>,
    );

    expect(screen.getByRole("button", { name: "Remove status" })).toHaveAttribute("type", "button");
  });
});
