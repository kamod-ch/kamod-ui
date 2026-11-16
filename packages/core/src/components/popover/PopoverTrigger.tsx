import { useComputed } from "@preact/signals";
import { type ButtonHTMLAttributes, type ComponentChildren, type TargetedMouseEvent } from "preact";
import { tv } from "tailwind-variants";
import { assignRef, Slot } from "../../lib/slot";
import { cn } from "../../lib/utils";
import { usePopover } from "./Popover";

export const popoverTrigger = tv({
  base: [
    "inline-flex items-center justify-center",
    "focus-visible:ring-outline/50 transition-[color,box-shadow] outline-none focus-visible:ring-3",
    "disabled:pointer-events-none",
  ],
});

export type PopoverTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  children?: ComponentChildren;
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
  const expanded = useComputed(() => popover.open.value);
  const dataState = useComputed(() => (popover.open.value ? "open" : "closed"));

  const handleClick = (event: TargetedMouseEvent<HTMLElement>) => {
    onClick?.(event as TargetedMouseEvent<HTMLButtonElement>);
    if (event.defaultPrevented) return;
    popover.setOpen(!popover.open.value);
  };

  const triggerRef = (node: HTMLElement | null) => {
    popover.triggerRef.current = node;
    assignRef(outerRef, node);
  };

  if (asChild) {
    return (
      <Slot
        {...rest}
        id={popover.triggerId}
        aria-controls={popover.contentId}
        aria-haspopup="dialog"
        aria-expanded={expanded}
        data-slot="popover-trigger"
        data-state={dataState}
        onClick={handleClick}
        ref={triggerRef}
      >
        {children}
      </Slot>
    );
  }

  return (
    <button
      ref={triggerRef}
      id={popover.triggerId}
      type="button"
      class={cn(popoverTrigger(), className)}
      data-slot="popover-trigger"
      data-state={dataState}
      aria-controls={popover.contentId}
      aria-haspopup="dialog"
      aria-expanded={expanded}
      onClick={(event) => handleClick(event as unknown as TargetedMouseEvent<HTMLElement>)}
      {...rest}
    >
      {children}
    </button>
  );
};
