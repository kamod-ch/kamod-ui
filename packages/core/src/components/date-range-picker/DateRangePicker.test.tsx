import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { useState } from "preact/hooks";
import { describe, expect, it, vi } from "vitest";
import { DateRangePicker } from "./DateRangePicker";
import { createDateRangePresets } from "./date-range-presets";
import type { DateRange } from "./date-range-utils";
import { atNoon } from "./date-range-utils";

const labels = { apply: "Apply", cancel: "Cancel" };
const stableFormat = (range: DateRange | undefined) =>
  range?.from && range?.to
    ? `${range.from.getFullYear()}-${range.from.getMonth()}-${range.from.getDate()}/${range.to.getDate()}`
    : "";
const validationMessages = {
  incomplete: "Select a start and end date.",
  disabledInRange: "Range includes unavailable days.",
};

const ref = atNoon(new Date(2024, 5, 15));

const presets = createDateRangePresets({
  today: "Today",
  last7Days: "Last 7 days",
  last30Days: "Last 30 days",
  monthToDate: "Month to date",
  previousMonth: "Previous month",
});

const clickEnabledDay = (day: number) => {
  const buttons = Array.from(document.querySelectorAll('[data-slot="calendar-day"]')).filter(
    (el) => !el.hasAttribute("disabled") && el.textContent?.trim() === String(day),
  );
  expect(buttons.length).toBeGreaterThan(0);
  fireEvent.click(buttons[0]!);
};

const openPicker = () => {
  const trigger = document.querySelector('[data-slot="date-range-picker"] button');
  expect(trigger).toBeTruthy();
  fireEvent.click(trigger!);
};

