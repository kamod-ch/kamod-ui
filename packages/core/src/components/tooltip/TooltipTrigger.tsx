import { cloneElement, isValidElement, type ComponentChildren, type JSX } from "preact";
import { useTooltip } from "./Tooltip";

export type TooltipTriggerProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  asChild?: boolean;
  children?: ComponentChildren;
};

type TooltipTriggerCommonProps = JSX.HTMLAttributes<HTMLElement> & {
  "data-slot"?: string;
  "data-state"?: "open" | "closed";
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
    "aria-describedby": ariaDescribedBy,
    ...remainingProps
  } = rest;
  const describedBy = tooltip.open.value ? tooltip.contentId.value : undefined;
  const commonProps: TooltipTriggerCommonProps = {
    "data-slot": "tooltip-trigger",
    "aria-describedby": describedBy ?? ariaDescribedBy,
    "data-state": tooltip.open.value ? "open" : "closed",
    onPointerEnter: (event) => {
      tooltip.openWithDelay();
      onPointerEnter?.(event as unknown as JSX.TargetedPointerEvent<HTMLElement>);
    },
    onPointerLeave: (event) => {
      tooltip.closeWithDelay();
      onPointerLeave?.(event as unknown as JSX.TargetedPointerEvent<HTMLElement>);
    },
    onMouseEnter: (event) => {
      tooltip.openWithDelay();
      onMouseEnter?.(event as unknown as JSX.TargetedMouseEvent<HTMLElement>);
    },
    onMouseLeave: (event) => {
      tooltip.closeWithDelay();
      onMouseLeave?.(event as unknown as JSX.TargetedMouseEvent<HTMLElement>);
    },
    onFocus: (event) => {
      tooltip.setOpen(true);
      onFocus?.(event as unknown as JSX.TargetedFocusEvent<HTMLElement>);
    },
    onBlur: (event) => {
      tooltip.setOpen(false);
      onBlur?.(event as unknown as JSX.TargetedFocusEvent<HTMLElement>);
    }
  };

  if (asChild) {
    if (!isValidElement(children)) {
      return null;
    }

    const childProps = (children.props ?? {}) as JSX.HTMLAttributes<HTMLElement> & {
      class?: string;
      className?: string;
    };

    return cloneElement(children, {
      ...(childProps ?? {}),
      ...commonProps,
      ...remainingProps
    });
  }

  return (
    <span
      tabIndex={0}
      {...commonProps}
      {...remainingProps}
    >
      {children}
    </span>
  );
};

