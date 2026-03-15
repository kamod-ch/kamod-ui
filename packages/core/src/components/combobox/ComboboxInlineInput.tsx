import type { JSX } from "preact";
import { cn } from "../../lib/utils";
import { usePopover } from "../popover/Popover";
import { useCombobox } from "./combobox-context";

export type ComboboxInlineInputProps = JSX.InputHTMLAttributes<HTMLInputElement>;

/**
 * Base UI–style trigger: the visible field is the filter input; the list opens in `ComboboxContent`.
 * Requires `Combobox liftedFilter` (and usually `ComboboxTrigger asChild` wrapping a positioned container).
 */
export const ComboboxInlineInput = ({
  class: className,
  onKeyDown,
  onInput,
  onFocus,
  ...rest
}: ComboboxInlineInputProps) => {
  const ctx = useCombobox();
  const popover = usePopover();
  if (!ctx.filterQuery) {
    throw new Error("ComboboxInlineInput must be used with Combobox liftedFilter={true}");
  }

  void ctx.filterQuery.value;
  void popover.open.value;

  return (
    <input
      {...rest}
      data-slot="combobox-inline-input"
      class={cn(
        "border-input bg-background placeholder:text-muted-foreground flex h-10 w-full min-w-0 rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      value={ctx.filterQuery.value}
      onInput={(event) => {
        ctx.filterQuery!.value = event.currentTarget.value;
        popover.setOpen(true);
        onInput?.(event);
      }}
      onFocus={(event) => {
        onFocus?.(event);
        popover.setOpen(true);
      }}
      onKeyDown={(event) => {
        const nav = ctx.commandNavRef.current;
        if (ctx.autoHighlight && nav) {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            popover.setOpen(true);
            nav.moveHighlight(1);
            return;
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            popover.setOpen(true);
            nav.moveHighlight(-1);
            return;
          }
          if (event.key === "Enter") {
            event.preventDefault();
            if (popover.open.value) nav.activateHighlighted();
            return;
          }
        }
        onKeyDown?.(event);
      }}
    />
  );
};

