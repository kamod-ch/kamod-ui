import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { DialogDescription } from "../dialog/DialogDescription";

export type AlertDialogDescriptionProps = JSX.HTMLAttributes<HTMLParagraphElement> & {
  children?: ComponentChildren;
};

export const AlertDialogDescription = ({ class: className, children, ...rest }: AlertDialogDescriptionProps) => (
  <DialogDescription class={cn("text-muted-foreground text-sm leading-relaxed break-words", className)} data-slot="alert-dialog-description" {...rest}>
    {children}
  </DialogDescription>
);
