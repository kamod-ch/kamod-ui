import type { ComponentChildren } from "preact";
import { Dialog, type DialogProps } from "../dialog/Dialog";

export type AlertDialogProps = DialogProps & { children?: ComponentChildren };

export const AlertDialog = ({ children, ...rest }: AlertDialogProps) => (
  <Dialog data-slot="alert-dialog" lockBodyScroll {...rest}>
    {children}
  </Dialog>
);
