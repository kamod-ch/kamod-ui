import { Button } from "@kamod-ch/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@kamod-ch/ui/dialog";
import {
  MotionDialogContent,
  MotionDialogOverlay,
  MotionDialogPortal,
} from "@kamod-ch/ui-motion/dialog";

export function MotionDialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open motion dialog</Button>
      </DialogTrigger>
      <MotionDialogPortal>
        <MotionDialogOverlay />
        <MotionDialogContent class="sm:max-w-md">
          <DialogTitle>Motion-enhanced dialog</DialogTitle>
          <DialogDescription>
            Uses @kamod-ch/motion Presence and presets — no tw-animate on the same nodes.
          </DialogDescription>
          <DialogClose asChild>
            <Button class="mt-4">Close</Button>
          </DialogClose>
        </MotionDialogContent>
      </MotionDialogPortal>
    </Dialog>
  );
}
