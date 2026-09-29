import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { descriptionListTerm } from "./description-list-variants";

export type DescriptionListTermProps = JSX.HTMLAttributes<HTMLElement> & {
  children?: ComponentChildren;
};

export const DescriptionListTerm = ({
  class: className,
  children,
  ...rest
}: DescriptionListTermProps) => (
  <dt data-slot="description-list-term" class={cn(descriptionListTerm(), className)} {...rest}>
    {children}
  </dt>
);
