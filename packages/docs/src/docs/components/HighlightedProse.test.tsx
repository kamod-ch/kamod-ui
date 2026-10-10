/** @vitest-environment jsdom */
import { act, cleanup, render, waitFor } from "@testing-library/preact";
import { afterEach, expect, it, vi } from "vitest";
import { parseGuide } from "../../blocks/guides/guide-markdown";
import { HighlightedProse } from "./HighlightedProse";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it("highlights nested code near the viewport without changing source or containing markup", async () => {
  let notify: IntersectionObserverCallback;
  const observe = vi.fn();
  const unobserve = vi.fn();
  const disconnect = vi.fn();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        notify = callback;
      }
      observe = observe;
      unobserve = unobserve;
      disconnect = disconnect;
    },
  );
  const [{ parts }] = parseGuide('## Example\n\n> ```\n> const label = "<script>";\n> ```');
  const html = parts
    .filter((part) => part.kind === "html")
    .map((part) => part.html)
    .join("");
  const { container, unmount } = render(<HighlightedProse html={html} />);
  const code = container.querySelector("blockquote pre > code")!;
  expect(observe).toHaveBeenCalledWith(code);
  expect(code.querySelector(".token")).toBeNull();
  await act(() =>
    notify!(
      [{ target: code, isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    ),
  );
  await waitFor(() => expect(code.querySelector(".token.keyword")?.textContent).toBe("const"));
  expect(code.textContent).toBe('const label = "<script>";\n');
  expect(code.parentElement?.dataset.language).toBe("javascript");
  expect(container.querySelector("script")).toBeNull();
  expect(unobserve).toHaveBeenCalledWith(code);
  unmount();
  expect(disconnect).toHaveBeenCalledOnce();
});

it("keeps prose and unknown snippets readable and refreshes changed source", async () => {
  vi.stubGlobal("IntersectionObserver", undefined);
  const { container, rerender } = render(
    <HighlightedProse html='<p>Read <a href="/docs">the guide</a>.</p><pre><code>Just a message.</code></pre>' />,
  );
  expect(container.querySelector("code")?.textContent).toBe("Just a message.");
  expect(container.querySelector(".token")).toBeNull();
  expect(container.querySelector("a")?.getAttribute("href")).toBe("/docs");
  rerender(<HighlightedProse html="<pre><code>const enabled = true;</code></pre>" />);
  await waitFor(() => expect(container.querySelector(".token.keyword")?.textContent).toBe("const"));
  rerender(<HighlightedProse html="<pre><code>const count = 2;</code></pre>" />);
  await waitFor(() => expect(container.querySelector(".token.number")?.textContent).toBe("2"));
  expect(container.querySelector("code")?.textContent).toBe("const count = 2;");
});

it("does not update detached blocks after an unmount", async () => {
  vi.stubGlobal("IntersectionObserver", undefined);
  const { container, unmount } = render(
    <HighlightedProse html="<pre><code>const enabled = true;</code></pre>" />,
  );
  const code = container.querySelector("code")!;
  unmount();
  await act(async () => {});
  expect(code.textContent).toBe("const enabled = true;");
  expect(code.querySelector(".token")).toBeNull();
});
