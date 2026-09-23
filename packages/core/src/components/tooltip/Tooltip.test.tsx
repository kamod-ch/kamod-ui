import { act, cleanup, fireEvent, render, screen } from "@testing-library/preact";
import { useState } from "preact/hooks";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./index";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const DelayedTooltip = ({ controlled }: { controlled: boolean }) => {
  const [open, setOpen] = useState(false);
  return (
    <Tooltip
      delayDuration={100}
      closeDelayDuration={80}
      {...(controlled ? { open, onOpenChange: setOpen } : {})}
    >
      <TooltipTrigger asChild>
        <button type="button">Required field</button>
      </TooltipTrigger>
      <TooltipContent>This field is required</TooltipContent>
    </Tooltip>
  );
};

const advance = (duration: number) =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(duration);
  });

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
      </TooltipProvider>,
    );

    const trigger = screen
      .getByText("Trigger")
      .closest("[data-slot='tooltip-trigger']") as HTMLElement;
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
      </Tooltip>,
    );

    const trigger = screen
      .getByText("Hover me")
      .closest("[data-slot='tooltip-trigger']") as HTMLElement;
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

  describe.each([false, true])("interrupted hover (controlled: %s)", (controlled) => {
    it.each(["mouse", "pointer"] as const)(
      "does not open after a quick %s pass over the trigger",
      async (input) => {
        vi.useFakeTimers();
        render(<DelayedTooltip controlled={controlled} />);
        const trigger = screen.getByRole("button", { name: "Required field" });

        fireEvent[`${input}Enter`](trigger);
        await advance(20);
        fireEvent[`${input}Leave`](trigger);
        await advance(200);

        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
        expect(trigger).not.toHaveAttribute("aria-describedby");
      },
    );

    it.each(["mouse", "pointer"] as const)(
      "cancels closing when the %s re-enters before the close delay",
      async (input) => {
        vi.useFakeTimers();
        render(<DelayedTooltip controlled={controlled} />);
        const trigger = screen.getByRole("button", { name: "Required field" });

        fireEvent[`${input}Enter`](trigger);
        await advance(100);
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
        fireEvent[`${input}Leave`](trigger);
        await advance(20);
        fireEvent[`${input}Enter`](trigger);
        await advance(200);
        expect(screen.getByRole("tooltip")).toBeInTheDocument();

        fireEvent[`${input}Leave`](trigger);
        await advance(80);
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      },
    );
  });

  it("does not restart the opening delay when pointer and mouse events both fire", async () => {
    vi.useFakeTimers();
    render(<DelayedTooltip controlled={false} />);
    const trigger = screen.getByRole("button", { name: "Required field" });
    fireEvent.pointerEnter(trigger);
    await advance(50);
    fireEvent.mouseEnter(trigger);
    await advance(50);
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("cancels pending state callbacks on unmount", async () => {
    vi.useFakeTimers();
    const onOpenChange = vi.fn();
    const { unmount } = render(
      <Tooltip delayDuration={100} onOpenChange={onOpenChange}>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent>Delayed content</TooltipContent>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByText("Hover me"));
    unmount();
    await advance(200);
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});
