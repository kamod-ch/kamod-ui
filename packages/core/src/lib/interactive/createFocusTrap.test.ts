import { getFocusableElements, trapFocus } from "./createFocusTrap";

describe("trapFocus", () => {
  it("returns focusable elements inside the container", () => {
    const root = document.createElement("div");
    root.innerHTML = `
      <button type="button">First</button>
      <button type="button" disabled>Disabled</button>
      <a href="#">Link</a>
    `;
    document.body.appendChild(root);

    expect(getFocusableElements(root).map((el) => el.textContent)).toEqual(["First", "Link"]);
    root.remove();
  });

  it("wraps focus on Tab and Shift+Tab", () => {
    const root = document.createElement("div");
    root.tabIndex = -1;
    root.innerHTML = `
      <button type="button">First</button>
      <button type="button">Last</button>
    `;
    document.body.appendChild(root);

    const dispose = trapFocus(root, { focusContainer: false });
    const [first, last] = getFocusableElements(root);

    first.focus();
    root.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
    expect(document.activeElement).toBe(last);

    root.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true }));
    expect(document.activeElement).toBe(first);

    dispose();
    root.remove();
  });
});
