import { createRovingFocus } from "./createRovingFocus";

export const enabledMenuItemSelector =
  ':is([role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]):not([disabled]):not([aria-disabled="true"]):not([data-disabled="true"])';

export const getEnabledMenuItems = (menuRoot: HTMLElement) =>
  Array.from(menuRoot.querySelectorAll<HTMLElement>(enabledMenuItemSelector));

export type MenuContentKeyDownOptions = {
  onEscape?: () => void;
};

export const focusInitialMenuItem = (menuRoot: HTMLElement) => {
  const items = getEnabledMenuItems(menuRoot);
  (items[0] ?? menuRoot).focus();
};

export const handleMenuContentKeyDown = (
  event: KeyboardEvent,
  menuRoot: HTMLElement,
  options?: MenuContentKeyDownOptions,
) => {
  switch (event.key) {
    case "ArrowDown":
    case "ArrowUp":
    case "Home":
    case "End": {
      event.preventDefault();
      const items = getEnabledMenuItems(menuRoot);
      if (items.length === 0) {
        menuRoot.focus();
        return;
      }
      const active = menuRoot.ownerDocument.activeElement as HTMLElement | null;
      const currentIndex = active ? items.indexOf(active) : -1;
      const focus = createRovingFocus(items.length, currentIndex);
      if (event.key === "ArrowDown") focus.moveNext();
      else if (event.key === "ArrowUp") focus.movePrev();
      else if (event.key === "Home") focus.moveFirst();
      else focus.moveLast();
      items[focus.activeIndex.value]?.focus();
      return;
    }
    case "Enter":
    case " ": {
      const active = menuRoot.ownerDocument.activeElement;
      if (
        active instanceof HTMLElement &&
        active.matches(enabledMenuItemSelector) &&
        menuRoot.contains(active)
      ) {
        event.preventDefault();
        active.click();
      }
      return;
    }
    case "Escape": {
      event.preventDefault();
      options?.onEscape?.();
      return;
    }
    default:
      break;
  }
};
