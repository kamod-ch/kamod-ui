import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { Button } from "../button/Button";
import { filterBarReset } from "./filter-bar-variants";

export type FilterBarResetProps = Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  onReset: () => void;
  children?: ComponentChildren;
};

export const FilterBarReset = ({
  onReset,
  class: className,
  children,
  onClick,
  ...rest
}: FilterBarResetProps) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    data-slot="filter-bar-reset"
    class={cn(filterBarReset(), className)}
    onClick={(event) => {
      onReset();
      onClick?.(event);
      event.currentTarget.focus();
    }}
    {...rest}
  >
    {children}
  </Button>
);
