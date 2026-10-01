import type { ComponentChildren, HTMLAttributes } from "preact";
import { cn } from "../../lib/utils";
import { DialogHeader } from "../dialog/DialogHeader";

export type AlertDialogHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const AlertDialogHeader = ({
  class: className,
  children,
  ...rest
}: AlertDialogHeaderProps) => (
  <DialogHeader
    class={cn("grid gap-2 text-center sm:text-left", className)}
    data-slot="alert-dialog-header"
    {...rest}
  >
    {children}
  </DialogHeader>
);
