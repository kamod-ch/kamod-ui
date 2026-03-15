import { cloneElement, isValidElement, type ComponentChildren, type JSX } from "preact";
import { tv } from "tailwind-variants";
import { usePopover } from "./Popover";

export const popoverTrigger = tv({
  base: [
    "inline-flex items-center justify-center",
    "focus-visible:ring-outline/50 transition-[color,box-shadow] outline-none focus-visible:ring-3",
    "disabled:pointer-events-none"
  ]
});

export type PopoverTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
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

export const PopoverTrigger = ({
  asChild = false,
  class: className,
  children,
  onClick,
  ref: outerRef,
  ...rest
}: PopoverTriggerProps) => {
  const popover = usePopover();

  const handleClick = (event: JSX.TargetedMouseEvent<HTMLElement>) => {
    onClick?.(event as JSX.TargetedMouseEvent<HTMLButtonElement>);
    if (event.defaultPrevented) return;
    popover.setOpen(!popover.open.value);
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
      id: popover.triggerId,
      "aria-controls": popover.contentId,
      "aria-haspopup": "dialog",
      "aria-expanded": popover.open.value,
      "data-slot": "popover-trigger",
      "data-state": popover.open.value ? "open" : "closed",
      onClick: (event: JSX.TargetedMouseEvent<HTMLElement>) => {
        childProps.onClick?.(event);
        handleClick(event);
      },
      ref: (node: HTMLElement | null) => {
        popover.triggerRef.current = node;
        callRef(childProps.ref, node);
        callRef(outerRef, node);
      }
    } as never);
  }

  return (
    <button
      ref={(node) => {
        popover.triggerRef.current = node;
        callRef(outerRef, node);
      }}
      id={popover.triggerId}
      type="button"
      class={popoverTrigger({ class: className as string | undefined })}
      data-slot="popover-trigger"
      data-state={popover.open.value ? "open" : "closed"}
      aria-controls={popover.contentId}
      aria-haspopup="dialog"
      aria-expanded={popover.open.value}
      onClick={(event) => handleClick(event as unknown as JSX.TargetedMouseEvent<HTMLElement>)}
      {...rest}
    >
      {children}
    </button>
  );
};
