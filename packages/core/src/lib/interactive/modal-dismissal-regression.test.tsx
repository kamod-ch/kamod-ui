import { afterEach, describe, expect, it, vi } from "vitest";
import { createDismissableLayer } from "./createDismissableLayer";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("portaled mobile sidebar dismissal", () => {
  it("accepts clicks inside a modal with a custom data slot, but dismisses on the backdrop", () => {
    const root = document.createElement("div");
    const panel = document.createElement("div");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.dataset.slot = "sidebar";
    const button = document.createElement("button");
    panel.append(button);
    const backdrop = document.createElement("div");
    document.body.append(root, backdrop, panel);
    const dismiss = vi.fn();
    const layer = createDismissableLayer({
      root: () => root,
      open: () => true,
      onDismiss: dismiss,
    });
    button.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
    expect(dismiss).not.toHaveBeenCalled();
    backdrop.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }));
    expect(dismiss).toHaveBeenCalledOnce();
    layer.dispose();
  });
});
