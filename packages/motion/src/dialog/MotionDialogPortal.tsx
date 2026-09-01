import { Presence } from "@kamod-ch/motion/presence";
import { DialogPortal, useDialog } from "@kamod-ch/ui/dialog";
import type { ComponentChildren } from "preact";
import { useMotionMount } from "../lib/use-motion-mount.js";

export type MotionDialogPortalProps = {
  children?: ComponentChildren;
};

/**
 * Portals motion dialog parts and keeps them mounted through exit animations.
 *
 * ```tsx
 * <Dialog>
 *   <DialogTrigger>Open</DialogTrigger>
 *   <MotionDialogPortal>
 *     <MotionDialogOverlay />
 *     <MotionDialogContent>...</MotionDialogContent>
 *   </MotionDialogPortal>
 * </Dialog>
 * ```
 */
export function MotionDialogPortal({ children }: MotionDialogPortalProps) {
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
