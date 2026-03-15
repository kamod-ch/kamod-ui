import type { ComponentChildren } from "preact";
import { button } from "../button/Button";
import { DialogTrigger, type DialogTriggerProps } from "../dialog/DialogTrigger";

export type AlertDialogTriggerProps = DialogTriggerProps & { children?: ComponentChildren };

export const AlertDialogTrigger = ({ asChild, class: className, children, ...rest }: AlertDialogTriggerProps) => (
  <DialogTrigger
    asChild={asChild}
    class={asChild ? className : button({ variant: "outline", class: className as string | undefined })}
    data-slot="alert-dialog-trigger"
    {...rest}
  >
    {children}
  </DialogTrigger>
);
