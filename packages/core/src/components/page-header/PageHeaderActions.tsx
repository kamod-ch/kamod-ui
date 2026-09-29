import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { pageHeaderActions } from "./page-header-variants";

export type PageHeaderActionsProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const PageHeaderActions = ({
  class: className,
  children,
  ...rest
}: PageHeaderActionsProps) => (
  <div data-slot="page-header-actions" class={cn(pageHeaderActions(), className)} {...rest}>
    {children}
  </div>
);
