import { useLayoutEffect, useRef, useState } from "preact/hooks";

type UseHeightDisclosureContentOptions = {
  open: boolean;
  forceMount?: boolean;
  duration?: string;
  timingFunction?: string;
  largeContentThreshold?: number;
};

function measureExpandedHeight(inner: HTMLElement) {
  const contentHeight = inner.getBoundingClientRect().height;
  const computed = window.getComputedStyle(inner);
  const marginTop = Number.parseFloat(computed.marginTop || "0") || 0;
  const marginBottom = Number.parseFloat(computed.marginBottom || "0") || 0;
  return Math.ceil(contentHeight + marginTop + marginBottom);
}

function cancelRaf(rafRef: { current: number | null }) {
  if (rafRef.current !== null) {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }
}

/** Height-based open/close animation for accordion and collapsible content panels. */
export function useHeightDisclosureContent({
  open,
  forceMount = false,
  duration = "320ms",
  timingFunction = "cubic-bezier(0.22, 1, 0.36, 1)",
  largeContentThreshold = 560,
}: UseHeightDisclosureContentOptions) {
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(open);
  openRef.current = open;
  const hasInitializedRef = useRef(false);
  const isSettledOpenRef = useRef(open);

  const [mounted, setMounted] = useState(() => open || forceMount);
  const [isAnimatingClose, setIsAnimatingClose] = useState(false);
  const [isAnimatingOpen, setIsAnimatingOpen] = useState(false);
  const prefersReducedMotionRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const rafSecondRef = useRef<number | null>(null);
  const usesMaxHeightRef = useRef(false);

  useLayoutEffect(() => {
    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      prefersReducedMotionRef.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
    }

    if (open && !mounted) {
      setMounted(true);
      return;
    }

    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    cancelRaf(rafRef);
    cancelRaf(rafSecondRef);

    const syncOpenStyles = () => {
      outer.style.transition = "none";
      outer.style.height = "auto";
      outer.style.maxHeight = "none";
      outer.style.overflow = "";
      outer.style.willChange = "";
      isSettledOpenRef.current = true;
      setIsAnimatingOpen(false);
    };

    const syncClosedStyles = () => {
      outer.style.transition = "none";
      outer.style.height = "0px";
      outer.style.maxHeight = "0px";
      outer.style.overflow = "hidden";
      outer.style.willChange = "";
      isSettledOpenRef.current = false;
    };

    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      if (open) {
        syncOpenStyles();
      } else {
        syncClosedStyles();
      }
      return;
    }

    if (open) {
      if (isSettledOpenRef.current) {
        setIsAnimatingClose(false);
        return;
      }

      setIsAnimatingClose(false);
      isSettledOpenRef.current = false;

      const endHeight = measureExpandedHeight(inner);
      const measuredStart = outer.getBoundingClientRect().height;
      const startHeight = measuredStart < 1 ? 0 : measuredStart;
      usesMaxHeightRef.current = endHeight >= largeContentThreshold;
      const animateProperty = usesMaxHeightRef.current ? "max-height" : "height";
      const transitionValue = `${animateProperty} ${duration} ${timingFunction}`;

      if (
        prefersReducedMotionRef.current ||
        endHeight < 1 ||
        Math.abs(endHeight - startHeight) < 1
      ) {
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
          if (!openRef.current) return;
          outer.style.transition = transitionValue;
          if (usesMaxHeightRef.current) {
            outer.style.maxHeight = `${endHeight}px`;
          } else {
            outer.style.height = `${endHeight}px`;
            outer.style.maxHeight = `${endHeight}px`;
          }
        });
      });

      return () => {
        cancelRaf(rafRef);
        cancelRaf(rafSecondRef);
      };
    }

    if (!mounted) {
      if (forceMount) syncClosedStyles();
      return;
    }

    isSettledOpenRef.current = false;
    const startHeight = outer.getBoundingClientRect().height || measureExpandedHeight(inner);
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
        if (openRef.current) return;
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
      cancelRaf(rafRef);
      cancelRaf(rafSecondRef);
    };
  }, [forceMount, open, mounted, timingFunction, duration, largeContentThreshold]);

  const handleTransitionEnd = (e: TransitionEvent) => {
    if (e.target !== outerRef.current) return;
    if (e.propertyName !== "height" && e.propertyName !== "max-height") return;
    const outer = outerRef.current;
    if (!outer) return;

    if (openRef.current) {
      setIsAnimatingOpen(false);
      outer.style.transition = "none";
      outer.style.height = "auto";
      outer.style.maxHeight = "none";
      outer.style.overflow = "";
      outer.style.willChange = "";
      isSettledOpenRef.current = true;
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

  const allowRender = mounted || forceMount;

  return {
    allowRender,
    isAnimatingClose,
    isAnimatingOpen,
    outerRef,
    innerRef,
    handleTransitionEnd,
  };
}
