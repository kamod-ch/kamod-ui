import { Presence } from "@kamod-ch/motion/presence";
import { DialogPortal, useDialog } from "@kamod-ch/ui/dialog";
import type { ComponentChildren } from "preact";
import { useMotionMount } from "../lib/use-motion-mount.js";

export type MotionSheetPortalProps = {
  children?: ComponentChildren;
};

export function MotionSheetPortal({ children }: MotionSheetPortalProps) {
  const dialog = useDialog();
  const open = dialog.open.value === true;
  const { mounted, onExitComplete } = useMotionMount(open);

  if (!mounted) {
    return null;
  }

  return (
    <DialogPortal forceMount>
      <Presence show={open} onExitComplete={onExitComplete}>
        {children}
      </Presence>
    </DialogPortal>
  );
}
