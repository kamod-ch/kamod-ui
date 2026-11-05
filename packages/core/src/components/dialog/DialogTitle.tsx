import type { ComponentChildren, HTMLAttributes, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useDialog } from "./Dialog";

export type DialogTitleProps = HTMLAttributes<HTMLHeadingElement> & {
  children?: ComponentChildren;
};

export const DialogTitle = ({
  class: className,
  children,
  id: idProp,
  ...rest
}: DialogTitleProps) => {
  const dialog = useDialog();
  const id = idProp ?? dialog.defaultTitleId;

  return (
    <h2
      data-slot="dialog-title"
      id={id}
      class={cn("text-lg leading-none font-semibold tracking-tight", className)}
      {...(rest as JSX.IntrinsicElements["h2"])}
    >
      {children}
    </h2>
  );
};
