/**
 * @file Keyboard and selection adapters shared by the shell's navigation and account menus.
 * Kamod Dropdown owns open state, dismissal and Escape focus return. These adapters add
 * initial focus and menu-key navigation through its public useDropdown context.
 */
import { DropdownContent, DropdownItem, DropdownTrigger, useDropdown } from "@kamod-ch/ui";
import { createRovingFocus } from "@kamod-ch/ui/lib/interactive";
import type { ComponentProps, JSX } from "preact";
import { useLayoutEffect } from "preact/hooks";

/**
 * Opens the surrounding Dropdown with ArrowDown or ArrowUp, retaining native click behavior.
 * MenuContent focuses the first enabled item after opening with either arrow key.
 *
 * @param props - DropdownTrigger props; a supplied key handler runs first and may cancel handling.
 */
export const MenuTrigger = (props: ComponentProps<typeof DropdownTrigger>) => {
  const { setOpen } = useDropdown();
  return (
    <DropdownTrigger
      {...props}
      onKeyDown={(event) => {
        props.onKeyDown?.(event);
        if (!event.defaultPrevented && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
          event.preventDefault();
          setOpen(true);
        }
      }}
    />
  );
};

/** Collects enabled menu items in DOM order for initial focus and arrow-key traversal. */
const enabledItems = (root: HTMLElement) =>
  Array.from(
    root.querySelectorAll<HTMLElement>(
      '[role="menuitem"]:not([disabled]):not([aria-disabled="true"])',
    ),
  );

/**
 * Focuses the first enabled item on open and adds wrapping ArrowUp/ArrowDown traversal.
 * Home and End select the first and last enabled items. If every item is disabled, the menu
 * itself receives focus so Escape still works. Other keys retain Dropdown behavior.
 * DOM access is limited to the layout effect and event handlers, allowing server rendering.
 *
 * @param props - DropdownContent props; positioning is inherited and key handlers may cancel handling.
 * @remarks Must share a Dropdown ancestor with MenuTrigger and MenuItem.
 */
export const MenuContent = (props: ComponentProps<typeof DropdownContent>) => {
  const { open, contentRef } = useDropdown();
  const isOpen = open.value;
  useLayoutEffect(() => {
    const content = contentRef.current;
    if (isOpen && content) (enabledItems(content)[0] ?? content).focus();
  }, [isOpen, contentRef]);
  return (
    <DropdownContent
      {...props}
      onKeyDown={(event) => {
        props.onKeyDown?.(event);
        if (event.defaultPrevented || !["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key))
          return;
        event.preventDefault();
        const items = enabledItems(event.currentTarget);
        const focus = createRovingFocus(
          items.length,
          items.indexOf(event.currentTarget.ownerDocument.activeElement as HTMLElement),
        );
        if (event.key === "ArrowDown") focus.moveNext();
        else if (event.key === "ArrowUp") focus.movePrev();
        else if (event.key === "Home") focus.moveFirst();
        else focus.moveLast();
        items[focus.activeIndex.value]?.focus();
      }}
    />
  );
};

/** Click event for DropdownItem's link and button render modes. */
type MenuEvent = JSX.TargetedMouseEvent<HTMLAnchorElement | HTMLButtonElement>;

/**
 * Runs an enabled item's selection handler, then closes the menu and refocuses its trigger.
 * Router callbacks may cancel native navigation without preventing this menu dismissal.
 *
 * @param props - DropdownItem props; native links and disabled behavior remain with the primitive.
 */
export const MenuItem = ({ onClick, ...props }: ComponentProps<typeof DropdownItem>) => {
  const { setOpen, triggerRef } = useDropdown();
  return (
    <DropdownItem
      {...props}
      onClick={(event: MenuEvent) => {
        (onClick as ((event: MenuEvent) => void) | undefined)?.(event);
        // A router cancels native navigation, but selecting the destination should
        // still dismiss the menu, including when it is already the current page.
        setOpen(false);
        triggerRef.current?.focus();
      }}
    />
  );
};
