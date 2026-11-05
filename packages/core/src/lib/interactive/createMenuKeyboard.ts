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

export const resolveMenuDirection = (node: HTMLElement): "ltr" | "rtl" => {
  const scoped = node.closest("[dir]");
  const dir = scoped?.getAttribute("dir") ?? node.ownerDocument.documentElement.getAttribute("dir");
  return dir === "rtl" ? "rtl" : "ltr";
};

export type SubmenuSide = "inline-end" | "inline-start";

export const getSubmenuOpenCloseKeys = (
  direction: "ltr" | "rtl",
  side: SubmenuSide = "inline-end",
): { open: "ArrowLeft" | "ArrowRight"; close: "ArrowLeft" | "ArrowRight" } => {
  const towardInlineEnd = side === "inline-end";
  if (direction === "ltr") {
    return towardInlineEnd
      ? { open: "ArrowRight", close: "ArrowLeft" }
      : { open: "ArrowLeft", close: "ArrowRight" };
  }
  return towardInlineEnd
    ? { open: "ArrowLeft", close: "ArrowRight" }
    : { open: "ArrowRight", close: "ArrowLeft" };
};

export const getSubmenuRoot = (node: HTMLElement) =>
  node.closest<HTMLElement>('[data-slot$="-sub"]');

export const getSubmenuTrigger = (subRoot: HTMLElement) =>
  subRoot.querySelector<HTMLElement>('[data-slot$="-sub-trigger"]');

export const getSubmenuContent = (subRoot: HTMLElement) =>
  subRoot.querySelector<HTMLElement>('[data-slot$="-sub-content"]');

export type MenuSubTriggerKeyDownOptions = {
  side?: SubmenuSide;
  onOpen: () => void;
};

export const handleMenuSubTriggerKeyDown = (
  event: KeyboardEvent,
  trigger: HTMLElement,
  options: MenuSubTriggerKeyDownOptions,
) => {
  const { open: openKey } = getSubmenuOpenCloseKeys(
    resolveMenuDirection(trigger),
    options.side ?? "inline-end",
  );
  if (event.key !== openKey) return;
  event.preventDefault();
  options.onOpen();
};

export type MenuSubContentKeyDownOptions = {
  side?: SubmenuSide;
  onCloseSubmenu: () => void;
  getParentTrigger: () => HTMLElement | null;
};

export const handleMenuSubContentKeyDown = (
  event: KeyboardEvent,
  menuRoot: HTMLElement,
  options: MenuSubContentKeyDownOptions,
) => {
  const { close: closeKey } = getSubmenuOpenCloseKeys(
    resolveMenuDirection(menuRoot),
    options.side ?? "inline-end",
  );

  if (event.key === closeKey || event.key === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    options.onCloseSubmenu();
    options.getParentTrigger()?.focus();
    return;
  }

  handleMenuContentKeyDown(event, menuRoot);
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
