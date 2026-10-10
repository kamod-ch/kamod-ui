/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render, screen } from "@testing-library/preact";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { PathDisplay } from "../../docs/components/PathDisplay";
import { KamodRepositories } from "../navigation/KamodRepositories";
import { NavigationHeader } from "../navigation/NavigationHeader";
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

it("anchors file-type hints to the code-header icon on hover and keyboard focus", () => {
  render(
    <>
      <ApplicationTooltips page="source" />
      <PathDisplay path="src/components/Contact.tsx" file fileTypeTooltip />
    </>,
  );
  const icon = screen.getByRole("img", { name: "TypeScript JSX (.tsx)" });
  hover(icon.querySelector("path")!);
  advance();
  expect(screen.getByRole("tooltip")).toHaveTextContent("TypeScript JSX (.tsx)");
  expect(icon).toHaveAttribute("aria-describedby", screen.getByRole("tooltip").id);
  fireEvent.keyDown(icon, { key: "Escape" });
  expect(screen.queryByRole("tooltip")).toBeNull();
  act(() => {
    icon.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
  });
  expect(screen.getByRole("tooltip")).toHaveTextContent("TypeScript JSX (.tsx)");
});

it("leaves dynamically inserted labeled links without redundant hints", () => {
  render(<ApplicationTooltips page="one" />);
  const link = document.createElement("a");
  link.href = "#guide";
  link.textContent = "Setup guide";
  document.body.append(link);
  hover(link);
  expect(screen.queryByRole("tooltip")).toBeNull();
  advance();
  expect(screen.queryByRole("tooltip")).toBeNull();
  expect(link.parentElement).toBe(document.body);
  link.remove();
});

