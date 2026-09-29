import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { pageHeaderHeading } from "./page-header-variants";

export type PageHeaderHeadingProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const PageHeaderHeading = ({
  class: className,
  children,
  ...rest
}: PageHeaderHeadingProps) => (
  <div data-slot="page-header-heading" class={cn(pageHeaderHeading(), className)} {...rest}>
    {children}
  </div>
);
