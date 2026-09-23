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
      <button tabindex="-2">Programmatic focus only</button>
      <button>Visible</button>`;
    document.body.append(root);
    expect(getFocusableElements(root).map((node) => node.textContent)).toEqual(["Visible"]);
  });

  it("skips controls disabled by a fieldset while keeping its first legend focusable", () => {
    const root = document.createElement("div");
    root.innerHTML = `<fieldset disabled>
      <legend><button>Legend action</button></legend>
      <button>Disabled by fieldset</button>
      <input aria-label="Disabled input" />
      </fieldset><button>Enabled</button>`;
    document.body.append(root);
    expect(getFocusableElements(root).map((node) => node.textContent)).toEqual([
      "Legend action",
      "Enabled",
    ]);
  });

  it("focuses the first control when the panel itself cannot receive focus", () => {
    let initialFocus: FrameRequestCallback = () => {};
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      initialFocus = callback;
      return 1;
    });
    const root = document.createElement("div");
    root.innerHTML = "<button>First</button>";
    document.body.append(root);
    const dispose = trapFocus(root);
    initialFocus(0);
    expect(root.querySelector("button")).toHaveFocus();
    dispose();
  });

  it.each([false, true])("keeps initial Tab inside a focused panel (shiftKey: %s)", (shiftKey) => {
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
