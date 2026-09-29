import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { pageHeaderFooter } from "./page-header-variants";

export type PageHeaderFooterProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const PageHeaderFooter = ({
  class: className,
  children,
  ...rest
}: PageHeaderFooterProps) => (
  <div data-slot="page-header-footer" class={cn(pageHeaderFooter(), className)} {...rest}>
    {children}
  </div>
);
