import { Motion } from "@kamod-ch/motion/motion";
import { dialogViewportBleedClass } from "@kamod-ch/ui/dialog";
import { cn } from "../lib/cn.js";
import { fade } from "../lib/presets.js";

export type MotionAlertDialogOverlayProps = {
  class?: string;
};

export function MotionAlertDialogOverlay({ class: className }: MotionAlertDialogOverlayProps) {
  return (
    <Motion
      aria-hidden="true"
      data-slot="alert-dialog-overlay"
      class={cn(dialogViewportBleedClass, "z-40 bg-black/50", className)}
      initial={fade.initial}
      animate={fade.animate}
      exit={fade.exit}
      transition={fade.transition}
    />
  );
}
