import { PopoverContent, type PopoverContentProps } from "../popover/PopoverContent";
import { usePopover } from "../popover/Popover";
import { cn } from "../../lib/utils";
import { useCombobox } from "./combobox-context";

export const ComboboxContent = ({
  forceMount: forceMountProp,
  class: className,
  ...rest
}: PopoverContentProps) => {
  const popover = usePopover();
  const ctx = useCombobox();
  const forceMount = forceMountProp ?? ctx.liftedFilter;
  return (
    <PopoverContent
      forceMount={forceMount}
      class={cn(
        "w-64 max-w-[calc(100vw-1.5rem)] gap-0 overflow-hidden p-0",
        ctx.liftedFilter &&
          !popover.open.value &&
          "pointer-events-none invisible max-h-0 min-h-0 border-0 p-0 opacity-0 shadow-none",
        className
      )}
      {...rest}
    />
  );
};

export type { PopoverContentProps as ComboboxContentProps };
