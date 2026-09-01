import { Motion } from "@kamod-ch/motion/motion";
import { Presence } from "@kamod-ch/motion/presence";
import { slideUp } from "@kamod-ch/motion/presets";
import { useCollapsible } from "@kamod-ch/ui/collapsible";
import type { JSX } from "preact";
import { cn } from "../lib/cn.js";
import { useMotionMount } from "../lib/use-motion-mount.js";

export type MotionCollapsibleContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  forceMount?: boolean;
};

/** Drop-in replacement for `CollapsibleContent` using motion presets (no CSS height transition). */
export function MotionCollapsibleContent({
  forceMount = false,
  children,
  class: className,
  ...rest
}: MotionCollapsibleContentProps) {
  const { open } = useCollapsible();
  const { mounted, onExitComplete } = useMotionMount(open);

  if (!mounted && !forceMount) {
    return null;
  }

  return (
    <div
      data-slot="collapsible-content"
      data-state={open ? "open" : "closed"}
      class="min-h-0 overflow-hidden"
      aria-hidden={!open || undefined}
      inert={!open || undefined}
      {...rest}
    >
      <Presence show={open} onExitComplete={onExitComplete}>
        <Motion
          data-slot="collapsible-content-inner"
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
