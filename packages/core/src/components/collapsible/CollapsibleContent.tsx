import { useLayoutEffect, useRef, useState } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { useCollapsible } from "./Collapsible";
import { cn } from "../../lib/utils";

export type CollapsibleContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  forceMount?: boolean;
  /** Grid transition duration, e.g. `400ms` */
  duration?: string;
  /** CSS timing function, e.g. `cubic-bezier(0.4, 0, 0.2, 1)` */
  timingFunction?: string;
  /** Use max-height animation for very tall content to reduce micro-jank. */
  largeContentThreshold?: number;
  children?: ComponentChildren;
};

export const CollapsibleContent = ({
  forceMount = false,
  duration = "320ms",
  timingFunction = "cubic-bezier(0.22, 1, 0.36, 1)",
  largeContentThreshold = 560,
  children,
  class: className,
  style,
  ...rest
}: CollapsibleContentProps) => {
  const { open } = useCollapsible();
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const isOpenRef = useRef(open);
  isOpenRef.current = open;
  const hasInitializedRef = useRef(false);

  const [mounted, setMounted] = useState(() => open || forceMount);
  const [isAnimatingClose, setIsAnimatingClose] = useState(false);
  const [isAnimatingOpen, setIsAnimatingOpen] = useState(false);
  const prefersReducedMotionRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const rafSecondRef = useRef<number | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const usesMaxHeightRef = useRef(false);

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      prefersReducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (rafSecondRef.current !== null) {
      cancelAnimationFrame(rafSecondRef.current);
      rafSecondRef.current = null;
    }
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
      resizeObserverRef.current = null;
    }

    const syncOpenStyles = () => {
      outer.style.transition = "none";
      outer.style.height = "auto";
      outer.style.maxHeight = "none";
      outer.style.overflow = "";
      outer.style.willChange = "";
    };

    const syncClosedStyles = () => {
      outer.style.transition = "none";
      outer.style.height = "0px";
      outer.style.maxHeight = "0px";
      outer.style.overflow = "hidden";
      outer.style.willChange = "";
    };

    const measureExpandedHeight = () => {
      const contentHeight = inner.getBoundingClientRect().height;
      const computed = window.getComputedStyle(inner);
      const marginTop = Number.parseFloat(computed.marginTop || "0") || 0;
      const marginBottom = Number.parseFloat(computed.marginBottom || "0") || 0;
      return Math.ceil(contentHeight + marginTop + marginBottom);
    };

    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      if (open) {
        setMounted(true);
        syncOpenStyles();
      } else {
        syncClosedStyles();
      }
      return;
    }

    if (open) {
      if (!mounted) {
        setMounted(true);
        return;
      }

      setIsAnimatingClose(false);
      const endHeight = measureExpandedHeight();
      const startHeight = outer.getBoundingClientRect().height;
      usesMaxHeightRef.current = endHeight >= largeContentThreshold;
      const animateProperty = usesMaxHeightRef.current ? "max-height" : "height";
      const transitionValue = `${animateProperty} ${duration} ${timingFunction}`;

      if (prefersReducedMotionRef.current || Math.abs(endHeight - startHeight) < 1) {
        setIsAnimatingOpen(false);
        syncOpenStyles();
        return;
      }

      setIsAnimatingOpen(true);
      outer.style.transition = "none";
      outer.style.overflow = "hidden";
      outer.style.willChange = animateProperty;
      outer.style.height = usesMaxHeightRef.current ? "auto" : `${startHeight}px`;
      outer.style.maxHeight = `${startHeight}px`;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        rafSecondRef.current = requestAnimationFrame(() => {
          rafSecondRef.current = null;
          outer.style.transition = transitionValue;
          if (usesMaxHeightRef.current) {
            outer.style.maxHeight = `${endHeight}px`;
          } else {
            outer.style.height = `${endHeight}px`;
            outer.style.maxHeight = `${endHeight}px`;
          }
        });
      });

      if (typeof ResizeObserver !== "undefined") {
        resizeObserverRef.current = new ResizeObserver(() => {
          if (!isOpenRef.current) return;
          const nextHeight = measureExpandedHeight();
          if (nextHeight <= 0) return;
          if (usesMaxHeightRef.current) {
            outer.style.maxHeight = `${nextHeight}px`;
          } else {
            outer.style.height = `${nextHeight}px`;
            outer.style.maxHeight = `${nextHeight}px`;
          }
        });
        resizeObserverRef.current.observe(inner);
      }
      return;
    }

    if (!mounted) {
      if (forceMount) syncClosedStyles();
      return;
    }

    const startHeight = outer.getBoundingClientRect().height || measureExpandedHeight();
    usesMaxHeightRef.current = startHeight >= largeContentThreshold;
    const animateProperty = usesMaxHeightRef.current ? "max-height" : "height";
    const transitionValue = `${animateProperty} ${duration} ${timingFunction}`;
    if (prefersReducedMotionRef.current || startHeight < 1) {
      setIsAnimatingOpen(false);
      setIsAnimatingClose(false);
      if (!forceMount) {
        setMounted(false);
      } else {
        syncClosedStyles();
      }
      return;
    }

    setIsAnimatingOpen(false);
    setIsAnimatingClose(true);
    outer.style.transition = "none";
    outer.style.overflow = "hidden";
    outer.style.willChange = animateProperty;
    outer.style.height = usesMaxHeightRef.current ? "auto" : `${startHeight}px`;
    outer.style.maxHeight = `${startHeight}px`;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      rafSecondRef.current = requestAnimationFrame(() => {
        rafSecondRef.current = null;
        outer.style.transition = transitionValue;
        if (usesMaxHeightRef.current) {
          outer.style.maxHeight = "0px";
        } else {
          outer.style.height = "0px";
          outer.style.maxHeight = "0px";
        }
      });
    });
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (rafSecondRef.current !== null) {
        cancelAnimationFrame(rafSecondRef.current);
        rafSecondRef.current = null;
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
  }, [forceMount, open, mounted, timingFunction, duration, largeContentThreshold]);

  const handleTransitionEnd = (e: TransitionEvent) => {
    if (e.target !== outerRef.current) return;
    if (e.propertyName !== "height" && e.propertyName !== "max-height") return;
    const outer = outerRef.current;
    if (!outer) return;

    if (isOpenRef.current) {
      setIsAnimatingOpen(false);
      outer.style.transition = "none";
      outer.style.height = "auto";
      outer.style.maxHeight = "none";
      outer.style.overflow = "";
      outer.style.willChange = "";
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      return;
    }
    setIsAnimatingClose(false);
    if (!forceMount) {
      outer.style.willChange = "";
      setMounted(false);
    } else {
      outer.style.transition = "none";
      outer.style.height = "0px";
      outer.style.maxHeight = "0px";
      outer.style.overflow = "hidden";
      outer.style.willChange = "";
    }
  };

  const allowRender = mounted || forceMount || open;
  if (!allowRender) return null;

  const mergedStyle: JSX.CSSProperties = {
    ...(typeof style === "object" && style !== null && !Array.isArray(style)
      ? (style as JSX.CSSProperties)
      : {}),
    ["--kamodui-collapsible-duration" as string]: duration,
    ["--kamodui-collapsible-timing-function" as string]: timingFunction
  };

  return (
    <div
      ref={outerRef}
      data-slot="collapsible-content"
      data-state={open ? "open" : "closed"}
      onTransitionEnd={handleTransitionEnd}
      style={mergedStyle}
      class={cn("min-h-0 overflow-hidden", (isAnimatingOpen || isAnimatingClose) && "will-change-[height]")}
      aria-hidden={!open && !isAnimatingClose}
      inert={!open || undefined}
      {...rest}
    >
      <div
        ref={innerRef}
        data-slot="collapsible-content-inner"
        class={cn("min-h-0 min-w-0", className)}
      >
        {children}
      </div>
    </div>
  );
};
