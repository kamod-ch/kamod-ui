import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  applyColorSchemeWithTransition,
  canUseThemeRipple,
  clampViewportCoordinate,
  getThemeRippleMetrics,
  isThemeRippleTransitionInFlight,
  resetThemeRippleStateForTests,
  THEME_RIPPLE_ACTIVE_CLASS,
} from "./theme-toggle-ripple";

describe("theme-toggle-ripple helpers", () => {
  it("clamps coordinates to the viewport", () => {
    expect(clampViewportCoordinate(-10, 100)).toBe(0);
    expect(clampViewportCoordinate(150, 100)).toBe(100);
    expect(clampViewportCoordinate(40, 100)).toBe(40);
  });

  it("uses pointer coordinates for pointer activation", () => {
    const metrics = getThemeRippleMetrics(
      { detail: 1, clientX: 10, clientY: 20 },
      domRect(0, 0, 40, 40),
      { innerWidth: 200, innerHeight: 100 },
    );
    expect(metrics).toEqual({
      x: 10,
      y: 20,
      endRadius: Math.hypot(Math.max(10, 190), Math.max(20, 80)),
    });
  });

  it("uses button center for keyboard activation", () => {
    const button = document.createElement("button");
    button.getBoundingClientRect = () =>
      ({
        left: 100,
        top: 50,
        width: 40,
        height: 20,
        right: 140,
        bottom: 70,
        x: 100,
        y: 50,
        toJSON: () => ({}),
      }) as DOMRect;
    const metrics = getThemeRippleMetrics({ detail: 0, clientX: 0, clientY: 0 }, button, {
      innerWidth: 400,
      innerHeight: 300,
    });
    expect(metrics.x).toBe(120);
    expect(metrics.y).toBe(60);
  });

  it("treats clientX/clientY zero as valid pointer coordinates", () => {
    const metrics = getThemeRippleMetrics(
      { detail: 1, clientX: 0, clientY: 0 },
      domRect(50, 50, 10, 10),
      { innerWidth: 100, innerHeight: 80 },
    );
    expect(metrics.x).toBe(0);
    expect(metrics.y).toBe(0);
  });
});

describe("applyColorSchemeWithTransition", () => {
  const applyScheme = vi.fn();

  beforeEach(() => {
    applyScheme.mockReset();
    resetThemeRippleStateForTests();
    document.documentElement.classList.remove("dark");
  });

  afterEach(() => {
    resetThemeRippleStateForTests();
    vi.restoreAllMocks();
  });

  it("applies instantly when transition is instant", () => {
    applyColorSchemeWithTransition("dark", "instant", applyScheme, pointerEvent(), button());
    expect(applyScheme).toHaveBeenCalledOnce();
    expect(applyScheme).toHaveBeenCalledWith("dark");
    expect(document.documentElement).not.toHaveClass(THEME_RIPPLE_ACTIVE_CLASS);
  });

  it("runs view transition ripple with expected clip-path animation", async () => {
    const animate = vi.fn();
    document.documentElement.animate = animate as typeof document.documentElement.animate;

    let domUpdate!: () => void;
    const ready = createDeferred();
    const finished = createDeferred();
    document.startViewTransition = vi.fn((update) => {
      domUpdate = update;
      return { ready: ready.promise, finished: finished.promise } as ViewTransition;
    }) as typeof document.startViewTransition;

    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockReturnValue({ matches: false }),
    });

    applyColorSchemeWithTransition("dark", "ripple", applyScheme, pointerEvent(30, 40), button());
    expect(document.documentElement).toHaveClass(THEME_RIPPLE_ACTIVE_CLASS);
    expect(isThemeRippleTransitionInFlight()).toBe(true);

    domUpdate();
    expect(applyScheme).toHaveBeenCalledWith("dark");

    ready.resolve();
    await ready.promise;
    expect(animate).toHaveBeenCalledWith(
      [
        { clipPath: "circle(0px at 30px 40px)" },
        {
          clipPath: `circle(${Math.hypot(
            Math.max(30, window.innerWidth - 30),
            Math.max(40, window.innerHeight - 40),
          )}px at 30px 40px)`,
        },
      ],
      {
        duration: 450,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
        fill: "both",
      },
    );

    finished.resolve();
    await finished.promise;
    expect(document.documentElement).not.toHaveClass(THEME_RIPPLE_ACTIVE_CLASS);
    expect(isThemeRippleTransitionInFlight()).toBe(false);
  });

  it("falls back when startViewTransition is missing", () => {
    // @ts-expect-error test stub
    document.startViewTransition = undefined;
    document.documentElement.animate = vi.fn() as typeof document.documentElement.animate;
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockReturnValue({ matches: false }),
    });

    applyColorSchemeWithTransition("light", "ripple", applyScheme, pointerEvent(), button());
    expect(applyScheme).toHaveBeenCalledWith("light");
    expect(document.documentElement).not.toHaveClass(THEME_RIPPLE_ACTIVE_CLASS);
  });

  it("falls back when prefers-reduced-motion is set", () => {
    document.startViewTransition = vi.fn() as typeof document.startViewTransition;
    document.documentElement.animate = vi.fn() as typeof document.documentElement.animate;
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });

    expect(canUseThemeRipple("ripple")).toBe(false);
    applyColorSchemeWithTransition("dark", "ripple", applyScheme, pointerEvent(), button());
    expect(document.startViewTransition).not.toHaveBeenCalled();
    expect(applyScheme).toHaveBeenCalledWith("dark");
  });

  it("cleans up active class when ready rejects", async () => {
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

    applyColorSchemeWithTransition("dark", "ripple", applyScheme, pointerEvent(), button());
    ready.reject(new Error("ready failed"));
    await vi.waitFor(() => {
      expect(document.documentElement).toHaveClass(THEME_RIPPLE_ACTIVE_CLASS);
    });

    finished.reject(new Error("finished failed"));
    await vi.waitFor(() => {
      expect(document.documentElement).not.toHaveClass(THEME_RIPPLE_ACTIVE_CLASS);
    });
  });

  it("uses instant path while a ripple is already in flight", () => {
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

    applyColorSchemeWithTransition("dark", "ripple", applyScheme, pointerEvent(), button());
    applyScheme.mockClear();
    applyColorSchemeWithTransition("light", "ripple", applyScheme, pointerEvent(), button());

    expect(applyScheme).toHaveBeenCalledOnce();
    expect(applyScheme).toHaveBeenCalledWith("light");
    expect(document.startViewTransition).toHaveBeenCalledTimes(1);
  });
});

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

function domRect(left: number, top: number, width: number, height: number): DOMRectReadOnly {
  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  };
}

function pointerEvent(x = 12, y = 18): Pick<MouseEvent, "detail" | "clientX" | "clientY"> {
  return { detail: 1, clientX: x, clientY: y };
}

function button(): HTMLElement {
  const el = document.createElement("button");
  el.getBoundingClientRect = () =>
    ({
      left: 0,
      top: 0,
      width: 32,
      height: 32,
      right: 32,
      bottom: 32,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }) as DOMRect;
  return el;
}
