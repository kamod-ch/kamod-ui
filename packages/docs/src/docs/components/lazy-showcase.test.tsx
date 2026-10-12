/** @vitest-environment jsdom */
import { act } from "@testing-library/preact";
import { Component, type ComponentChildren, render } from "preact";
import { renderToString } from "preact-render-to-string";
import { afterEach, describe, expect, it, vi } from "vitest";
import { lazyShowcase } from "./lazy-showcase";

const roots: HTMLDivElement[] = [];
function root() {
  const element = document.createElement("div");
  document.body.append(element);
  roots.push(element);
  return element;
}
function deferred<Value>() {
  let resolve!: (value: Value) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<Value>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
const Content = ({ label }: { label: string }) => <main>{label}</main>;
const fallback = <div role="status">Opening the source</div>;

afterEach(() => {
  act(() => {
    for (const element of roots) {
      render(null, element);
      element.remove();
    }
  });
  roots.length = 0;
});

describe("lazy showcase content", () => {
  it("commits the loader on its first render and replaces it with the latest content props", async () => {
    const pending = deferred<{ default: typeof Content }>();
    const Lazy = lazyShowcase(() => pending.promise);
    const element = root();
    // Inspect the initial commit before draining queued renders: Suspense can be empty here.
    render(<Lazy label="First" fallback={fallback} />, element);
    expect(element.querySelector('[role="status"]')).toHaveTextContent("Opening the source");
    render(<Lazy label="Changed while loading" fallback={fallback} />, element);
    await act(async () => {
      pending.resolve({ default: Content });
      await pending.promise;
    });
    expect(element.querySelector('[role="status"]')).toBeNull();
    expect(element.querySelector("main")).toHaveTextContent("Changed while loading");
    expect(element.childElementCount).toBe(1);
  });

  it("shares pending work across examples and tab revisits, then reuses the module without a loader flash", async () => {
    const pending = deferred<{ default: typeof Content }>();
    const load = vi.fn(() => pending.promise);
    const Lazy = lazyShowcase(load);
    const first = root();
    const second = root();
    render(<Lazy label="First" fallback={fallback} />, first);
    render(<Lazy label="Second" fallback={fallback} />, second);
    act(() => render(null, first));
    render(<Lazy label="Revisited" fallback={fallback} />, first);
    expect(first.querySelector('[role="status"]')).not.toBeNull();
    expect(second.querySelector('[role="status"]')).not.toBeNull();
    expect(load).toHaveBeenCalledTimes(1);
    await act(async () => {
      pending.resolve({ default: Content });
      await pending.promise;
    });
    expect(first.querySelector("main")).toHaveTextContent("Revisited");
    expect(second.querySelector("main")).toHaveTextContent("Second");
    act(() => render(null, first));
    render(<Lazy label="Cached" fallback={fallback} />, first);
    expect(first.querySelector("main")).toHaveTextContent("Cached");
    expect(first.querySelector('[role="status"]')).toBeNull();
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("does not remount content when a request resolves after switching away", async () => {
    const pending = deferred<{ default: typeof Content }>();
    const Lazy = lazyShowcase(() => pending.promise);
    const element = root();
    render(<Lazy label="Inactive" fallback={fallback} />, element);
    act(() => render(<p>Preview</p>, element));
    await act(async () => {
      pending.resolve({ default: Content });
      await pending.promise;
    });
    expect(element.innerHTML).toBe("<p>Preview</p>");
  });

  it("renders a stable SSR fallback without starting browser-only module work", () => {
    const load = vi.fn(async () => ({ default: Content }));
    const Lazy = lazyShowcase(load);
    expect(renderToString(<Lazy label="SSR" fallback={fallback} />)).toBe(
      '<div role="status">Opening the source</div>',
    );
    expect(load).not.toHaveBeenCalled();
  });

  it("passes failed imports to the existing error boundary instead of leaving an endless loader", async () => {
    class ErrorBoundary extends Component<{ children: ComponentChildren }, { failed: boolean }> {
      state = { failed: false };
      static getDerivedStateFromError() {
        return { failed: true };
      }
      render() {
        return this.state.failed ? <p role="alert">Source unavailable</p> : this.props.children;
      }
    }
    const pending = deferred<{ default: typeof Content }>();
    const Lazy = lazyShowcase(() => pending.promise);
    const element = root();
    render(
      <ErrorBoundary>
        <Lazy label="Unavailable" fallback={fallback} />
      </ErrorBoundary>,
      element,
    );
    await act(async () => {
      pending.reject(new Error("Module unavailable"));
      await pending.promise.catch(() => {});
    });
    expect(element.querySelector('[role="alert"]')).toHaveTextContent("Source unavailable");
    expect(element.querySelector('[role="status"]')).toBeNull();
  });
});
