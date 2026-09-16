import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { descriptionListDetails } from "./description-list-variants";

export type DescriptionListDetailsProps = JSX.HTMLAttributes<HTMLElement> & {
  children?: ComponentChildren;
};

export const DescriptionListDetails = ({
  class: className,
  children,
  ...rest
}: DescriptionListDetailsProps) => (
  <dd
    data-slot="description-list-details"
    class={cn(descriptionListDetails(), className)}
    {...rest}
  >
    {children}
  </dd>
);
