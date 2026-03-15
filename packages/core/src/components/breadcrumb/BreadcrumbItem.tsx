import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type BreadcrumbItemProps = JSX.HTMLAttributes<HTMLLIElement> & {
  children?: ComponentChildren;
};

export const BreadcrumbItem = ({ class: className, children, ...rest }: BreadcrumbItemProps) => (
  <li data-slot="breadcrumb-item" class={cn("inline-flex items-center gap-1.5", className)} {...rest}>
    {children}
  </li>
);
