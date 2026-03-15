import { fireEvent, render, screen } from "@testing-library/preact";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./index";

describe("Tooltip", () => {
  it("opens on trigger focus and closes on blur", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <button type="button">Trigger</button>
          </TooltipTrigger>
          <TooltipContent>Tooltip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByText("Trigger").closest("[data-slot='tooltip-trigger']") as HTMLElement;
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    fireEvent.focus(trigger);
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toHaveTextContent("Tooltip text");
    expect(trigger).toHaveAttribute("aria-describedby", tooltip.id);

    fireEvent.blur(trigger);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("opens and closes with configured delay", async () => {
    vi.useFakeTimers();

    render(
      <Tooltip delayDuration={100} closeDelayDuration={80}>
        <TooltipTrigger>
          <button type="button">Hover me</button>
        </TooltipTrigger>
        <TooltipContent>Delayed content</TooltipContent>
      </Tooltip>
    );

    const trigger = screen.getByText("Hover me").closest("[data-slot='tooltip-trigger']") as HTMLElement;
    fireEvent.mouseEnter(trigger);
    await vi.advanceTimersByTimeAsync(99);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    await vi.advanceTimersByTimeAsync(1);
    expect(screen.getByRole("tooltip")).toHaveTextContent("Delayed content");

    fireEvent.mouseLeave(trigger);
    await vi.advanceTimersByTimeAsync(79);
    expect(screen.queryByRole("tooltip")).toBeInTheDocument();

    await vi.advanceTimersByTimeAsync(1);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    vi.useRealTimers();
  });
});
