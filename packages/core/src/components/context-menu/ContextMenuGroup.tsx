import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type ContextMenuGroupProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const ContextMenuGroup = ({ class: className, children, ...rest }: ContextMenuGroupProps) => (
  <div data-slot="context-menu-group" role="group" class={cn(className)} {...rest}>
    {children}
  </div>
);
