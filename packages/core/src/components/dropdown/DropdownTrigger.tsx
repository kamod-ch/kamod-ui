import { type ButtonHTMLAttributes, type ComponentChildren, type TargetedMouseEvent } from "preact";
import { tv } from "tailwind-variants";
import { assignRef, Slot } from "../../lib/slot";
import { cn } from "../../lib/utils";
import { useDropdown } from "./Dropdown";

const dropdownTrigger = tv({
  base: [
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap",
    "focus-visible:ring-outline/50 transition-[color,box-shadow] outline-none focus-visible:ring-3",
    "disabled:pointer-events-none disabled:opacity-50",
    "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
    "h-9 px-4 py-2",
  ],
});

export type DropdownTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  children?: ComponentChildren;
};

export const DropdownTrigger = ({
  asChild = false,
  class: className,
  children,
  onClick,
  onKeyDown,
  ref: outerRef,
  ...rest
}: DropdownTriggerProps) => {
  const dropdown = useDropdown();

  const handleClick = (event: TargetedMouseEvent<HTMLElement>) => {
    onClick?.(event as TargetedMouseEvent<HTMLButtonElement>);
    const intent = dropdown.clickIntentRef.current;
    dropdown.triggerClickHandledRef.current = true;
    if (event.defaultPrevented) {
      if (intent !== null && dropdown.open.value === intent) dropdown.setOpen(!intent);
      return;
    }
    dropdown.setOpen(intent === null ? !dropdown.open.value : intent);
  };

  const handleKeyDown: NonNullable<ButtonHTMLAttributes<HTMLButtonElement>["onKeyDown"]> = (
    event,
  ) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!dropdown.open.value) {
        dropdown.setOpen(true);
      }
    }
  };

  const triggerRef = (node: HTMLElement | null) => {
    dropdown.triggerRef.current = node;
    assignRef(outerRef, node);
  };

  if (asChild) {
    return (
      <Slot
        {...rest}
        id={dropdown.triggerId}
        aria-controls={dropdown.contentId}
        aria-haspopup="menu"
        aria-expanded={dropdown.open.value}
        data-slot="dropdown-trigger"
        data-state={dropdown.open.value ? "open" : "closed"}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        ref={triggerRef}
      >
        {children}
      </Slot>
    );
  }

  return (
    <button
      ref={triggerRef}
      id={dropdown.triggerId}
      type="button"
      class={cn(dropdownTrigger(), className)}
      data-slot="dropdown-trigger"
      data-state={dropdown.open.value ? "open" : "closed"}
      aria-controls={dropdown.contentId}
      aria-haspopup="menu"
      aria-expanded={dropdown.open.value}
      onClick={(event) => handleClick(event as unknown as TargetedMouseEvent<HTMLElement>)}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </button>
  );
};
