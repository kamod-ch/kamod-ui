import type { JSX } from "preact";
import { useId } from "preact/hooks";
import { cn } from "../../lib/utils";
import { Input } from "../input/Input";
import { Label } from "../label/Label";
import { filterBarSearch } from "./filter-bar-variants";

export type FilterBarSearchProps = Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange" | "onInput" | "size"
> & {
  label: string;
  value: string;
  onValueChange: (next: string) => void;
  inputClass?: string;
  size?: "sm" | "md" | "lg";
};

export const FilterBarSearch = ({
  label,
  value,
  onValueChange,
  class: className,
  inputClass,
  id: idProp,
  placeholder,
  size,
  ...rest
}: FilterBarSearchProps) => {
  const autoId = useId();
  const id = idProp ?? autoId;

  return (
    <div data-slot="filter-bar-search" class={cn(filterBarSearch(), className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        {...rest}
        id={id}
        type="search"
        size={size}
        value={value}
        placeholder={placeholder}
        class={inputClass}
        onInput={(event) => onValueChange(event.currentTarget.value)}
      />
    </div>
  );
};
