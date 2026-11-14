import {
  type ButtonHTMLAttributes,
  type ComponentChildren,
  type TargetedFocusEvent,
  type TargetedMouseEvent,
} from "preact";
import { tv } from "tailwind-variants";
import { assignRef, Slot } from "../../lib/slot";
import { cn } from "../../lib/utils";
import { useHoverCard } from "./HoverCard";

const hoverCardTrigger = tv({
  base: [
    "border-input bg-background hover:bg-muted inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium shadow-xs transition-colors",
    "outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
  ],
});

export type HoverCardTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  children?: ComponentChildren;
};

export const HoverCardTrigger = ({
  asChild = false,
  class: className,
  children,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
  ref: outerRef,
  ...rest
}: HoverCardTriggerProps) => {
  const { scheduleOpen, scheduleClose } = useHoverCard();

  const triggerRef = (node: HTMLElement | null) => {
    assignRef(outerRef, node);
  };

  if (asChild) {
    return (
      <Slot
        {...rest}
        data-slot="hover-card-trigger"
        ref={triggerRef}
        onMouseEnter={(event: TargetedMouseEvent<HTMLElement>) => {
          scheduleOpen();
          onMouseEnter?.(event as TargetedMouseEvent<HTMLButtonElement>);
        }}
        onMouseLeave={(event: TargetedMouseEvent<HTMLElement>) => {
          scheduleClose();
          onMouseLeave?.(event as TargetedMouseEvent<HTMLButtonElement>);
        }}
        onFocus={(event: TargetedFocusEvent<HTMLElement>) => {
          scheduleOpen();
          onFocus?.(event as TargetedFocusEvent<HTMLButtonElement>);
        }}
        onBlur={(event: TargetedFocusEvent<HTMLElement>) => {
          scheduleClose();
          onBlur?.(event as TargetedFocusEvent<HTMLButtonElement>);
        }}
      >
        {children}
      </Slot>
    );
  }

  return (
    <button
      ref={triggerRef}
      type="button"
      data-slot="hover-card-trigger"
      class={cn(hoverCardTrigger(), className)}
      {...rest}
      onMouseEnter={(event) => {
        scheduleOpen();
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        scheduleClose();
        onMouseLeave?.(event);
      }}
      onFocus={(event) => {
        scheduleOpen();
        onFocus?.(event);
      }}
      onBlur={(event) => {
        scheduleClose();
        onBlur?.(event);
      }}
    >
      {children}
    </button>
  );
};
