import {
  type ButtonHTMLAttributes,
  type ComponentChildren,
  cloneElement,
  type HTMLAttributes,
  isValidElement,
  type TargetedFocusEvent,
  type TargetedMouseEvent,
} from "preact";
import { tv } from "tailwind-variants";
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

const callRef = <T extends HTMLElement>(ref: unknown, node: T | null) => {
  if (typeof ref === "function") {
    ref(node);
  } else if (ref && typeof ref === "object" && "current" in ref) {
    (ref as { current: T | null }).current = node;
  }
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

  if (asChild) {
    if (!isValidElement(children)) {
      return null;
    }

    const childProps = (children.props ?? {}) as HTMLAttributes<HTMLElement> & {
      ref?: unknown;
      onMouseEnter?: (event: TargetedMouseEvent<HTMLElement>) => void;
      onMouseLeave?: (event: TargetedMouseEvent<HTMLElement>) => void;
      onFocus?: (event: TargetedFocusEvent<HTMLElement>) => void;
      onBlur?: (event: TargetedFocusEvent<HTMLElement>) => void;
    };

    return cloneElement(children, {
      ...(childProps as Record<string, unknown>),
      ...(rest as Record<string, unknown>),
      "data-slot": "hover-card-trigger",
      onMouseEnter: (event: TargetedMouseEvent<HTMLElement>) => {
        childProps.onMouseEnter?.(event);
        scheduleOpen();
        onMouseEnter?.(event as TargetedMouseEvent<HTMLButtonElement>);
      },
      onMouseLeave: (event: TargetedMouseEvent<HTMLElement>) => {
        childProps.onMouseLeave?.(event);
        scheduleClose();
        onMouseLeave?.(event as TargetedMouseEvent<HTMLButtonElement>);
      },
      onFocus: (event: TargetedFocusEvent<HTMLElement>) => {
        childProps.onFocus?.(event);
        scheduleOpen();
        onFocus?.(event as TargetedFocusEvent<HTMLButtonElement>);
      },
      onBlur: (event: TargetedFocusEvent<HTMLElement>) => {
        childProps.onBlur?.(event);
        scheduleClose();
        onBlur?.(event as TargetedFocusEvent<HTMLButtonElement>);
      },
      ref: (node: HTMLElement | null) => {
        callRef(childProps.ref, node);
        callRef(outerRef, node);
      },
    } as never);
  }

  return (
    <button
      ref={(node) => {
        callRef(outerRef, node);
      }}
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
