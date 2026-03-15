import type { JSX } from "preact";
import { cn } from "../../lib/utils";
import { usePopover } from "../popover/Popover";
import { useCombobox } from "./combobox-context";

export type ComboboxChipsInputProps = JSX.InputHTMLAttributes<HTMLInputElement>;

/** Filter field at the end of the chip row; requires `Combobox liftedFilter`. */
export const ComboboxChipsInput = ({
  class: className,
  onKeyDown,
  onInput,
  onFocus,
  ...rest
}: ComboboxChipsInputProps) => {
  const ctx = useCombobox();
  const popover = usePopover();
  if (!ctx.filterQuery) {
    throw new Error("ComboboxChipsInput must be used with Combobox liftedFilter={true}");
  }

  void ctx.filterQuery.value;
  void popover.open.value;

  return (
    <input
      {...rest}
      data-slot="combobox-chips-input"
      class={cn(
        "placeholder:text-muted-foreground min-w-[6rem] flex-1 border-0 bg-transparent px-1 py-1 text-sm outline-none",
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
