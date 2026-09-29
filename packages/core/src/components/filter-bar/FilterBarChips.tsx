import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { filterBarChips } from "./filter-bar-variants";

export type FilterBarChipsProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const FilterBarChips = ({ class: className, children, ...rest }: FilterBarChipsProps) => (
  <div data-slot="filter-bar-chips" class={cn(filterBarChips(), className)} role="list" {...rest}>
    {children}
  </div>
);
