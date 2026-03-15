import type { ComponentChildren } from "preact";
import type { VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";
import { button } from "../button/Button";
import { DialogClose, type DialogCloseProps } from "../dialog/DialogClose";

export type AlertDialogCancelProps = DialogCloseProps & {
  variant?: VariantProps<typeof button>["variant"];
  children?: ComponentChildren;
};

export const AlertDialogCancel = ({
  variant = "outline",
  class: className,
  children,
  ...rest
}: AlertDialogCancelProps) => (
  <DialogClose
    class={button({ variant, class: cn("w-full sm:w-auto", className as string | undefined) })}
    data-slot="alert-dialog-cancel"
    {...rest}
  >
    {children}
  </DialogClose>
);
