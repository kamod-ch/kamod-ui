import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type DialogTitleProps = JSX.HTMLAttributes<HTMLHeadingElement> & { children?: ComponentChildren };

export const DialogTitle = ({ class: className, children, ...rest }: DialogTitleProps) => (
  <h2 data-slot="dialog-title" class={cn("text-lg leading-none font-semibold tracking-tight", className)} {...rest}>
    {children}
  </h2>
);
