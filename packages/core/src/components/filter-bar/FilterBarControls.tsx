import type { ComponentChildren, JSX } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { cn } from "../../lib/utils";
import { useFilterBar } from "./filter-bar-context";
import { filterBarControls } from "./filter-bar-variants";

const firstFocusable = (root: HTMLElement | null) => {
  if (!root) return null;
  return root.querySelector<HTMLElement>(
    'input:not([disabled]), button:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  );
};

export type FilterBarControlsProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const FilterBarControls = ({
  class: className,
  children,
  ...rest
}: FilterBarControlsProps) => {
  const { registerFocusFallback } = useFilterBar();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    registerFocusFallback(firstFocusable(ref.current));
  });

  return (
    <div
      ref={ref}
      data-slot="filter-bar-controls"
      class={cn(filterBarControls(), className)}
      {...rest}
    >
      {children}
    </div>
  );
};
