import { act, cleanup, fireEvent, render, screen } from "@testing-library/preact";
import { afterEach, vi } from "vitest";
import { ScrollArea } from "./ScrollArea";
import { ScrollBar } from "./ScrollBar";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("ScrollArea", () => {
  it("renders root, viewport with hidden native scrollbars, and content wrapper", () => {
    render(
      <ScrollArea data-testid="scroll-area">
        <p>Content</p>
      </ScrollArea>,
    );

    const root = screen.getByTestId("scroll-area");
    expect(root).toHaveAttribute("data-slot", "scroll-area");
    expect(root.className).toContain("overflow-hidden");

    const viewport = root.querySelector("[data-slot='scroll-area-viewport']");
    expect(viewport).not.toBeNull();
    expect(viewport?.className).toContain("[scrollbar-width:none]");

    expect(root.querySelector("[data-slot='scroll-area-content']")).not.toBeNull();
  });
});

describe("ScrollBar", () => {
  it.each([false, true])("skips unchanged thumb renders with overflow=%s", (overflow) => {
    vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(100);
    vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(overflow ? 500 : 100);
    let resize: ResizeObserverCallback | undefined;
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(private callback: ResizeObserverCallback) {}
        observe(node: HTMLElement) {
          if (node.dataset.slot === "scroll-bar") resize = this.callback;
        }
        disconnect() {}
      },
    );
    let renders = 0;
    function CountedBar() {
      renders++;
      return ScrollBar({});
    }
    render(
      <ScrollArea>
        <p>Content</p>
        <CountedBar />
      </ScrollArea>,
    );
    renders = 0;
    for (let index = 0; index < 10; index++) act(() => resize!([], {} as ResizeObserver));
    expect(renders).toBe(0);
  });

  it("renders track and thumb slots", () => {
    render(
      <ScrollArea>
        <p>Content</p>
        <ScrollBar data-testid="scroll-bar" />
      </ScrollArea>,
    );

    const bar = screen.getByTestId("scroll-bar");
    expect(bar).toHaveAttribute("data-slot", "scroll-bar");
    expect(bar.querySelector("[data-slot='scroll-bar-thumb']")).not.toBeNull();
  });

  const startDrag = () => {
    vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(100);
    vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(500);
    const view = render(
      <ScrollArea>
        <p>Content</p>
        <ScrollBar />
      </ScrollArea>,
    );
    const thumb = view.container.querySelector<HTMLElement>("[data-slot=scroll-bar-thumb]")!;
    thumb.setPointerCapture = vi.fn();
    thumb.hasPointerCapture = vi.fn(() => true);
    thumb.releasePointerCapture = vi.fn();
    const event = new MouseEvent("pointerdown", { bubbles: true, clientY: 10 });
    Object.defineProperties(event, { isPrimary: { value: true }, pointerId: { value: 1 } });
    fireEvent(thumb, event);
    return { ...view, thumb, event };
  };

  it("releases the captured thumb and drag listeners after native event dispatch", () => {
    const remove = vi.spyOn(window, "removeEventListener");
    const { thumb, event } = startDrag();
    expect(event.currentTarget).toBeNull();
    const up = new Event("pointerup");
    Object.defineProperty(up, "pointerId", { value: 1 });
    fireEvent(window, up);
    expect(thumb.releasePointerCapture).toHaveBeenCalledWith(1);
    for (const type of ["pointermove", "pointerup", "pointercancel"])
      expect(remove).toHaveBeenCalledWith(type, expect.any(Function));
  });

  it("removes window drag listeners when the scrollbar unmounts mid-drag", () => {
    const remove = vi.spyOn(window, "removeEventListener");
    const { unmount, thumb } = startDrag();
    unmount();
    expect(thumb.releasePointerCapture).toHaveBeenCalledWith(1);
    for (const type of ["pointermove", "pointerup", "pointercancel"])
      expect(remove).toHaveBeenCalledWith(type, expect.any(Function));
  });
});
