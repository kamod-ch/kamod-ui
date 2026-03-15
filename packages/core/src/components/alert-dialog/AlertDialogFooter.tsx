import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { DialogFooter } from "../dialog/DialogFooter";

export type AlertDialogFooterProps = JSX.HTMLAttributes<HTMLDivElement> & { children?: ComponentChildren };

export const AlertDialogFooter = ({ class: className, children, ...rest }: AlertDialogFooterProps) => (
  <DialogFooter class={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} data-slot="alert-dialog-footer" {...rest}>
    {children}
  </DialogFooter>
);
