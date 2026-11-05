import { fireEvent } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import { createRovingFocus, getEnabledMenuItems, handleMenuContentKeyDown } from "./index";

describe("createMenuKeyboard", () => {
  it("uses createRovingFocus to skip disabled menu items", () => {
    const menu = document.createElement("div");
    menu.setAttribute("role", "menu");
    const first = document.createElement("button");
    first.setAttribute("role", "menuitem");
    first.textContent = "First";
    const disabled = document.createElement("button");
    disabled.setAttribute("role", "menuitem");
    disabled.setAttribute("disabled", "");
    disabled.textContent = "Disabled";
    const last = document.createElement("button");
    last.setAttribute("role", "menuitem");
    last.textContent = "Last";
    menu.append(first, disabled, last);
    document.body.append(menu);

    first.focus();
    handleMenuContentKeyDown(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }),
      menu,
    );
    expect(document.activeElement).toBe(last);

    const items = getEnabledMenuItems(menu);
    const focus = createRovingFocus(items.length, 0);
    focus.moveNext();
    expect(items[focus.activeIndex.value]).toBe(last);
  });

  it("activates the focused item with Enter", () => {
    const menu = document.createElement("div");
    menu.setAttribute("role", "menu");
    const item = document.createElement("button");
    item.setAttribute("role", "menuitem");
    const onSelect = vi.fn();
    item.addEventListener("click", onSelect);
    menu.append(item);
    document.body.append(menu);
    item.focus();

    const event = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(event, "currentTarget", { value: menu });
    handleMenuContentKeyDown(event, menu);
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("calls onEscape when Escape is pressed", () => {
    const menu = document.createElement("div");
    menu.setAttribute("role", "menu");
    document.body.append(menu);
    const onEscape = vi.fn();
    const event = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(event, "currentTarget", { value: menu });
    handleMenuContentKeyDown(event, menu, { onEscape });
    expect(onEscape).toHaveBeenCalledOnce();
  });
});
