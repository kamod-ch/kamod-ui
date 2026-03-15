import type { ComponentChildren } from "preact";
import { CommandList, type CommandListProps } from "../command/CommandList";
import { useCombobox } from "./combobox-context";

export type ComboboxListProps = Omit<CommandListProps, "children"> & {
  items?: readonly unknown[];
  children: ComponentChildren | ((item: unknown, index: number) => ComponentChildren);
};

export const ComboboxList = ({ items: itemsProp, children, onMount, ...rest }: ComboboxListProps) => {
  const ctx = useCombobox();
  const list = itemsProp !== undefined ? itemsProp : ctx.items;
  const body =
    typeof children === "function"
      ? list.map((item, index) => (children as (i: unknown, idx: number) => ComponentChildren)(item, index))
      : children;
  return (
    <CommandList
      {...rest}
      onMount={(el) => {
        ctx.comboboxListRef.current = el;
        onMount?.(el);
      }}
    >
      {body}
    </CommandList>
  );
};
