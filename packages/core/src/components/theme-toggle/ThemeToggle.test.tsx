import { resolvedColorSchemeSignal, setColorScheme } from "@kamod-ch/themes";
import { fireEvent, render, screen } from "@testing-library/preact";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "./ThemeToggle";
import { resetThemeRippleStateForTests, THEME_RIPPLE_ACTIVE_CLASS } from "./theme-toggle-ripple";

function createDeferred(): {
  promise: Promise<void>;
  resolve: () => void;
  reject: (reason?: unknown) => void;
} {
  let resolve!: () => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    resetThemeRippleStateForTests();
    setColorScheme("light");
    document.documentElement.classList.remove("dark");
  });

  afterEach(() => {
    resetThemeRippleStateForTests();
    vi.restoreAllMocks();
  });

  it("toggles color scheme with default instant transition", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: "Dark mode" });
    fireEvent.click(button);
    expect(resolvedColorSchemeSignal.value).toBe("dark");
    expect(document.documentElement).toHaveClass("dark");
  });

  it("calls external onClick exactly once and respects defaultPrevented", () => {
    const onClick = vi.fn((event: Event) => {
      event.preventDefault();
    });
    render(<ThemeToggle onClick={onClick} />);
    const button = screen.getByRole("button", { name: "Dark mode" });
    const schemeBefore = resolvedColorSchemeSignal.value;
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
    expect(resolvedColorSchemeSignal.value).toBe(schemeBefore);
  });

  it("does not pass transition prop to the DOM button", () => {
    render(<ThemeToggle transition="ripple" />);
    const button = screen.getByRole("button", { name: "Dark mode" });
    expect(button).not.toHaveAttribute("transition");
  });

  it("uses ripple view transition when enabled", async () => {
    document.documentElement.animate = vi.fn() as typeof document.documentElement.animate;
    const ready = createDeferred();
    const finished = createDeferred();
    document.startViewTransition = vi.fn((update) => {
      update();
      return { ready: ready.promise, finished: finished.promise } as ViewTransition;
    }) as typeof document.startViewTransition;
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockReturnValue({ matches: false }),
    });

    render(<ThemeToggle transition="ripple" />);
    const button = screen.getByRole("button", { name: "Dark mode" });
    fireEvent.click(button, { clientX: 25, clientY: 35, detail: 1 });
    ready.resolve();

    expect(document.startViewTransition).toHaveBeenCalled();
    expect(document.documentElement).toHaveClass(THEME_RIPPLE_ACTIVE_CLASS);
    expect(resolvedColorSchemeSignal.value).toBe("dark");

    finished.resolve();
    await finished.promise;
    expect(document.documentElement).not.toHaveClass(THEME_RIPPLE_ACTIVE_CLASS);
  });

  it("uses button center for keyboard activation with ripple", async () => {
    const animate = vi.fn();
    document.documentElement.animate = animate as typeof document.documentElement.animate;
    const ready = createDeferred();
    const finished = createDeferred();
    document.startViewTransition = vi.fn((update) => {
      update();
      return { ready: ready.promise, finished: finished.promise } as ViewTransition;
    }) as typeof document.startViewTransition;
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockReturnValue({ matches: false }),
    });

    render(<ThemeToggle transition="ripple" />);
    const button = screen.getByRole("button", { name: "Dark mode" });
    fireEvent.click(button, { detail: 0 });

    ready.resolve();
    await ready.promise;
    expect(animate.mock.calls[0]?.[0]?.[0]?.clipPath).toMatch(/circle\(0px at \d+px \d+px\)/);
    finished.resolve();
  });
});
