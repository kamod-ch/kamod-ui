const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

export const getFocusableElements = (root: HTMLElement): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      !element.hasAttribute("disabled") &&
      element.getAttribute("aria-hidden") !== "true" &&
      element.tabIndex !== -1,
  );

export type TrapFocusOptions = {
  /** When true (default), focus the container on mount if it is focusable. */
  focusContainer?: boolean;
};

/**
 * Keeps keyboard focus inside `container` while active. Returns a dispose function.
 */
export const trapFocus = (container: HTMLElement, options: TrapFocusOptions = {}): (() => void) => {
  const { focusContainer = true } = options;

  const focusInitial = () => {
    if (focusContainer && container.tabIndex >= -1) {
      container.focus();
      return;
    }
    getFocusableElements(container)[0]?.focus();
  };

  requestAnimationFrame(focusInitial);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Tab") return;

    const focusables = getFocusableElements(container);
    if (focusables.length === 0) {
      event.preventDefault();
      container.focus();
      return;
    }

    const first = focusables[0]!;
    const last = focusables[focusables.length - 1]!;
    const active = document.activeElement;

    if (event.shiftKey) {
      if (active === first || !container.contains(active)) {
        event.preventDefault();
        last.focus();
      }
      return;
    }

    if (active === last || !container.contains(active)) {
      event.preventDefault();
      first.focus();
    }
  };

  container.addEventListener("keydown", onKeyDown);
  return () => container.removeEventListener("keydown", onKeyDown);
};
