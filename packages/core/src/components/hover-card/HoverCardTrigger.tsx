import { cloneElement, isValidElement, type ComponentChildren, type JSX } from "preact";
import { tv } from "tailwind-variants";
import { useHoverCard } from "./HoverCard";

export const hoverCardTrigger = tv({
  base: [
    "border-input bg-background hover:bg-muted inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium shadow-xs transition-colors",
    "outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
  ]
});

export type HoverCardTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
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

    const childProps = (children.props ?? {}) as JSX.HTMLAttributes<HTMLElement> & {
      ref?: unknown;
      onMouseEnter?: (event: JSX.TargetedMouseEvent<HTMLElement>) => void;
      onMouseLeave?: (event: JSX.TargetedMouseEvent<HTMLElement>) => void;
      onFocus?: (event: JSX.TargetedFocusEvent<HTMLElement>) => void;
      onBlur?: (event: JSX.TargetedFocusEvent<HTMLElement>) => void;
    };

    return cloneElement(children, {
      ...(childProps as Record<string, unknown>),
      ...(rest as Record<string, unknown>),
      "data-slot": "hover-card-trigger",
      onMouseEnter: (event: JSX.TargetedMouseEvent<HTMLElement>) => {
        childProps.onMouseEnter?.(event);
        scheduleOpen();
        onMouseEnter?.(event as JSX.TargetedMouseEvent<HTMLButtonElement>);
      },
      onMouseLeave: (event: JSX.TargetedMouseEvent<HTMLElement>) => {
        childProps.onMouseLeave?.(event);
        scheduleClose();
        onMouseLeave?.(event as JSX.TargetedMouseEvent<HTMLButtonElement>);
      },
      onFocus: (event: JSX.TargetedFocusEvent<HTMLElement>) => {
        childProps.onFocus?.(event);
        scheduleOpen();
        onFocus?.(event as JSX.TargetedFocusEvent<HTMLButtonElement>);
      },
      onBlur: (event: JSX.TargetedFocusEvent<HTMLElement>) => {
        childProps.onBlur?.(event);
        scheduleClose();
        onBlur?.(event as JSX.TargetedFocusEvent<HTMLButtonElement>);
      },
      ref: (node: HTMLElement | null) => {
        callRef(childProps.ref, node);
        callRef(outerRef, node);
      }
    } as never);
  }

  return (
    <button
      ref={(node) => {
        callRef(outerRef, node);
      }}
      type="button"
      data-slot="hover-card-trigger"
      class={hoverCardTrigger({ class: className as string | undefined })}
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
