import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { descriptionListItem } from "./description-list-variants";

export type DescriptionListItemProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

/** Groups one `dt`/`dd` pair — valid HTML5 grouping inside `dl`. */
export const DescriptionListItem = ({
  class: className,
  children,
  ...rest
}: DescriptionListItemProps) => (
  <div data-slot="description-list-item" class={cn(descriptionListItem(), className)} {...rest}>
    {children}
  </div>
);
