/** @vitest-environment jsdom */
import { act, cleanup, fireEvent, render, screen } from "@testing-library/preact";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { useTypeDefinitions } from "./useTypeDefinitions";

const ids = ["type-A", "type-B"];
let frames: Map<number, FrameRequestCallback>;
let sequence = 0;
const scroll = vi.fn();
function Harness() {
  const definitions = useTypeDefinitions(ids);
  return (
    <>
      {ids.map((id) => (
        <section key={id}>
          <h4 id={id} tabIndex={-1}>
            {id}
          </h4>
          <button onClick={() => definitions.reveal(id)}>Open {id}</button>
          <button onClick={() => definitions.setOpen(id, false)}>Close {id}</button>
          {definitions.isOpen(id) && <p>{id} content</p>}
        </section>
      ))}
    </>
  );
}
function navigate(hash: string) {
  act(() => {
    history.replaceState(null, "", hash);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
}
function flushFrames() {
  act(() => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((callback) => callback(0));
  });
}
beforeEach(() => {
  history.replaceState(null, "", "/");
  frames = new Map();
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    frames.set(++sequence, callback);
    return sequence;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => {
    frames.delete(id);
  });
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: scroll,
  });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  scroll.mockClear();
});

it("opens initial deep links without stealing focus", () => {
  history.replaceState(null, "", "#type-A");
  render(<Harness />);
  expect(screen.getByText("type-A content")).toBeVisible();
  flushFrames();
  expect(scroll).toHaveBeenCalledOnce();
  expect(document.activeElement).toBe(document.body);
});
it("reopens a closed type when the fragment stays the same", () => {
  render(<Harness />);
  navigate("#type-A");
  flushFrames();
  fireEvent.click(screen.getByRole("button", { name: "Close type-A" }));
  expect(screen.queryByText("type-A content")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Open type-A" }));
  flushFrames();
  expect(screen.getByText("type-A content")).toBeVisible();
  expect(document.activeElement?.id).toBe("type-A");
});
it("only scrolls and focuses the latest type during rapid navigation", () => {
  render(<Harness />);
  navigate("#type-A");
  navigate("#type-B");
  expect(frames.size).toBe(1);
  flushFrames();
  expect(scroll).toHaveBeenCalledOnce();
  expect(document.activeElement?.id).toBe("type-B");
  expect(screen.getByText("type-A content")).toBeVisible();
});
it("cancels a pending type scroll when navigating to another section", () => {
  render(<Harness />);
  navigate("#type-A");
  navigate("#usage");
  expect(frames.size).toBe(0);
  flushFrames();
  expect(scroll).not.toHaveBeenCalled();
});
it("removes its listener and pending animation on unmount", () => {
  const add = vi.spyOn(window, "addEventListener");
  const remove = vi.spyOn(window, "removeEventListener");
  const { unmount } = render(<Harness />);
  const hashListeners = add.mock.calls.filter(([name]) => name === "hashchange");
  expect(hashListeners).toHaveLength(1);
  navigate("#type-A");
  act(() => {
    unmount();
  });
  expect(remove).toHaveBeenCalledWith("hashchange", hashListeners[0][1]);
  expect(frames.size).toBe(0);
  navigate("#type-B");
  expect(frames.size).toBe(0);
  expect(scroll).not.toHaveBeenCalled();
});
