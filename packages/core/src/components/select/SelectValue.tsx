import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useSelect } from "./Select";

export type SelectValueProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  placeholder?: string;
  children?: ComponentChildren;
};

export const SelectValue = ({ placeholder = "Select", children, class: className, ...rest }: SelectValueProps) => {
  const select = useSelect();
  return (
    <span data-slot="select-value" class={cn("line-clamp-1 text-left", className)} {...rest}>
      {children ?? select.selectedValue.value ?? placeholder}
    </span>
  );
};

