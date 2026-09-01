import { Motion } from "@kamod-ch/motion/motion";
import { dialogViewportBleedClass, useDialog } from "@kamod-ch/ui/dialog";
import { isPointerWithinModalDialogPanelSlop } from "@kamod-ch/ui/lib/interactive";
import type { JSX } from "preact";
import { cn } from "../lib/cn.js";
import { fade } from "../lib/presets.js";

export type MotionDialogOverlayProps = {
  class?: string;
};

export function MotionDialogOverlay({ class: className }: MotionDialogOverlayProps) {
  const dialog = useDialog();

  return (
    <Motion
      aria-hidden="true"
      data-slot="dialog-overlay"
      class={cn(dialogViewportBleedClass, "z-40 bg-black/50", className)}
      initial={fade.initial}
      animate={fade.animate}
      exit={fade.exit}
      transition={fade.transition}
      onPointerDown={(event: JSX.TargetedPointerEvent<HTMLDivElement>) => {
        if (event.target !== event.currentTarget) return;
        if (isPointerWithinModalDialogPanelSlop(event)) return;
        dialog.setOpen(false);
      }}
    />
  );
}
