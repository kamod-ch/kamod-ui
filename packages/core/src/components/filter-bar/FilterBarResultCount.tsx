import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { filterBarResultCount } from "./filter-bar-variants";

export type FilterBarResultCountProps = JSX.HTMLAttributes<HTMLParagraphElement> & {
  children?: ComponentChildren;
  /** @default "polite" */
  live?: "off" | "polite" | "assertive";
};

export const FilterBarResultCount = ({
  class: className,
  children,
  live = "polite",
  ...rest
}: FilterBarResultCountProps) => (
  <p
    data-slot="filter-bar-result-count"
    class={cn(filterBarResultCount(), className)}
    aria-live={live}
    aria-atomic="true"
    {...rest}
  >
    {children}
  </p>
);
