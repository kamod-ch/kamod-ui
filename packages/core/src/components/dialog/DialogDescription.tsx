import type { ComponentChildren, HTMLAttributes } from "preact";
import { cn } from "../../lib/utils";
import { useDialog } from "./Dialog";

export type DialogDescriptionProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ComponentChildren;
};

export const DialogDescription = ({
  class: className,
  children,
  id: idProp,
  ...rest
}: DialogDescriptionProps) => {
  const dialog = useDialog();
  const id = idProp ?? dialog.defaultDescriptionId;

  return (
    <p
      data-slot="dialog-description"
      id={id}
      class={cn("text-muted-foreground text-sm", className)}
      {...rest}
    >
      {children}
    </p>
  );
};
