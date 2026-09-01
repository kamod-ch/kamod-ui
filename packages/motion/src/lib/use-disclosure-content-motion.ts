import { useAnimate, useReducedMotion } from "@kamod-ch/motion";
import { useLayoutEffect, useRef, useState } from "preact/hooks";
import { useMotionMount } from "./use-motion-mount.js";

const HEIGHT_TRANSITION = { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const };
const OPACITY_TRANSITION = { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const };
const REDUCED_OPACITY_TRANSITION = { duration: 0.15, ease: "linear" as const };

function measureExpandedHeight(inner: HTMLElement) {
  const contentHeight = inner.getBoundingClientRect().height;
  const computed = window.getComputedStyle(inner);
  const marginTop = Number.parseFloat(computed.marginTop || "0") || 0;
  const marginBottom = Number.parseFloat(computed.marginBottom || "0") || 0;
  return Math.ceil(contentHeight + marginTop + marginBottom);
}

function clearOuterMotionStyles(outer: HTMLElement) {
  outer.style.height = "";
  outer.style.maxHeight = "";
  outer.style.overflow = "";
  outer.style.willChange = "";
}

export function useDisclosureContentMotion(open: boolean, forceMount = false) {
  const reducedMotion = useReducedMotion();
  const { ref: outerRef, animate: animateOuter } = useAnimate<HTMLDivElement>();
  const { ref: innerRef, animate: animateInner } = useAnimate<HTMLDivElement>();
  const { mounted, onExitComplete } = useMotionMount(open);
  const openRef = useRef(open);
  openRef.current = open;
  const hasInitializedRef = useRef(false);
  const [isAnimatingClose, setIsAnimatingClose] = useState(false);
  const [isContentInteractive, setIsContentInteractive] = useState(open);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    if (!mounted && !forceMount) return;

    const heightTransition = reducedMotion ? { duration: 0 } : HEIGHT_TRANSITION;
    const opacityTransition = reducedMotion ? REDUCED_OPACITY_TRANSITION : OPACITY_TRANSITION;

    const syncOpenStyles = () => {
      clearOuterMotionStyles(outer);
      outer.style.height = "auto";
      inner.style.opacity = "";
      setIsContentInteractive(true);
      setIsAnimatingClose(false);
    };

    const syncClosedStyles = () => {
      outer.style.height = "0px";
      outer.style.overflow = "hidden";
      inner.style.opacity = "0";
      setIsContentInteractive(false);
      setIsAnimatingClose(false);
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

    let cancelled = false;

    const runOpen = () => {
      setIsAnimatingClose(false);
      setIsContentInteractive(false);
      inner.style.opacity = "0";
      outer.style.overflow = "hidden";
      outer.style.height = "0px";

      const endHeight = measureExpandedHeight(inner);
      if (reducedMotion || endHeight < 1) {
        syncOpenStyles();
        return;
      }

      void Promise.all([
        animateOuter({ height: ["0px", `${endHeight}px`] }, heightTransition).finished,
        animateInner({ opacity: [0, 1] }, opacityTransition).finished,
      ]).then(() => {
        if (cancelled || !openRef.current) return;
        clearOuterMotionStyles(outer);
        outer.style.height = "auto";
        inner.style.opacity = "";
        setIsContentInteractive(true);
      });
    };

    const runClose = () => {
      const startHeight = outer.getBoundingClientRect().height || measureExpandedHeight(inner);
      if (reducedMotion || startHeight < 1) {
        setIsContentInteractive(false);
        if (!forceMount) {
          onExitComplete();
        } else {
          syncClosedStyles();
        }
        return;
      }

      setIsAnimatingClose(true);
      setIsContentInteractive(false);
      outer.style.height = `${startHeight}px`;
      outer.style.overflow = "hidden";

      void Promise.all([
        animateOuter({ height: [`${startHeight}px`, "0px"] }, heightTransition).finished,
        animateInner({ opacity: [1, 0] }, opacityTransition).finished,
      ]).then(() => {
        if (cancelled || openRef.current) return;
        setIsAnimatingClose(false);
        clearOuterMotionStyles(outer);
        if (!forceMount) {
          onExitComplete();
        } else {
          syncClosedStyles();
        }
      });
    };

    if (open) {
      runOpen();
    } else {
      runClose();
    }

    return () => {
      cancelled = true;
    };
  }, [open, mounted, forceMount, reducedMotion, animateOuter, animateInner, onExitComplete]);

  const allowRender = mounted || forceMount || open;

  return {
    allowRender,
    isAnimatingClose,
    isContentInteractive,
    outerRef,
    innerRef,
  };
}
