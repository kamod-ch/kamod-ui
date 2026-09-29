import { fireEvent, render, screen } from "@testing-library/preact";
import { useState } from "preact/hooks";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { DirectionProvider } from "../direction/Direction";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./index";

beforeAll(() => {
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = function setPointerCapture() {};
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = function releasePointerCapture() {};
  }
});

const Workbench = ({
  direction = "horizontal" as const,
  rtl = false,
  onSizesChange,
  defaultSizes = [20, 50, 30],
}: {
  direction?: "horizontal" | "vertical";
  rtl?: boolean;
  onSizesChange?: (sizes: number[]) => void;
  defaultSizes?: number[];
}) => {
  const [sizes, setSizes] = useState(defaultSizes);
  const group = (
    <ResizablePanelGroup
      direction={direction}
      dir={rtl ? "rtl" : "ltr"}
      sizes={sizes}
      onSizesChange={(next) => {
        setSizes(next);
        onSizesChange?.(next);
      }}
      class={direction === "horizontal" ? "h-64 w-[640px]" : "h-[480px] w-80"}
    >
      <ResizablePanel id="tree" minSize={15} maxSize={40}>
        Tree
      </ResizablePanel>
      <ResizableHandle label="Resize tree and editor" />
      <ResizablePanel id="editor" minSize={30}>
        Editor
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel id="detail" minSize={15} maxSize={45}>
        Detail
      </ResizablePanel>
    </ResizablePanelGroup>
  );

  if (rtl) {
    return <DirectionProvider direction="rtl">{group}</DirectionProvider>;
  }
  return group;
};

