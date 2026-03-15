import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { PopoverTrigger } from "../popover/PopoverTrigger";

export type ComboboxChipsProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

/** Multi-select trigger row: wrap chips + `ComboboxChipsInput` (with `liftedFilter`). */
export const ComboboxChips = ({ class: className, children, ...rest }: ComboboxChipsProps) => (
  <PopoverTrigger asChild>
    <div
      data-slot="combobox-chips"
      class={cn(
        "border-input bg-background flex min-h-8 w-full min-w-44 flex-wrap items-center gap-1 rounded-md border px-2 py-1 shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  </PopoverTrigger>
);