describe("DateRangePicker", () => {
  it("applies a complete range and closes the popover", async () => {
    const onValueChange = vi.fn();
    render(
      <DateRangePicker
        placeholder="Pick range"
        labels={labels}
        validationMessages={validationMessages}
        referenceDate={ref}
        presets={presets}
        responsiveMonths={false}
        numberOfMonths={1}
        defaultValue={{ from: ref, to: ref }}
        format={stableFormat}
        onValueChange={onValueChange}
      />,
    );

    openPicker();
    clickEnabledDay(10);
    clickEnabledDay(20);
    fireEvent.click(screen.getByRole("button", { name: "Apply" }));

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: "Apply" })).not.toBeInTheDocument();
    });
    expect(onValueChange).toHaveBeenCalledTimes(1);
    const payload = onValueChange.mock.calls[0]?.[0] as DateRange;
    expect(payload.from?.getDate()).toBe(10);
    expect(payload.to?.getDate()).toBe(20);
  });

  it("keeps apply disabled for incomplete drafts", () => {
    render(
      <DateRangePicker
        placeholder="Pick range"
        labels={labels}
        validationMessages={validationMessages}
        referenceDate={ref}
        responsiveMonths={false}
        defaultValue={{ from: ref, to: ref }}
        format={stableFormat}
      />,
    );

    openPicker();
    clickEnabledDay(12);
    const apply = screen.getByRole("button", { name: "Apply" });
    expect(apply).toBeDisabled();
    expect(screen.getByText("Select a start and end date.")).toBeTruthy();
  });

  it("allows same-day ranges", () => {
    const onValueChange = vi.fn();
    render(
      <DateRangePicker
        placeholder="Pick range"
        labels={labels}
        validationMessages={validationMessages}
        referenceDate={ref}
        responsiveMonths={false}
        defaultValue={{ from: ref, to: ref }}
        format={stableFormat}
        onValueChange={onValueChange}
      />,
    );

    openPicker();
    clickEnabledDay(8);
    clickEnabledDay(8);
    fireEvent.click(screen.getByRole("button", { name: "Apply" }));
    const payload = onValueChange.mock.calls[0]?.[0] as DateRange;
    expect(payload.from?.getDate()).toBe(8);
    expect(payload.to?.getDate()).toBe(8);
  });

  it("discards draft changes on cancel", () => {
    const onValueChange = vi.fn();
    render(
      <DateRangePicker
        placeholder="Pick range"
        labels={labels}
        validationMessages={validationMessages}
        referenceDate={ref}
        responsiveMonths={false}
        defaultValue={{
          from: atNoon(new Date(2024, 5, 5)),
          to: atNoon(new Date(2024, 5, 7)),
        }}
        format={stableFormat}
        onValueChange={onValueChange}
      />,
    );

    openPicker();
    clickEnabledDay(20);
    clickEnabledDay(25);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "2024-5-5/7" })).toBeTruthy();
  });

  it("syncs controlled value into an open draft", async () => {
    const Controlled = () => {
      const [range, setRange] = useState<DateRange | undefined>({
        from: atNoon(new Date(2024, 5, 1)),
        to: atNoon(new Date(2024, 5, 3)),
      });
      return (
        <>
          <button type="button" onClick={() => setRange({ from: ref, to: ref })}>
            External update
          </button>
          <DateRangePicker
            value={range}
            placeholder="Pick range"
            labels={labels}
            validationMessages={validationMessages}
            referenceDate={ref}
            responsiveMonths={false}
            format={stableFormat}
          />
        </>
      );
    };

    render(<Controlled />);
    openPicker();
    clickEnabledDay(20);
    clickEnabledDay(25);
    fireEvent.click(screen.getByRole("button", { name: "External update" }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Apply" })).not.toBeDisabled();
    });
    fireEvent.click(screen.getByRole("button", { name: "Apply" }));
    expect(screen.getByRole("button", { name: "2024-5-15/15" })).toBeTruthy();
  });

  it("blocks apply when the range includes disabled days", () => {
    render(
      <DateRangePicker
        placeholder="Pick range"
        labels={labels}
        validationMessages={validationMessages}
        referenceDate={ref}
        responsiveMonths={false}
        defaultValue={{ from: ref, to: ref }}
        disabledDates={[atNoon(new Date(2024, 5, 12))]}
        format={stableFormat}
      />,
    );

    openPicker();
    clickEnabledDay(10);
    clickEnabledDay(14);
    expect(screen.getByRole("button", { name: "Apply" })).toBeDisabled();
    expect(screen.getByText("Range includes unavailable days.")).toBeTruthy();
  });

  it("applies preset ranges to the draft", () => {
    const onValueChange = vi.fn();
    render(
      <DateRangePicker
        placeholder="Pick range"
        labels={labels}
        validationMessages={validationMessages}
        referenceDate={ref}
        presets={presets}
        responsiveMonths={false}
        defaultValue={{ from: ref, to: ref }}
        format={stableFormat}
        onValueChange={onValueChange}
      />,
    );

    openPicker();
    fireEvent.click(screen.getByRole("button", { name: "Last 7 days" }));
    fireEvent.click(screen.getByRole("button", { name: "Apply" }));
    const payload = onValueChange.mock.calls[0]?.[0] as DateRange;
    expect(payload.from?.getDate()).toBe(9);
    expect(payload.to?.getDate()).toBe(15);
  });

  it("navigates the calendar to the preset range", () => {
    const distantDate = atNoon(new Date(2026, 8, 15));
    render(
      <DateRangePicker
        placeholder="Pick range"
        labels={labels}
        validationMessages={validationMessages}
        referenceDate={ref}
        presets={presets}
        responsiveMonths={false}
        numberOfMonths={1}
        locale="en-US"
        defaultValue={{ from: distantDate, to: distantDate }}
        format={stableFormat}
      />,
    );

    openPicker();
    expect(screen.getByText("September 2026")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Last 7 days" }));
    expect(screen.getByText("June 2024")).toBeTruthy();
  });

  it("highlights the active preset button", () => {
    render(
      <DateRangePicker
        placeholder="Pick range"
        labels={labels}
        validationMessages={validationMessages}
        referenceDate={ref}
        presets={presets}
        responsiveMonths={false}
        format={stableFormat}
      />,
    );

    openPicker();
    const last7 = screen.getByRole("button", { name: "Last 7 days" });
    fireEvent.click(last7);
    expect(last7.getAttribute("aria-pressed")).toBe("true");
    expect(last7.getAttribute("data-selected")).toBe("true");
  });
});
