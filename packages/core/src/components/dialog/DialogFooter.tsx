import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type DialogFooterProps = JSX.HTMLAttributes<HTMLDivElement> & { children?: ComponentChildren };

export const DialogFooter = ({ class: className, children, ...rest }: DialogFooterProps) => (
  <div data-slot="dialog-footer" class={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...rest}>
    {children}
  </div>
);
