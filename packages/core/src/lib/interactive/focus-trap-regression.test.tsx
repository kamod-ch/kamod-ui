import { afterEach, describe, expect, it, vi } from "vitest";
import { getFocusableElements, trapFocus } from "./createFocusTrap";

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

describe("modal focus boundaries", () => {
  it("skips hidden and inert controls, including hidden ancestors", () => {
    const root = document.createElement("div");
    root.innerHTML = `<button style="display:none">Hidden close</button>
      <div hidden><a href="/">Hidden link</a></div>
      <div style="display:none"><button>Hidden parent</button></div>
      <div inert><button>Inert</button></div>
      <button style="visibility:hidden">Invisible</button>
      <button>Visible</button>`;
    document.body.append(root);
    expect(getFocusableElements(root).map((node) => node.textContent)).toEqual(["Visible"]);
  });

  it.each([false, true])("keeps initial %s Shift+Tab inside a focused panel", (shiftKey) => {
    const root = document.createElement("div");
    root.tabIndex = -1;
    root.innerHTML =
      '<button style="display:none">Close</button><button>First</button><button>Last</button>';
    document.body.append(root);
    const dispose = trapFocus(root);
    root.focus();
    const event = new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey,
      bubbles: true,
      cancelable: true,
    });
    root.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement?.textContent).toBe(shiftKey ? "Last" : "First");
    dispose();
  });

  it("cancels pending initial focus when a panel closes immediately", () => {
    vi.spyOn(window, "requestAnimationFrame").mockReturnValue(42);
    const cancel = vi.spyOn(window, "cancelAnimationFrame");
    const dispose = trapFocus(document.createElement("div"));
    dispose();
    expect(cancel).toHaveBeenCalledWith(42);
  });
});
