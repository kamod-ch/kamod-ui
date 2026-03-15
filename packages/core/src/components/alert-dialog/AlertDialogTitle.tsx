import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { DialogTitle } from "../dialog/DialogTitle";

export type AlertDialogTitleProps = JSX.HTMLAttributes<HTMLHeadingElement> & { children?: ComponentChildren };

export const AlertDialogTitle = ({ class: className, children, ...rest }: AlertDialogTitleProps) => (
  <DialogTitle class={cn("text-lg font-semibold break-words", className)} data-slot="alert-dialog-title" {...rest}>
    {children}
  </DialogTitle>
);
