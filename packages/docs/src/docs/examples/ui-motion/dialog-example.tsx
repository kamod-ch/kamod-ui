import { Button } from "@kamod-ch/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@kamod-ch/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@kamod-ch/ui/field";
import { Input } from "@kamod-ch/ui/input";
import {
  MotionDialogContent,
  MotionDialogOverlay,
  MotionDialogPortal,
} from "@kamod-ch/ui-motion/dialog";
import type { UiMotionDocExample } from "./types.js";

export const MOTION_DIALOG_EXAMPLE_CODE = `import { Button } from "@kamod-ch/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@kamod-ch/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@kamod-ch/ui/field";
import { Input } from "@kamod-ch/ui/input";
import {
  MotionDialogContent,
  MotionDialogOverlay,
  MotionDialogPortal,
} from "@kamod-ch/ui-motion/dialog";

export function ProfileDialog() {
  return (
    <Dialog>
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline">Edit profile</Button>
        </DialogTrigger>
        <MotionDialogPortal>
          <MotionDialogOverlay />
          <MotionDialogContent class="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you are done.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="profile-name">Name</FieldLabel>
                <Input id="profile-name" name="name" defaultValue="Pedro Duarte" />
              </Field>
              <Field>
                <FieldLabel htmlFor="profile-username">Username</FieldLabel>
                <Input id="profile-username" name="username" defaultValue="@peduarte" />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </MotionDialogContent>
        </MotionDialogPortal>
      </form>
    </Dialog>
  );
}`;

export function MotionDialogProfilePreview() {
  return (
    <Dialog>
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline">Edit profile</Button>
        </DialogTrigger>
        <MotionDialogPortal>
          <MotionDialogOverlay />
          <MotionDialogContent class="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you are done.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="ui-motion-profile-name">Name</FieldLabel>
                <Input id="ui-motion-profile-name" name="name" defaultValue="Pedro Duarte" />
              </Field>
              <Field>
                <FieldLabel htmlFor="ui-motion-profile-username">Username</FieldLabel>
                <Input id="ui-motion-profile-username" name="username" defaultValue="@peduarte" />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </MotionDialogContent>
        </MotionDialogPortal>
      </form>
    </Dialog>
  );
}

export const dialogExample: UiMotionDocExample = {
  id: "dialog",
  title: "Dialog",
  text: "Overlay fades in, the panel scales, Escape closes the dialog, focus returns to the trigger, and the corner close button stays keyboard reachable — same semantics as core Dialog, with Presence-managed exit.",
  code: MOTION_DIALOG_EXAMPLE_CODE,
  renderPreview: () => <MotionDialogProfilePreview />,
  previewClass: "data-[chromeless=true]:overflow-visible",
};
