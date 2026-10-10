import {
  type ComponentChildren,
  type CSSProperties,
  cloneElement,
  type HTMLAttributes,
  isValidElement,
} from "preact";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "preact/hooks";
import { useTooltip } from "./Tooltip";

export type TooltipContentProps = HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number;
  forceMount?: boolean;
  children?: ComponentChildren;
};

type TooltipContentCommonProps = HTMLAttributes<HTMLDivElement> & {
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
  const [dynamicClamp, setDynamicClamp] = useState<CSSProperties>({});
  const [arrowStyle, setArrowStyle] = useState<CSSProperties>({});
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
    [],
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
    const fitsBottom =
      viewportHeight - triggerRect.bottom >= contentRect.height + sideOffset + collisionPadding;
    const fitsLeft = triggerRect.left >= contentRect.width + sideOffset + collisionPadding;
    const fitsRight =
      viewportWidth - triggerRect.right >= contentRect.width + sideOffset + collisionPadding;

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

    // Compute the intended position before clamping, not the previous rendered
    // position. Offsets are relative to the trigger; viewport edges are not.
    const horizontal = nextSide === "top" || nextSide === "bottom";
    const triggerStart = horizontal ? triggerRect.left : triggerRect.top;
    const triggerSize = horizontal ? triggerRect.width : triggerRect.height;
    const contentSize = horizontal ? contentRect.width : contentRect.height;
    const viewportSize = horizontal ? viewportWidth : viewportHeight;
    const offset =
      align === "start"
        ? alignOffset
        : align === "end"
          ? triggerSize - contentSize - alignOffset
          : (triggerSize - contentSize) / 2 + alignOffset;
    const position = Math.max(
      collisionPadding,
      Math.min(triggerStart + offset, viewportSize - collisionPadding - contentSize),
    );
    setDynamicClamp({
      [horizontal ? "left" : "top"]: `${position - triggerStart}px`,
      [horizontal ? "right" : "bottom"]: "auto",
      transform: "none",
    });

    const arrowInset = 12;
    const arrowPosition = Math.max(
      arrowInset,
      Math.min(contentSize - arrowInset, triggerStart + triggerSize / 2 - position),
    );
    const nextArrowStyle: CSSProperties = {
      [horizontal ? "--tooltip-arrow-x" : "--tooltip-arrow-y"]: `${arrowPosition}px`,
    };
    setArrowStyle(nextArrowStyle);
  }, [align, alignOffset, collisionPadding, resolvedSide, side, sideOffset, tooltip.open.value]);

  if (!tooltip.open.value && !forceMount) return null;

  const baseSideStyles: Record<NonNullable<TooltipContentProps["side"]>, CSSProperties> = {
    top: { bottom: `calc(100% + ${sideOffset}px)` },
    right: { left: `calc(100% + ${sideOffset}px)` },
    bottom: { top: `calc(100% + ${sideOffset}px)` },
    left: { right: `calc(100% + ${sideOffset}px)` },
  };

  const alignStyles: Record<NonNullable<TooltipContentProps["align"]>, CSSProperties> = {
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
        : { bottom: `${alignOffset}px` },
  };

  const resolvedStyle =
    typeof style === "object" && style && !("value" in style) ? (style as CSSProperties) : {};

  const mergedStyle: CSSProperties = {
    position: "absolute",
    zIndex: 50,
    maxWidth: "min(22rem, 92vw)",
    ...baseSideStyles[resolvedSide],
    ...alignStyles[align],
    ...dynamicClamp,
    ...arrowStyle,
    ...resolvedStyle,
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
    style: mergedStyle,
  };

  if (asChild) {
    if (!isValidElement(children)) {
      return null;
    }

    const childProps = (children.props ?? {}) as HTMLAttributes<HTMLElement>;
    const nextChildren = (
      <>
        {childProps.children}
        <span aria-hidden="true" data-slot="tooltip-arrow" />
      </>
    );

    return cloneElement(children, {
      ...childProps,
      ...commonProps,
      ...remainingProps,
      children: nextChildren,
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
