import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type DialogHeaderProps = JSX.HTMLAttributes<HTMLDivElement> & { children?: ComponentChildren };

export const DialogHeader = ({ class: className, children, ...rest }: DialogHeaderProps) => (
  <div data-slot="dialog-header" class={cn("flex flex-col gap-2 text-center sm:text-start", className)} {...rest}>
    {children}
  </div>
);