describe("ResizablePanelGroup", () => {
  it("renders panels with default percent sizes for SSR-stable layout", () => {
    render(
      <div style={{ width: "640px", height: "256px" }}>
        <ResizablePanelGroup defaultSizes={[25, 75]} class="h-full w-full">
          <ResizablePanel id="left">Left</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel id="right">Right</ResizablePanel>
        </ResizablePanelGroup>
      </div>,
    );
    expect(screen.getByText("Left").closest("[data-panel-id]")).toHaveAttribute(
      "data-panel-size",
      "25",
    );
    expect(screen.getByText("Right").closest("[data-panel-id]")).toHaveAttribute(
      "data-panel-size",
      "75",
    );
  });

  it("throws when constraints cannot be satisfied", () => {
    expect(() =>
      render(
        <ResizablePanelGroup>
          <ResizablePanel id="a" minSize={70}>
            A
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel id="b" minSize={40}>
            B
          </ResizablePanel>
        </ResizablePanelGroup>,
      ),
    ).toThrow(/minSize values sum/);
  });

  it("resizes adjacent panels from the keyboard", () => {
    const onSizesChange = vi.fn();
    render(<Workbench onSizesChange={onSizesChange} />);
    const handle = screen.getByRole("separator", { name: "Resize tree and editor" });
    handle.focus();
    fireEvent.keyDown(handle, { key: "ArrowRight" });
    expect(onSizesChange).toHaveBeenCalled();
    const last = onSizesChange.mock.calls.at(-1)?.[0] as number[];
    expect(last[0]).toBeGreaterThan(20);
    expect(last[1]).toBeLessThan(50);
  });

  it("sets extremes with Home and End", () => {
    const onSizesChange = vi.fn();
    render(<Workbench onSizesChange={onSizesChange} />);
    const handle = screen.getByRole("separator", { name: "Resize tree and editor" });
    handle.focus();
    fireEvent.keyDown(handle, { key: "Home" });
    const homeSizes = onSizesChange.mock.calls.at(-1)?.[0] as number[];
    expect(homeSizes[0]).toBe(15);
    fireEvent.keyDown(handle, { key: "End" });
    const endSizes = onSizesChange.mock.calls.at(-1)?.[0] as number[];
    expect(endSizes[0]).toBeGreaterThan(homeSizes[0]!);
  });

  it("mirrors arrow keys in rtl horizontal groups", () => {
    const rtlOnChange = vi.fn();
    const ltrOnChange = vi.fn();
    const { unmount } = render(<Workbench rtl onSizesChange={rtlOnChange} />);
    const rtlHandle = screen.getByRole("separator", { name: "Resize tree and editor" });
    rtlHandle.focus();
    fireEvent.keyDown(rtlHandle, { key: "ArrowRight" });
    unmount();
    render(<Workbench onSizesChange={ltrOnChange} />);
    const ltrHandle = screen.getByRole("separator", { name: "Resize tree and editor" });
    ltrHandle.focus();
    fireEvent.keyDown(ltrHandle, { key: "ArrowRight" });
    const rtlSizes = rtlOnChange.mock.calls.at(-1)?.[0] as number[];
    const ltrSizes = ltrOnChange.mock.calls.at(-1)?.[0] as number[];
    expect(rtlSizes[0]).toBeLessThan(ltrSizes[0]!);
  });

  it("supports pointer drag with capture and restores selection", () => {
    const onSizesChange = vi.fn();
    document.body.style.userSelect = "text";
    render(<Workbench onSizesChange={onSizesChange} />);
    const handle = screen.getByRole("separator", { name: "Resize tree and editor" });
    fireEvent.pointerDown(handle, { clientX: 100, button: 0, pointerId: 1 });
    expect(document.body.style.userSelect).toBe("none");
    fireEvent.pointerMove(handle, { clientX: 160, pointerId: 1 });
    expect(onSizesChange).toHaveBeenCalled();
    fireEvent.pointerUp(handle, { pointerId: 1 });
    expect(document.body.style.userSelect).toBe("text");
  });

  it("restores selection after pointer cancel and unmount cleanup", () => {
    document.body.style.userSelect = "auto";
    const { unmount } = render(<Workbench />);
    const handle = screen.getByRole("separator", { name: "Resize tree and editor" });
    fireEvent.pointerDown(handle, { clientX: 80, button: 0, pointerId: 2 });
    fireEvent.pointerCancel(handle, { pointerId: 2 });
    expect(document.body.style.userSelect).toBe("auto");
    fireEvent.pointerDown(handle, { clientX: 80, button: 0, pointerId: 3 });
    unmount();
    expect(document.body.style.userSelect).toBe("auto");
  });

  it("keeps percent sizes stable when the container is observed for resize", () => {
    render(
      <div data-testid="container" style={{ width: "640px", height: "256px" }}>
        <ResizablePanelGroup defaultSizes={[30, 70]} class="h-full w-full">
          <ResizablePanel id="left">Left</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel id="right">Right</ResizablePanel>
        </ResizablePanelGroup>
      </div>,
    );
    const left = screen.getByText("Left").closest("[data-panel-id]");
    expect(left).toHaveAttribute("data-panel-size", "30");
    expect(left).toHaveStyle({ flexGrow: "30" });
  });

  it("supports nested vertical groups inside a horizontal panel", () => {
    render(
      <div class="h-64 w-[640px]">
        <ResizablePanelGroup defaultSizes={[35, 65]} class="h-full w-full">
          <ResizablePanel id="sidebar">Sidebar</ResizablePanel>
          <ResizableHandle />
          <ResizablePanel id="main" class="p-0">
            <ResizablePanelGroup direction="vertical" defaultSizes={[70, 30]} class="h-full w-full">
              <ResizablePanel id="editor">Editor</ResizablePanel>
              <ResizableHandle label="Resize editor and console" />
              <ResizablePanel id="console">Console</ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>,
    );
    expect(screen.getByText("Sidebar")).toBeInTheDocument();
    expect(screen.getByText("Console")).toBeInTheDocument();
    expect(
      screen.getByRole("separator", { name: "Resize editor and console" }),
    ).toBeInTheDocument();
  });
});
