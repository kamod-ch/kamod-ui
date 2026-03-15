import { cloneElement, isValidElement, type ComponentChildren, type JSX } from "preact";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "preact/hooks";
import { useTooltip } from "./Tooltip";

export type TooltipContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number;
  forceMount?: boolean;
  children?: ComponentChildren;
};

type TooltipContentCommonProps = JSX.HTMLAttributes<HTMLDivElement> & {
  "data-slot"?: string;
  "data-state"?: "open" | "closed";
  "data-side"?: NonNullable<TooltipContentProps["side"]>;
  "data-align"?: NonNullable<TooltipContentProps["align"]>;
  "data-flip-animating"?: "true" | "false";
};

export const TooltipContent = ({
  asChild = false,
  side = "top",
  align = "center",
  sideOffset = 8,
  alignOffset = 0,
  collisionPadding = 8,
  forceMount = false,
  children,
  ...rest
}: TooltipContentProps) => {
  const tooltip = useTooltip();
  const contentId = useId();
  const contentRef = useRef<HTMLElement | null>(null);
  const [resolvedSide, setResolvedSide] = useState(side);
  const prevSideRef = useRef(side);
  const flipTimerRef = useRef<number | null>(null);
  const [isFlipAnimating, setIsFlipAnimating] = useState(false);
  const [dynamicClamp, setDynamicClamp] = useState<JSX.CSSProperties>({});
  const [arrowStyle, setArrowStyle] = useState<JSX.CSSProperties>({});
  const { onMouseEnter, onMouseLeave, style, ...remainingProps } = rest;

  useEffect(() => {
    tooltip.setContentId(contentId);
    return () => {
      tooltip.setContentId(undefined);
    };
  }, [contentId, tooltip]);

  useEffect(() => {
    setResolvedSide(side);
  }, [side, tooltip.open.value]);

  useEffect(
    () => () => {
      if (flipTimerRef.current !== null) {
        window.clearTimeout(flipTimerRef.current);
        flipTimerRef.current = null;
      }
    },
    []
  );

  useLayoutEffect(() => {
    if (!tooltip.open.value || !contentRef.current) return;
    const contentEl = contentRef.current;
    const triggerRect = contentEl.parentElement?.getBoundingClientRect();
    const contentRect = contentEl.getBoundingClientRect();
    if (!triggerRect) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const fitsTop = triggerRect.top >= contentRect.height + sideOffset + collisionPadding;
    const fitsBottom = viewportHeight - triggerRect.bottom >= contentRect.height + sideOffset + collisionPadding;
    const fitsLeft = triggerRect.left >= contentRect.width + sideOffset + collisionPadding;
    const fitsRight = viewportWidth - triggerRect.right >= contentRect.width + sideOffset + collisionPadding;

    let nextSide = side;
    if (side === "top" && !fitsTop && fitsBottom) nextSide = "bottom";
    if (side === "bottom" && !fitsBottom && fitsTop) nextSide = "top";
    if (side === "left" && !fitsLeft && fitsRight) nextSide = "right";
    if (side === "right" && !fitsRight && fitsLeft) nextSide = "left";
    if (nextSide !== resolvedSide) {
      setResolvedSide(nextSide);
    }
    if (tooltip.open.value && nextSide !== prevSideRef.current) {
      setIsFlipAnimating(true);
      if (flipTimerRef.current !== null) {
        window.clearTimeout(flipTimerRef.current);
      }
      flipTimerRef.current = window.setTimeout(() => {
        setIsFlipAnimating(false);
        flipTimerRef.current = null;
      }, 140);
      prevSideRef.current = nextSide;
    }

    const nextClamp: JSX.CSSProperties = {};
    if (nextSide === "top" || nextSide === "bottom") {
      const left = contentRect.left;
      const right = contentRect.right;
      if (left < collisionPadding) {
        nextClamp.left = `${collisionPadding}px`;
        nextClamp.transform = "none";
      } else if (right > viewportWidth - collisionPadding) {
        nextClamp.right = `${collisionPadding}px`;
        nextClamp.left = "auto";
        nextClamp.transform = "none";
      }
    } else {
      const top = contentRect.top;
      const bottom = contentRect.bottom;
      if (top < collisionPadding) {
        nextClamp.top = `${collisionPadding}px`;
        nextClamp.transform = "none";
      } else if (bottom > viewportHeight - collisionPadding) {
        nextClamp.bottom = `${collisionPadding}px`;
        nextClamp.top = "auto";
        nextClamp.transform = "none";
      }
    }
    setDynamicClamp(nextClamp);

    const arrowInset = 12;
    const nextArrowStyle: JSX.CSSProperties = {};
    if (nextSide === "top" || nextSide === "bottom") {
      const triggerCenterX = triggerRect.left + triggerRect.width / 2;
      const desired = triggerCenterX - contentRect.left;
      const clamped = Math.max(arrowInset, Math.min(contentRect.width - arrowInset, desired));
      nextArrowStyle["--tooltip-arrow-x"] = `${clamped}px`;
      nextArrowStyle["--tooltip-arrow-y"] = undefined;
    } else {
      const triggerCenterY = triggerRect.top + triggerRect.height / 2;
      const desired = triggerCenterY - contentRect.top;
      const clamped = Math.max(arrowInset, Math.min(contentRect.height - arrowInset, desired));
      nextArrowStyle["--tooltip-arrow-y"] = `${clamped}px`;
      nextArrowStyle["--tooltip-arrow-x"] = undefined;
    }
    setArrowStyle(nextArrowStyle);
  }, [align, collisionPadding, resolvedSide, side, sideOffset, tooltip.open.value]);

  if (!tooltip.open.value && !forceMount) return null;

  const baseSideStyles: Record<NonNullable<TooltipContentProps["side"]>, JSX.CSSProperties> = {
    top: { bottom: `calc(100% + ${sideOffset}px)` },
    right: { left: `calc(100% + ${sideOffset}px)` },
    bottom: { top: `calc(100% + ${sideOffset}px)` },
    left: { right: `calc(100% + ${sideOffset}px)` }
  };

  const alignStyles: Record<NonNullable<TooltipContentProps["align"]>, JSX.CSSProperties> = {
    start:
      resolvedSide === "top" || resolvedSide === "bottom"
        ? { left: `${alignOffset}px` }
        : { top: `${alignOffset}px` },
    center:
      resolvedSide === "top" || resolvedSide === "bottom"
        ? { left: `calc(50% + ${alignOffset}px)`, transform: "translateX(-50%)" }
        : { top: `calc(50% + ${alignOffset}px)`, transform: "translateY(-50%)" },
    end:
      resolvedSide === "top" || resolvedSide === "bottom"
        ? { right: `${alignOffset}px` }
        : { bottom: `${alignOffset}px` }
  };

  const resolvedStyle =
    typeof style === "object" && style && !("value" in style) ? (style as JSX.CSSProperties) : {};

  const mergedStyle: JSX.CSSProperties = {
    position: "absolute",
    zIndex: 50,
    maxWidth: "min(22rem, 92vw)",
    ...baseSideStyles[resolvedSide],
    ...alignStyles[align],
    ...dynamicClamp,
    ...arrowStyle,
    ...resolvedStyle
  };

  const commonProps: TooltipContentCommonProps = {
    id: contentId,
    role: "tooltip",
    "data-slot": "tooltip-content",
    "data-state": tooltip.open.value ? "open" : "closed",
    "data-side": resolvedSide,
    "data-align": align,
    "data-flip-animating": isFlipAnimating ? "true" : "false",
    onMouseEnter: (event) => {
      if (!tooltip.disableHoverableContent) {
        tooltip.cancelTimers();
        tooltip.setOpen(true);
      }
      onMouseEnter?.(event);
    },
    onMouseLeave: (event) => {
      tooltip.closeWithDelay();
      onMouseLeave?.(event);
    },
    style: mergedStyle
  };

  if (asChild) {
    if (!isValidElement(children)) {
      return null;
    }

    const childProps = (children.props ?? {}) as JSX.HTMLAttributes<HTMLElement>;
    const nextChildren = (
      <>
        {childProps.children}
        <span aria-hidden="true" data-slot="tooltip-arrow" />
      </>
    );

    return cloneElement(children, {
      ...(childProps ?? {}),
      ...commonProps,
      ...remainingProps,
      children: nextChildren
    });
  }

  return (
    <div
      {...commonProps}
      {...remainingProps}
      ref={(element) => {
        contentRef.current = element;
      }}
    >
      {children}
      <span aria-hidden="true" data-slot="tooltip-arrow" />
    </div>
  );
};

