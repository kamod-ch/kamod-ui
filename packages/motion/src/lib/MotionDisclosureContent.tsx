import type { ComponentChildren, JSX } from "preact";
import { cn } from "./cn.js";
import { useDisclosureContentMotion } from "./use-disclosure-content-motion.js";

export type MotionDisclosureContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  open: boolean;
  forceMount?: boolean;
  outerDataSlot: string;
  innerDataSlot: string;
  children?: ComponentChildren;
};

/** Shared height + opacity disclosure panel for accordion and collapsible adapters. */
export function MotionDisclosureContent({
  open,
  forceMount = false,
  outerDataSlot,
  innerDataSlot,
  children,
  class: className,
  ...rest
}: MotionDisclosureContentProps) {
  const { allowRender, isAnimatingClose, isContentInteractive, outerRef, innerRef } =
    useDisclosureContentMotion(open, forceMount);

  if (!allowRender) {
    return null;
  }

  const contentInert = !open || !isContentInteractive;

  return (
    <div
      ref={outerRef}
      data-slot={outerDataSlot}
      data-state={open ? "open" : "closed"}
      class="min-h-0 overflow-hidden"
      aria-hidden={!open && !isAnimatingClose ? true : undefined}
      inert={contentInert || undefined}
      {...rest}
    >
      <div
        ref={innerRef}
        data-slot={innerDataSlot}
        class={cn("min-h-0 min-w-0", className)}
        aria-hidden={contentInert || undefined}
        inert={contentInert || undefined}
      >
        {children}
      </div>
    </div>
  );
}
