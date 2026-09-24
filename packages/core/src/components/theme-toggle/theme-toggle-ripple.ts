import type { ColorScheme } from "@kamod-ch/themes";

export type ThemeToggleTransition = "instant" | "ripple";

export const THEME_RIPPLE_ACTIVE_CLASS = "kamod-theme-ripple-active";

let rippleTransitionInFlight = false;

export const resetThemeRippleStateForTests = (): void => {
  rippleTransitionInFlight = false;
  if (typeof document !== "undefined") {
    document.documentElement.classList.remove(THEME_RIPPLE_ACTIVE_CLASS);
  }
};

export const isThemeRippleTransitionInFlight = (): boolean => rippleTransitionInFlight;

export const clampViewportCoordinate = (value: number, max: number): number =>
  Math.min(Math.max(value, 0), max);

export const getThemeRippleMetrics = (
  event: Pick<MouseEvent, "detail" | "clientX" | "clientY">,
  button: HTMLElement | DOMRectReadOnly,
  viewport: Pick<Window, "innerWidth" | "innerHeight">,
): { x: number; y: number; endRadius: number } => {
  const rect = "getBoundingClientRect" in button ? button.getBoundingClientRect() : button;
  let x: number;
  let y: number;
  if (event.detail === 0) {
    x = rect.left + rect.width / 2;
    y = rect.top + rect.height / 2;
  } else {
    x = event.clientX;
    y = event.clientY;
  }
  x = clampViewportCoordinate(x, viewport.innerWidth);
  y = clampViewportCoordinate(y, viewport.innerHeight);
  const endRadius = Math.hypot(
    Math.max(x, viewport.innerWidth - x),
    Math.max(y, viewport.innerHeight - y),
  );
  return { x, y, endRadius };
};

export const canUseThemeRipple = (transition: ThemeToggleTransition): boolean => {
  if (transition !== "ripple") {
    return false;
  }
  if (typeof document === "undefined" || typeof window === "undefined") {
    return false;
  }
  if (typeof document.startViewTransition !== "function") {
    return false;
  }
  if (typeof document.documentElement.animate !== "function") {
    return false;
  }
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return false;
    }
  } catch {
    return false;
  }
  return true;
};

const clearRippleActiveClass = (): void => {
  document.documentElement.classList.remove(THEME_RIPPLE_ACTIVE_CLASS);
  rippleTransitionInFlight = false;
};

export const applyColorSchemeWithTransition = (
  next: ColorScheme,
  transition: ThemeToggleTransition,
  applyScheme: (scheme: ColorScheme) => void,
  event: Pick<MouseEvent, "detail" | "clientX" | "clientY">,
  originElement: HTMLElement,
): void => {
  if (!canUseThemeRipple(transition) || rippleTransitionInFlight) {
    applyScheme(next);
    return;
  }

  const { x, y, endRadius } = getThemeRippleMetrics(event, originElement, window);

  document.documentElement.classList.add(THEME_RIPPLE_ACTIVE_CLASS);
  rippleTransitionInFlight = true;

  let viewTransition: ViewTransition;
  try {
    viewTransition = document.startViewTransition(() => {
      applyScheme(next);
    });
  } catch {
    clearRippleActiveClass();
    applyScheme(next);
    return;
  }

  const finishRipple = (): void => {
    clearRippleActiveClass();
  };

  void viewTransition.ready
    .then(() => {
      document.documentElement.animate(
        [
          { clipPath: `circle(0px at ${x}px ${y}px)` },
          { clipPath: `circle(${endRadius}px at ${x}px ${y}px)` },
        ],
        {
          duration: 450,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
          fill: "both",
        },
      );
    })
    .catch(() => {});

  void viewTransition.finished.then(finishRipple).catch(finishRipple);
};
