import type { JSX } from "preact";
import { cn } from "../../lib/utils";
import { CommandItem, type CommandItemProps } from "../command/CommandItem";
import { usePopover } from "../popover/Popover";
import { useCombobox } from "./combobox-context";

export type ComboboxItemProps = Omit<CommandItemProps, "value" | "onSelect"> & {
  item: unknown;
};

export const ComboboxItem = ({
  item,
  class: className,
  children,
  disabled,
  onClick,
  ...rest
}: ComboboxItemProps) => {
  const ctx = useCombobox();
  const popover = usePopover();
  const filterValue = ctx.itemToString(item);
  const key = ctx.itemKey(item);
  const selected = ctx.multiple ? ctx.selectedKeys.includes(key) : ctx.selectedKey === key;

  return (
    <CommandItem
      value={filterValue}
      disabled={disabled}
      class={cn(selected && "bg-accent/60", className)}
      onSelect={() => {
        if (ctx.multiple) {
          ctx.toggleByItem(item);
          if (ctx.closeOnSelect) popover.setOpen(false);
        } else {
          ctx.selectByItem(item);
          popover.setOpen(false);
        }
      }}
      onClick={onClick}
      {...rest}
    >
      {children}
    </CommandItem>
  );
};
