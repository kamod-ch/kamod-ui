/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render, screen } from "@testing-library/preact";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { ApplicationTooltips } from "./ApplicationTooltips";
import { tooltipLabel } from "./tooltip-label";

const advance = (ms = 500) =>
  act(() => {
    vi.advanceTimersByTime(ms);
  });
const hover = (element: Element, pointerType = "mouse") => {
  const event = new Event("pointerover", { bubbles: true });
  Object.defineProperty(event, "pointerType", { value: pointerType });
  fireEvent(element, event);
};
beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

it("shows brief hints for dynamically inserted links and tabs without changing their layout", () => {
  render(<ApplicationTooltips page="one" />);
  const link = document.createElement("a");
  link.href = "#guide";
  link.textContent = "Setup guide";
  document.body.append(link);
  hover(link);
  expect(screen.queryByRole("tooltip")).toBeNull();
  advance();
  expect(screen.getByRole("tooltip")).toHaveTextContent("Setup guide");
  expect(link.parentElement).toBe(document.body);
  link.remove();
});

it("opens immediately on keyboard focus and preserves other accessible descriptions", () => {
  render(
    <>
      <ApplicationTooltips page="one" />
      <button aria-describedby="help">Copy</button>
    </>,
  );
  const button = screen.getByRole("button");
  act(() => {
    button.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
  });
  const tooltip = screen.getByRole("tooltip");
  expect(button.getAttribute("aria-describedby")).toBe(`help ${tooltip.id}`);
  fireEvent.keyDown(button, { key: "Escape" });
  expect(screen.queryByRole("tooltip")).toBeNull();
  expect(button).toHaveAttribute("aria-describedby", "help");
});

it("cancels a quick flyby and opens normally when the pointer returns", () => {
  render(
    <>
      <ApplicationTooltips page="one" />
      <button>Copy</button>
    </>,
  );
  const button = screen.getByRole("button");
  hover(button);
  advance(100);
  fireEvent.pointerOut(button);
  hover(button);
  advance();
  expect(screen.getByRole("tooltip")).toHaveTextContent("Copy");
});

it("lets keyboard focus bypass a pending pointer delay", () => {
  render(
    <>
      <ApplicationTooltips page="one" />
      <button>Copy</button>
    </>,
  );
  const button = screen.getByRole("button");
  hover(button);
  act(() => {
    button.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
  });
  expect(screen.getByRole("tooltip")).toHaveTextContent("Copy");
});

it("keeps hints hoverable, then closes after leaving the hint", () => {
  render(
    <>
      <ApplicationTooltips page="one" />
      <button>Copy</button>
    </>,
  );
  const button = screen.getByRole("button");
  hover(button);
  advance();
  const tooltip = screen.getByRole("tooltip");
  fireEvent.pointerOut(button, { relatedTarget: tooltip });
  hover(tooltip);
  advance();
  expect(screen.getByRole("tooltip")).toBeVisible();
  fireEvent.pointerOut(tooltip);
  advance();
  expect(screen.queryByRole("tooltip")).toBeNull();
});

it("does not duplicate authored tooltips or explicitly disabled hints", () => {
  render(
    <>
      <ApplicationTooltips page="one" />
      <div data-slot="tooltip">
        <button>Existing hint</button>
      </div>
      <button data-tooltip="off">No hint</button>
    </>,
  );
  for (const button of screen.getAllByRole("button")) {
    hover(button);
    advance();
  }
  expect(screen.queryByRole("tooltip")).toBeNull();
});

it("does not open on touch or pointer-induced focus", () => {
  render(
    <>
      <ApplicationTooltips page="one" />
      <button>Copy</button>
    </>,
  );
  const button = screen.getByRole("button");
  hover(button, "touch");
  fireEvent.pointerDown(button);
  act(() => {
    button.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
  });
  advance();
  expect(screen.queryByRole("tooltip")).toBeNull();
});

it("restores native titles and removes pending work when navigating or unmounting", () => {
  const { rerender, unmount } = render(
    <>
      <ApplicationTooltips page="one" />
      <button title="Copy source">Copy</button>
    </>,
  );
  const button = screen.getByRole("button");
  hover(button);
  expect(button).not.toHaveAttribute("title");
  rerender(
    <>
      <ApplicationTooltips page="two" />
      <button title="Copy source">Copy</button>
    </>,
  );
  advance();
  expect(screen.queryByRole("tooltip")).toBeNull();
  expect(button).toHaveAttribute("title", "Copy source");
  hover(button);
  advance();
  unmount();
  advance();
  expect(screen.queryByRole("tooltip")).toBeNull();
  expect(vi.getTimerCount()).toBe(0);
});

it("dismisses on scrolling and leaves activation handlers working", () => {
  const click = vi.fn();
  render(
    <>
      <ApplicationTooltips page="one" />
      <button onClick={click}>Copy</button>
    </>,
  );
  const button = screen.getByRole("button");
  hover(button);
  advance();
  fireEvent.scroll(document);
  expect(screen.queryByRole("tooltip")).toBeNull();
  hover(button);
  advance();
  fireEvent.click(button);
  expect(screen.queryByRole("tooltip")).toBeNull();
  expect(click).toHaveBeenCalledOnce();
});

it("uses accessible labels and never includes entered form values", () => {
  render(
    <>
      <label htmlFor="password">Password</label>
      <input id="password" type="password" value="secret-value" />
      <button aria-labelledby="label">
        <span aria-hidden="true">99</span>
      </button>
      <span id="label">Open settings</span>
    </>,
  );
  expect(tooltipLabel(document.querySelector("input")!)).toBe("Password");
  expect(tooltipLabel(screen.getByRole("button"))).toBe("Open settings");
});

it("keeps long cards brief and omits decorative content", () => {
  render(
    <>
      <a href="#">
        <h3>Component guide</h3>
        <p>{"Long description ".repeat(30)}</p>
      </a>
      <button role="tab">
        <span aria-hidden="true">Icon</span>Code
      </button>
    </>,
  );
  expect(tooltipLabel(screen.getByRole("link"))).toBe("Component guide");
  expect(tooltipLabel(screen.getByRole("tab"))).toBe("Show Code");
});
