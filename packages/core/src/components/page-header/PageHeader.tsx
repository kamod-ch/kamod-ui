import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { pageHeader } from "./page-header-variants";

export type PageHeaderProps = JSX.HTMLAttributes<HTMLElement> & {
  children?: ComponentChildren;
};

export const PageHeader = ({ class: className, children, ...rest }: PageHeaderProps) => (
  <header data-slot="page-header" class={cn(pageHeader(), className)} {...rest}>
    {children}
  </header>
);