it("opens immediately on keyboard focus and preserves other accessible descriptions", () => {
  render(
    <>
      <ApplicationTooltips page="one" />
      <button aria-label="Copy" aria-describedby="help">
        <svg aria-hidden="true" />
      </button>
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
      <button aria-label="Copy">
        <svg aria-hidden="true" />
      </button>
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

it("does not read responsive layout during pointer flybys", () => {
  render(
    <>
      <ApplicationTooltips page="one" />
      <button aria-label="Copy source" title="Copy source">
        <svg aria-hidden="true" />
        <span>Copy</span>
      </button>
    </>,
  );
  const button = screen.getByRole("button");
  const style = vi.spyOn(globalThis, "getComputedStyle");
  try {
    hover(button);
    advance(100);
    fireEvent.pointerOut(button);
    advance();
    expect(style).not.toHaveBeenCalled();
    expect(button).toHaveAttribute("title", "Copy source");
    hover(button);
    advance();
    expect(style).toHaveBeenCalled();
    expect(screen.queryByRole("tooltip")).toBeNull();
  } finally {
    style.mockRestore();
  }
});

it("retains a title-only icon hint after suppressing its native tooltip", () => {
  render(
    <>
      <ApplicationTooltips page="one" />
      <button title="Copy source">
        <svg aria-hidden="true" />
      </button>
    </>,
  );
  const button = screen.getByRole("button");
  hover(button);
  expect(button).not.toHaveAttribute("title");
  advance();
  expect(screen.getByRole("tooltip")).toHaveTextContent("Copy source");
});

it("lets keyboard focus bypass a pending pointer delay", () => {
  render(
    <>
      <ApplicationTooltips page="one" />
      <button aria-label="Copy">
        <svg aria-hidden="true" />
      </button>
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
      <button aria-label="Copy">
        <svg aria-hidden="true" />
      </button>
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
      <button aria-label="Copy">
        <svg aria-hidden="true" />
      </button>
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
      <button title="Copy source">
        <svg aria-hidden="true" />
      </button>
    </>,
  );
  const button = screen.getByRole("button");
  hover(button);
  expect(button).not.toHaveAttribute("title");
  rerender(
    <>
      <ApplicationTooltips page="two" />
      <button title="Copy source">
        <svg aria-hidden="true" />
      </button>
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
      <button aria-label="Copy" onClick={click}>
        <svg aria-hidden="true" />
      </button>
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
        <svg aria-hidden="true" />
      </button>
      <span id="label">Open settings</span>
    </>,
  );
  expect(tooltipLabel(document.querySelector("input")!)).toBe("");
  expect(tooltipLabel(screen.getByRole("button"))).toBe("Open settings");
});

it("does not repeat long card headings or visible tab labels", () => {
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
  expect(tooltipLabel(screen.getByRole("link"))).toBe("");
  expect(tooltipLabel(screen.getByRole("tab"))).toBe("");
});

it("suppresses labeled controls and their native titles without removing accessible names", () => {
  render(
    <>
      <ApplicationTooltips page="labels" />
      <button aria-label="Copy code" title="Copy code">
        <svg />
        <span aria-hidden="true">Copy</span>
      </button>
    </>,
  );
  const button = screen.getByRole("button");
  hover(button);
  advance();
  expect(screen.queryByRole("tooltip")).toBeNull();
  expect(button).not.toHaveAttribute("title");
  expect(button).toHaveAccessibleName("Copy code");
  fireEvent.pointerOut(button);
  advance();
  expect(button).toHaveAttribute("title", "Copy code");
});

it("keeps contextual explanations on labeled controls", () => {
  render(
    <>
      <ApplicationTooltips page="context" />
      <button data-tooltip="Copy includes hidden imports">Imports hidden</button>
    </>,
  );
  hover(screen.getByRole("button"));
  advance();
  expect(screen.getByRole("tooltip")).toHaveTextContent("Copy includes hidden imports");
});

it("only labels responsive controls when their visual text is hidden", () => {
  render(
    <button aria-label="Refresh preview">
      <svg />
      <span aria-hidden="true">Refresh</span>
      <span class="sr-only">Preview action</span>
    </button>,
  );
  const button = screen.getByRole("button");
  expect(tooltipLabel(button)).toBe("");
  button.querySelector("span")!.style.display = "none";
  expect(tooltipLabel(button)).toBe("Refresh preview");
  button.querySelector("span")!.style.display = "inline";
  expect(tooltipLabel(button)).toBe("");
});

it("retains full-name hints only for clipped labels", () => {
  render(
    <button title="components/application-shell.tsx">
      <span>application-shell.tsx</span>
    </button>,
  );
  const button = screen.getByRole("button");
  const name = button.querySelector("span")!;
  expect(tooltipLabel(button)).toBe("");
  name.style.overflowX = "hidden";
  Object.defineProperties(name, { clientWidth: { value: 50 }, scrollWidth: { value: 200 } });
  expect(tooltipLabel(button)).toBe("components/application-shell.tsx");
});

it("keeps opted-out sublinks silent on hover and keyboard focus, including nested code", () => {
  render(
    <>
      <ApplicationTooltips page="navigation" />
      <a href="/destination" data-tooltip="off" aria-label="Full destination name">
        <code>Destination</code>
      </a>
    </>,
  );
  const link = screen.getByRole("link");
  hover(link.querySelector("code")!);
  advance();
  fireEvent.keyDown(link, { key: "Tab" });
  act(() => link.focus());
  expect(screen.queryByRole("tooltip")).toBeNull();
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(link).not.toHaveAttribute("aria-describedby");
});

it.each(["Getting Started", "Kamod Ecosystem"])(
  "provides rich %s entry help without replacing its action",
  (name) => {
    render(
      <>
        <ApplicationTooltips page="navigation" />
        <NavigationHeader pathname="/docs/components" />
        <KamodRepositories />
      </>,
    );
    const trigger = screen.getByRole(name === "Getting Started" ? "link" : "button", {
      name: new RegExp(name),
    });
    act(() => trigger.focus());
    const help = screen.getByRole("dialog", { name: `${name} explained` });
    expect(help.querySelectorAll("dt")).toHaveLength(2);
    expect(help.textContent!.length).toBeGreaterThan(600);
    const link = help.querySelector<HTMLAnchorElement>(".reference-help-action")!;
    fireEvent.keyDown(trigger, { key: "Tab" });
    expect(link).toHaveFocus();
    fireEvent.keyDown(link, { key: "Escape" });
    expect(trigger).toHaveFocus();
    expect(screen.queryByRole("dialog")).toBeNull();
    if (name === "Getting Started")
      expect(trigger).toHaveAttribute("href", "/docs/getting-started");
    else {
      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      const repository = screen.getByRole("link", { name: "Icons on GitHub (opens in a new tab)" });
      hover(repository);
      advance();
      expect(screen.queryByRole("tooltip")).toBeNull();
      expect(screen.queryByRole("dialog")).toBeNull();
    }
  },
);

it.each(["components", "blocks", "forms", "packages"])(
  "offers structured %s guidance with keyboard-reachable references",
  (group) => {
    const { unmount } = render(
      <>
        <ApplicationTooltips page="navigation" />
        <button data-navigation-group={group} data-navigation-count="4" aria-expanded="true">
          {group}
        </button>
      </>,
    );
    const trigger = screen.getByRole("button");
    act(() => trigger.focus());
    const hint = screen.getByRole("dialog");
    expect(hint.querySelectorAll("dt")).toHaveLength(2);
    const reference = hint.querySelector<HTMLAnchorElement>("a.docs-inline-code-link")!;
    expect(reference.querySelectorAll("svg")).toHaveLength(2);
    fireEvent.keyDown(trigger, { key: "Tab" });
    const shortcut = hint.querySelector<HTMLAnchorElement>(".reference-help-action")!;
    expect(shortcut).toHaveFocus();
    fireEvent.keyDown(shortcut, { key: "Escape" });
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(trigger).not.toHaveAttribute("aria-describedby");
    unmount();
    advance();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  },
);

it("keeps group-help flybys and touch activation free of extra overlays", () => {
  const toggle = vi.fn();
  render(
    <>
      <ApplicationTooltips page="navigation" />
      <button data-navigation-group="components" onClick={toggle}>
        Components
      </button>
    </>,
  );
  const trigger = screen.getByRole("button");
  hover(trigger);
  advance(100);
  fireEvent.pointerOut(trigger);
  advance();
  expect(screen.queryByRole("dialog")).toBeNull();
  hover(trigger, "touch");
  advance();
  fireEvent.click(trigger);
  expect(toggle).toHaveBeenCalledOnce();
  expect(screen.queryByRole("dialog")).toBeNull();
});

it("keeps keyboard help when scrolling moves rows beneath a stationary pointer", () => {
  render(
    <>
      <ApplicationTooltips page="navigation" />
      <button data-navigation-group="components">Components</button>
      <button data-navigation-group="blocks">Blocks</button>
    </>,
  );
  const components = screen.getByRole("button", { name: "Components" });
  const blocks = screen.getByRole("button", { name: "Blocks" });
  const stationaryHover = () => {
    const event = new Event("pointerover", { bubbles: true });
    Object.defineProperties(event, {
      pointerType: { value: "mouse" },
      clientX: { value: 100 },
      clientY: { value: 100 },
    });
    fireEvent(blocks, event);
  };
  stationaryHover();
  advance();
  fireEvent.keyDown(components, { key: "Shift" });
  act(() => components.focus());
  stationaryHover();
  advance();
  expect(screen.getByRole("dialog", { name: "Components explained" })).toBeVisible();
  expect(screen.queryByRole("dialog", { name: "Blocks explained" })).toBeNull();
});
