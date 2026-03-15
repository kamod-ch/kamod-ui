import { cloneElement, isValidElement, type ComponentChildren, type JSX } from "preact";
import { tv } from "tailwind-variants";
import { useDropdown } from "./Dropdown";

export const dropdownTrigger = tv({
  base: [
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap",
    "focus-visible:ring-outline/50 transition-[color,box-shadow] outline-none focus-visible:ring-3",
    "disabled:pointer-events-none disabled:opacity-50",
    "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
    "h-9 px-4 py-2"
  ]
});

export type DropdownTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  children?: ComponentChildren;
};

const callRef = <T extends HTMLElement>(ref: unknown, node: T | null) => {
  if (typeof ref === "function") {
    ref(node);
  } else if (ref && typeof ref === "object" && "current" in ref) {
    (ref as { current: T | null }).current = node;
  }
};

export const DropdownTrigger = ({
  asChild = false,
  class: className,
  children,
  onClick,
  ref: outerRef,
  ...rest
}: DropdownTriggerProps) => {
  const dropdown = useDropdown();

  const handleClick = (event: JSX.TargetedMouseEvent<HTMLElement>) => {
    onClick?.(event as JSX.TargetedMouseEvent<HTMLButtonElement>);
    if (event.defaultPrevented) return;
    dropdown.setOpen(!dropdown.open.value);
  };

  if (asChild) {
    if (!isValidElement(children)) {
      return null;
    }

    const childProps = (children.props ?? {}) as JSX.HTMLAttributes<HTMLElement> & {
      ref?: unknown;
      onClick?: (event: JSX.TargetedMouseEvent<HTMLElement>) => void;
    };

    return cloneElement(children, {
      ...(childProps as Record<string, unknown>),
      ...(rest as Record<string, unknown>),
      id: dropdown.triggerId,
      "aria-controls": dropdown.contentId,
      "aria-haspopup": "menu",
      "aria-expanded": dropdown.open.value,
      "data-slot": "dropdown-trigger",
      "data-state": dropdown.open.value ? "open" : "closed",
      onClick: (event: JSX.TargetedMouseEvent<HTMLElement>) => {
        childProps.onClick?.(event);
        handleClick(event);
      },
      ref: (node: HTMLElement | null) => {
        dropdown.triggerRef.current = node;
        callRef(childProps.ref, node);
        callRef(outerRef, node);
      }
    } as never);
  }

  return (
    <button
      ref={(node) => {
        dropdown.triggerRef.current = node;
        callRef(outerRef, node);
      }}
      id={dropdown.triggerId}
      type="button"
      class={dropdownTrigger({ class: className as string | undefined })}
      data-slot="dropdown-trigger"
      data-state={dropdown.open.value ? "open" : "closed"}
      aria-controls={dropdown.contentId}
      aria-haspopup="menu"
      aria-expanded={dropdown.open.value}
      onClick={(event) => handleClick(event as unknown as JSX.TargetedMouseEvent<HTMLElement>)}
      {...rest}
    >
      {children}
    </button>
  );
};
