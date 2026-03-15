import { cn } from "../../lib/utils";
import { PopoverTrigger, type PopoverTriggerProps } from "../popover/PopoverTrigger";
import { useCombobox } from "./combobox-context";

export const ComboboxTrigger = ({ class: className, disabled, ...rest }: PopoverTriggerProps) => {
  const ctx = useCombobox();
  return (
    <PopoverTrigger
      class={cn(
        "border-input bg-background hover:bg-muted/50 flex h-8 w-full min-w-44 items-center justify-between gap-2 rounded-md border px-3 py-1 text-start text-sm font-normal shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      disabled={disabled ?? ctx.disabled}
      {...rest}
    />
  );
};

export type { PopoverTriggerProps as ComboboxTriggerProps };
