import type { ComponentChildren, JSX } from "preact";
import { useMemo, useRef } from "preact/hooks";
import { cn } from "../../lib/utils";
import { FilterBarContext } from "./filter-bar-context";
import { filterBar } from "./filter-bar-variants";

export type FilterBarProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const FilterBar = ({ class: className, children, ...rest }: FilterBarProps) => {
  const focusFallbackRef = useRef<HTMLElement | null>(null);

  const contextValue = useMemo(
    () => ({
      focusFallbackRef,
      registerFocusFallback: (node: HTMLElement | null) => {
        focusFallbackRef.current = node;
      },
    }),
    [],
  );

  return (
    <FilterBarContext.Provider value={contextValue}>
      <div data-slot="filter-bar" class={cn(filterBar(), className)} {...rest}>
        {children}
      </div>
    </FilterBarContext.Provider>
  );
};
