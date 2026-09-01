import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@kamod-ch/ui/alert-dialog";
import { Button } from "@kamod-ch/ui/button";
import {
  MotionAlertDialogContent,
  MotionAlertDialogOverlay,
  MotionAlertDialogPortal,
  MotionAlertDialogViewport,
} from "@kamod-ch/ui-motion/alert-dialog";

export function MotionAlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Open motion alert dialog</Button>
      </AlertDialogTrigger>
      <MotionAlertDialogPortal>
        <MotionAlertDialogOverlay />
        <MotionAlertDialogViewport>
          <MotionAlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Presence keeps the dialog mounted through exit
                animations.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </MotionAlertDialogContent>
        </MotionAlertDialogViewport>
      </MotionAlertDialogPortal>
    </AlertDialog>
  );
}
