import { signal } from "@preact/signals";
import { fireEvent, render, screen } from "@testing-library/preact";
import { createRef, type Ref } from "preact";
import { describe, expect, it, vi } from "vitest";
import { Slot } from "./slot";

describe("Slot", () => {
  it("merges class and className with the host class winning conflicts", () => {
    render(
      <Slot class="h-12" className="px-4">
        <a href="/docs" class="h-8 text-sm" className="font-medium">
          Docs
        </a>
      </Slot>,
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link.className).toContain("h-12");
    expect(link.className).toContain("px-4");
    expect(link.className).toContain("text-sm");
    expect(link.className).toContain("font-medium");
    expect(link.className).not.toMatch(/\bh-8\b/);
  });

  it("merges style objects and lets the host override shared properties", () => {
    render(
      <Slot style={{ color: "blue", paddingTop: "2px" }}>
        <a href="/docs" style={{ color: "red", marginTop: "4px" }}>
          Docs
        </a>
      </Slot>,
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link.style.color).toBe("blue");
    expect(link.style.paddingTop).toBe("2px");
    expect(link.style.marginTop).toBe("4px");
  });

  it("chains child handlers before host handlers", () => {
    const order: string[] = [];
    render(
      <Slot
        onClick={() => order.push("host-click")}
        onKeyDown={() => order.push("host-key")}
        onPointerDown={() => order.push("host-pointer")}
        onFocus={() => order.push("host-focus")}
        onBlur={() => order.push("host-blur")}
      >
        <button
          type="button"
          onClick={() => order.push("child-click")}
          onKeyDown={() => order.push("child-key")}
          onPointerDown={() => order.push("child-pointer")}
          onFocus={() => order.push("child-focus")}
          onBlur={() => order.push("child-blur")}
        >
          Open
        </button>
      </Slot>,
    );
    const button = screen.getByRole("button", { name: "Open" });
    fireEvent.click(button);
    fireEvent.keyDown(button, { key: "Enter" });
    fireEvent.pointerDown(button);
    fireEvent.focus(button);
    fireEvent.blur(button);
    expect(order).toEqual([
      "child-click",
      "host-click",
      "child-key",
      "host-key",
      "child-pointer",
      "host-pointer",
      "child-focus",
      "host-focus",
      "child-blur",
      "host-blur",
    ]);
  });

  it("forwards callback refs and object refs to the same element", () => {
    const childCallback = vi.fn();
    const hostCallback = vi.fn();
    const childObject = createRef<HTMLButtonElement>();
    const hostObject = createRef<HTMLElement>();
    render(
      <Slot ref={hostCallback}>
        <button type="button" ref={childCallback}>
          Callback
        </button>
      </Slot>,
    );
    const callbackButton = screen.getByRole("button", { name: "Callback" });
    expect(childCallback).toHaveBeenCalledWith(callbackButton);
    expect(hostCallback).toHaveBeenCalledWith(callbackButton);

    render(
      <Slot ref={hostObject}>
        <button type="button" ref={childObject}>
          Object
        </button>
      </Slot>,
    );
    const objectButton = screen.getByRole("button", { name: "Object" });
    expect(childObject.current).toBe(objectButton);
    expect(hostObject.current).toBe(objectButton);
  });

  it("forwards a ref through a function child", () => {
    const childObject = createRef<HTMLButtonElement>();
    const hostObject = createRef<HTMLElement>();
    const Child = (props: { ref?: Ref<HTMLButtonElement>; children?: string }) => (
      <button type="button" {...props} />
    );
    render(
      <Slot ref={hostObject}>
        <Child ref={childObject}>Proxy</Child>
      </Slot>,
    );
    const button = screen.getByRole("button", { name: "Proxy" });
    expect(childObject.current).toBe(button);
    expect(hostObject.current).toBe(button);
  });

  it("keeps child aria and data attributes and lets the host override the same name", () => {
    const expanded = signal(true);
    render(
      <Slot aria-expanded={expanded} data-slot="dialog-trigger" data-state="open">
        <button type="button" aria-label="Open" data-kind="trigger" data-state="closed">
          Open
        </button>
      </Slot>,
    );
    const button = screen.getByRole("button", { name: "Open" });
    expect(button).toHaveAttribute("aria-label", "Open");
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button).toHaveAttribute("data-slot", "dialog-trigger");
    expect(button).toHaveAttribute("data-kind", "trigger");
    expect(button).toHaveAttribute("data-state", "open");
  });

  it("uses the first element child", () => {
    render(
      <Slot data-slot="one">
        <a href="/a">A</a>
        <a href="/b">B</a>
      </Slot>,
    );
    expect(screen.getByRole("link", { name: "A" })).toHaveAttribute("data-slot", "one");
    expect(screen.queryByRole("link", { name: "B" })).toBeNull();
  });
});
