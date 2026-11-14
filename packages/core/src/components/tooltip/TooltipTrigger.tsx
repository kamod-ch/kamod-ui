import {
  type ComponentChildren,
  type HTMLAttributes,
  type TargetedFocusEvent,
  type TargetedMouseEvent,
  type TargetedPointerEvent,
} from "preact";
import { assignRef, Slot } from "../../lib/slot";
import { useTooltip } from "./Tooltip";

export type TooltipTriggerProps = HTMLAttributes<HTMLSpanElement> & {
  asChild?: boolean;
  children?: ComponentChildren;
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
  const triggerProps = {
    "data-slot": "tooltip-trigger",
    "data-state": tooltip.open.value ? "open" : "closed",
    "aria-describedby": describedBy ?? ariaDescribedBy,
    onPointerEnter: (event: TargetedPointerEvent<HTMLElement>) => {
      tooltip.openWithDelay();
      onPointerEnter?.(event);
    },
    onPointerLeave: (event: TargetedPointerEvent<HTMLElement>) => {
      tooltip.closeWithDelay();
      onPointerLeave?.(event);
    },
    onMouseEnter: (event: TargetedMouseEvent<HTMLElement>) => {
      tooltip.openWithDelay();
      onMouseEnter?.(event);
    },
    onMouseLeave: (event: TargetedMouseEvent<HTMLElement>) => {
      tooltip.closeWithDelay();
      onMouseLeave?.(event);
    },
    onFocus: (event: TargetedFocusEvent<HTMLElement>) => {
      tooltip.setOpen(true);
      onFocus?.(event);
    },
    onBlur: (event: TargetedFocusEvent<HTMLElement>) => {
      tooltip.setOpen(false);
      onBlur?.(event);
    },
    ref: (node: HTMLElement | null) => {
      assignRef(outerRef, node);
    },
  };

  if (asChild) {
    return (
      <Slot {...remainingProps} {...triggerProps}>
        {children}
      </Slot>
    );
  }

  return (
    <span
      // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      {...triggerProps}
      {...remainingProps}
    >
      {children}
    </span>
  );
};
