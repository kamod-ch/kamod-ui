import type { ComponentChildren, JSX } from "preact";
import { useHeightDisclosureContent } from "../../lib/disclosure/use-height-disclosure-content";
import { cn } from "../../lib/utils";
import { useCollapsible } from "./Collapsible";

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
  const {
    allowRender,
    isAnimatingClose,
    isAnimatingOpen,
    outerRef,
    innerRef,
    handleTransitionEnd,
  } = useHeightDisclosureContent({
    open,
    forceMount,
    duration,
    timingFunction,
    largeContentThreshold,
  });

  if (!allowRender) return null;

  const mergedStyle: JSX.CSSProperties = {
    ...(typeof style === "object" && style !== null && !Array.isArray(style)
      ? (style as JSX.CSSProperties)
      : {}),
    ["--kamodui-collapsible-duration" as string]: duration,
    ["--kamodui-collapsible-timing-function" as string]: timingFunction,
  };

  return (
    <div
      ref={outerRef}
      data-slot="collapsible-content"
      data-state={open ? "open" : "closed"}
      onTransitionEnd={handleTransitionEnd}
      style={mergedStyle}
      class={cn(
        "min-h-0 overflow-hidden",
        (isAnimatingOpen || isAnimatingClose) && "will-change-[height]",
      )}
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
