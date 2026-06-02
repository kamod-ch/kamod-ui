import type { ComponentChildren, JSX } from "preact";
import { useLayoutEffect, useMemo } from "preact/hooks";
import { createIdFactory } from "../../lib/interactive";
import { cn } from "../../lib/utils";
import { useDialog } from "./Dialog";

const nextTitleId = createIdFactory("dialog-title");

export type DialogTitleProps = JSX.HTMLAttributes<HTMLHeadingElement> & {
  children?: ComponentChildren;
};

export const DialogTitle = ({
  class: className,
  children,
  id: idProp,
  ...rest
}: DialogTitleProps) => {
  const dialog = useDialog();
  const id = useMemo(() => {
    if (typeof idProp === "string") return idProp;
    return nextTitleId();
  }, [idProp]);

  useLayoutEffect(() => {
    dialog.titleId.value = id;
    return () => {
      if (dialog.titleId.value === id) {
        dialog.titleId.value = undefined;
      }
    };
  }, [dialog.titleId, id]);

  return (
    <h2
      data-slot="dialog-title"
      id={id}
      class={cn("text-lg leading-none font-semibold tracking-tight", className)}
      {...rest}
    >
      {children}
    </h2>
  );
};
