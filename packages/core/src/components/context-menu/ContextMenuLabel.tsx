import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type ContextMenuLabelProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
  inset?: boolean;
};

export const ContextMenuLabel = ({
  inset = false,
  class: className,
  children,
  ...rest
}: ContextMenuLabelProps) => (
  <div
    data-slot="context-menu-label"
    data-inset={inset ? "true" : undefined}
    class={cn(
      "text-muted-foreground px-2 py-1.5 text-xs font-medium",
      inset && "ps-8",
      className
    )}
    {...rest}
  >
    {children}
  </div>
);
