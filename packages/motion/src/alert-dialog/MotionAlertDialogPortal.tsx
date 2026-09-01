import { Presence } from "@kamod-ch/motion/presence";
import { DialogPortal, useDialog } from "@kamod-ch/ui/dialog";
import type { ComponentChildren } from "preact";
import { useMotionMount } from "../lib/use-motion-mount.js";

export type MotionAlertDialogPortalProps = {
  children?: ComponentChildren;
};

export function MotionAlertDialogPortal({ children }: MotionAlertDialogPortalProps) {
  const dialog = useDialog();
  const open = dialog.open.value === true;
  const { mounted, onExitComplete } = useMotionMount(open);

  if (!mounted) {
    return null;
  }

  return (
    <DialogPortal forceMount>
      <Presence show={open} onExitComplete={onExitComplete}>
        {/* Dismiss layer treats backdrop hits on overlay children as in-layer (no outside dismiss). */}
        <div data-slot="alert-dialog-content" class="contents">
          {children}
        </div>
      </Presence>
    </DialogPortal>
  );
}
