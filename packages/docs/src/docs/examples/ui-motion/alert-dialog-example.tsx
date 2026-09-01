import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
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
import { Trash2 } from "lucide-preact";
import type { UiMotionDocExample } from "./types.js";

export const MOTION_ALERT_DIALOG_EXAMPLE_CODE = `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
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
import { Trash2 } from "lucide-preact";

export function DeleteProjectAlert() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete project</Button>
      </AlertDialogTrigger>
      <MotionAlertDialogPortal>
        <MotionAlertDialogOverlay />
        <MotionAlertDialogViewport>
          <MotionAlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogMedia class="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                <Trash2 />
              </AlertDialogMedia>
              <AlertDialogTitle>Delete this project?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently removes the project and all deployments. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive">Delete project</AlertDialogAction>
            </AlertDialogFooter>
          </MotionAlertDialogContent>
        </MotionAlertDialogViewport>
      </MotionAlertDialogPortal>
    </AlertDialog>
  );
}`;

export function MotionAlertDialogDestructivePreview() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" data-testid="ui-motion-alert-trigger">
          Delete project
        </Button>
      </AlertDialogTrigger>
      <MotionAlertDialogPortal>
        <MotionAlertDialogOverlay />
        <MotionAlertDialogViewport>
          <MotionAlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogMedia class="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                <Trash2 />
              </AlertDialogMedia>
              <AlertDialogTitle>Delete this project?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently removes the project and all deployments. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive">Delete project</AlertDialogAction>
            </AlertDialogFooter>
          </MotionAlertDialogContent>
        </MotionAlertDialogViewport>
      </MotionAlertDialogPortal>
    </AlertDialog>
  );
}

export const alertDialogExample: UiMotionDocExample = {
  id: "alert-dialog",
  title: "Alert Dialog",
  text: "Destructive confirmation with overlay fade and emphasized scale on the panel. Cancel and Delete project stay explicit — nothing runs until the user confirms. Escape and outside-click behavior match core AlertDialog; reduced motion falls back to opacity-only via preset.reduced.",
  code: MOTION_ALERT_DIALOG_EXAMPLE_CODE,
  renderPreview: () => <MotionAlertDialogDestructivePreview />,
  previewClass: "data-[chromeless=true]:overflow-visible",
};
