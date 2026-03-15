import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type BreadcrumbPageProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  children?: ComponentChildren;
};

export const BreadcrumbPage = ({ class: className, children, ...rest }: BreadcrumbPageProps) => (
  <span
    role="link"
    aria-disabled="true"
    aria-current="page"
    data-slot="breadcrumb-page"
    class={cn("text-foreground font-medium", className)}
    {...rest}
  >
    {children}
  </span>
);
