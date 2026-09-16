import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { filterBarMeta } from "./filter-bar-variants";

export type FilterBarMetaProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

/** Trailing row for result count, reset, and similar actions. */
export const FilterBarMeta = ({ class: className, children, ...rest }: FilterBarMetaProps) => (
  <div data-slot="filter-bar-meta" class={cn(filterBarMeta(), className)} {...rest}>
    {children}
  </div>
);
