import { Motion } from "@kamod-ch/motion/motion";
import { Presence } from "@kamod-ch/motion/presence";
import { slideUp } from "@kamod-ch/motion/presets";
import { useAccordionItem } from "@kamod-ch/ui/accordion";
import type { JSX } from "preact";
import { cn } from "../lib/cn.js";
import { useMotionMount } from "../lib/use-motion-mount.js";

export type MotionAccordionContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  forceMount?: boolean;
};

/**
 * Drop-in replacement for `AccordionContent` using `@kamod-ch/motion` instead of CSS height transitions.
 */
export function MotionAccordionContent({
  forceMount = false,
  children,
  class: className,
  ...rest
}: MotionAccordionContentProps) {
  const { isOpen } = useAccordionItem();
  const { mounted, onExitComplete } = useMotionMount(isOpen);

  if (!mounted && !forceMount) {
    return null;
  }

  return (
    <div
      data-slot="accordion-content"
      data-state={isOpen ? "open" : "closed"}
      class="min-h-0 overflow-hidden"
      aria-hidden={!isOpen || undefined}
      inert={!isOpen || undefined}
      {...rest}
    >
      <Presence show={isOpen} onExitComplete={onExitComplete}>
        <Motion
          data-slot="accordion-content-inner"
          class={cn("min-h-0 min-w-0", className)}
          initial={slideUp.initial}
          animate={slideUp.animate}
          exit={slideUp.exit}
          transition={slideUp.transition}
        >
          {children}
        </Motion>
      </Presence>
    </div>
  );
}
