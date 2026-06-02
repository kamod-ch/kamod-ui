import type { ComponentChildren, JSX } from "preact";
import { useLayoutEffect, useMemo } from "preact/hooks";
import { createIdFactory } from "../../lib/interactive";
import { cn } from "../../lib/utils";
import { useDialog } from "./Dialog";

const nextDescriptionId = createIdFactory("dialog-description");

export type DialogDescriptionProps = JSX.HTMLAttributes<HTMLParagraphElement> & {
  children?: ComponentChildren;
};

export const DialogDescription = ({
  class: className,
  children,
  id: idProp,
  ...rest
}: DialogDescriptionProps) => {
  const dialog = useDialog();
  const id = useMemo(() => {
    if (typeof idProp === "string") return idProp;
    return nextDescriptionId();
  }, [idProp]);

  useLayoutEffect(() => {
    dialog.descriptionId.value = id;
    return () => {
      if (dialog.descriptionId.value === id) {
        dialog.descriptionId.value = undefined;
      }
    };
  }, [dialog.descriptionId, id]);

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
