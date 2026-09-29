import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { pageHeaderDescription } from "./page-header-variants";

export type PageHeaderDescriptionProps = JSX.HTMLAttributes<HTMLParagraphElement> & {
  children?: ComponentChildren;
};

export const PageHeaderDescription = ({
  class: className,
  children,
  ...rest
}: PageHeaderDescriptionProps) => (
  <p data-slot="page-header-description" class={cn(pageHeaderDescription(), className)} {...rest}>
    {children}
  </p>
);
