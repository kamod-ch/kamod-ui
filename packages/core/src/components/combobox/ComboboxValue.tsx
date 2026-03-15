import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { comboboxSelectionLabel, useCombobox } from "./combobox-context";

export type ComboboxValueProps = Omit<JSX.HTMLAttributes<HTMLSpanElement>, "children"> & {
  placeholder?: string;
  children?:
    | ((state: { label: string; empty: boolean; keys: string[] }) => ComponentChildren)
    | ComponentChildren;
};

export const ComboboxValue = ({ placeholder: placeholderProp, children, class: className, ...rest }: ComboboxValueProps) => {
  const ctx = useCombobox();
  const label = comboboxSelectionLabel(ctx);
  const empty = ctx.selectedKeys.length === 0;

  if (typeof children === "function") {
    return <>{children({ label, empty, keys: ctx.selectedKeys })}</>;
  }

  return (
    <span
      data-slot="combobox-value"
      class={cn("truncate", empty && "text-muted-foreground", className)}
      {...rest}
    >
      {empty ? placeholderProp ?? ctx.placeholder : label}
    </span>
  );
};
