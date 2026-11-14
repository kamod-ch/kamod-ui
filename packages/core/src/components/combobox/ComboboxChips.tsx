import type { ComponentChildren, HTMLAttributes } from "preact";
import { cn } from "../../lib/utils";
import { usePopover } from "../popover/Popover";

export type ComboboxChipsProps = HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

/** Multi-select trigger row: wrap chips + `ComboboxChipsInput` (with `liftedFilter`). */
export const ComboboxChips = ({
  class: className,
  children,
  onClick,
  ...rest
}: ComboboxChipsProps) => {
  const popover = usePopover();

  return (
    <div
      ref={(node) => {
        popover.triggerRef.current = node;
      }}
      id={popover.triggerId}
      data-slot="combobox-chips"
      data-state={popover.open.value ? "open" : "closed"}
      class={cn(
        "border-input bg-background flex min-h-8 w-full min-w-44 flex-wrap items-center gap-1 rounded-md border px-2 py-1 shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
      {...rest}
      onClick={(event) => {
        onClick?.(event);
        popover.setOpen(true);
      }}
    >
      {children}
    </div>
  );
};
