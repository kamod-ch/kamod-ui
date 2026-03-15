import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type BreadcrumbProps = JSX.HTMLAttributes<HTMLElement> & {
  children?: ComponentChildren;
};

export const Breadcrumb = ({ class: className, children, ...rest }: BreadcrumbProps) => (
  <nav aria-label="breadcrumb" data-slot="breadcrumb" class={cn(className)} {...rest}>
    {children}
  </nav>
);
