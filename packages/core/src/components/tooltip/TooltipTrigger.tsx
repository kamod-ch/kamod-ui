import {
  type ComponentChildren,
  cloneElement,
  type HTMLAttributes,
  isValidElement,
  type TargetedFocusEvent,
  type TargetedMouseEvent,
  type TargetedPointerEvent,
} from "preact";
import { useTooltip } from "./Tooltip";

export type TooltipTriggerProps = HTMLAttributes<HTMLSpanElement> & {
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

export const TooltipTrigger = ({ asChild = false, children, ...rest }: TooltipTriggerProps) => {
  const tooltip = useTooltip();
  const {
    onMouseEnter,
    onMouseLeave,
    onPointerEnter,
    onPointerLeave,
    onFocus,
    onBlur,
    ref: outerRef,
    "aria-describedby": ariaDescribedBy,
    ...remainingProps
  } = rest;
  const describedBy = tooltip.open.value ? tooltip.contentId.value : undefined;

  const runPointerEnter = (
    event: TargetedPointerEvent<HTMLElement>,
    childHandler?: (event: TargetedPointerEvent<HTMLElement>) => void,
  ) => {
    childHandler?.(event);
    tooltip.openWithDelay();
    onPointerEnter?.(event);
  };

  const runPointerLeave = (
    event: TargetedPointerEvent<HTMLElement>,
    childHandler?: (event: TargetedPointerEvent<HTMLElement>) => void,
  ) => {
    childHandler?.(event);
    tooltip.closeWithDelay();
    onPointerLeave?.(event);
  };

  const runMouseEnter = (
    event: TargetedMouseEvent<HTMLElement>,
    childHandler?: (event: TargetedMouseEvent<HTMLElement>) => void,
  ) => {
    childHandler?.(event);
    tooltip.openWithDelay();
    onMouseEnter?.(event);
  };

  const runMouseLeave = (
    event: TargetedMouseEvent<HTMLElement>,
    childHandler?: (event: TargetedMouseEvent<HTMLElement>) => void,
  ) => {
    childHandler?.(event);
    tooltip.closeWithDelay();
    onMouseLeave?.(event);
  };

  const runFocus = (
    event: TargetedFocusEvent<HTMLElement>,
    childHandler?: (event: TargetedFocusEvent<HTMLElement>) => void,
  ) => {
    childHandler?.(event);
    tooltip.setOpen(true);
    onFocus?.(event);
  };

  const runBlur = (
    event: TargetedFocusEvent<HTMLElement>,
    childHandler?: (event: TargetedFocusEvent<HTMLElement>) => void,
  ) => {
    childHandler?.(event);
    tooltip.setOpen(false);
    onBlur?.(event);
  };

  if (asChild) {
    if (!isValidElement(children)) {
      return null;
    }

    const childProps = (children.props ?? {}) as HTMLAttributes<HTMLElement> & {
      ref?: unknown;
      class?: string;
      className?: string;
    };

    return cloneElement(children, {
      ...(childProps as Record<string, unknown>),
      ...(remainingProps as Record<string, unknown>),
      "data-slot": "tooltip-trigger",
      "data-state": tooltip.open.value ? "open" : "closed",
      "aria-describedby": describedBy ?? ariaDescribedBy,
      onPointerEnter: (event: TargetedPointerEvent<HTMLElement>) => {
        runPointerEnter(event, childProps.onPointerEnter);
      },
      onPointerLeave: (event: TargetedPointerEvent<HTMLElement>) => {
        runPointerLeave(event, childProps.onPointerLeave);
      },
      onMouseEnter: (event: TargetedMouseEvent<HTMLElement>) => {
        runMouseEnter(event, childProps.onMouseEnter);
      },
      onMouseLeave: (event: TargetedMouseEvent<HTMLElement>) => {
        runMouseLeave(event, childProps.onMouseLeave);
      },
      onFocus: (event: TargetedFocusEvent<HTMLElement>) => {
        runFocus(event, childProps.onFocus);
      },
      onBlur: (event: TargetedFocusEvent<HTMLElement>) => {
        runBlur(event, childProps.onBlur);
      },
      ref: (node: HTMLElement | null) => {
        callRef(childProps.ref, node);
        callRef(outerRef, node);
      },
    } as never);
  }

  return (
    <span
      // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      data-slot="tooltip-trigger"
      data-state={tooltip.open.value ? "open" : "closed"}
      aria-describedby={describedBy ?? ariaDescribedBy}
      onPointerEnter={(event) => {
        runPointerEnter(event);
      }}
      onPointerLeave={(event) => {
        runPointerLeave(event);
      }}
      onMouseEnter={(event) => {
        runMouseEnter(event);
      }}
      onMouseLeave={(event) => {
        runMouseLeave(event);
      }}
      onFocus={(event) => {
        runFocus(event);
      }}
      onBlur={(event) => {
        runBlur(event);
      }}
      ref={(node) => callRef(outerRef, node)}
      {...remainingProps}
    >
      {children}
    </span>
  );
};
