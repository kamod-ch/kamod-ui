import type { ComponentChildren, JSX } from "preact";
import { DropdownRadioProvider, useDropdownRadioRoot } from "./dropdown-radio-context";

export type DropdownRadioGroupProps = JSX.HTMLAttributes<HTMLDivElement> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children?: ComponentChildren;
};

export const DropdownRadioGroup = ({
  value,
  defaultValue = "",
  onValueChange,
  children,
  ...rest
}: DropdownRadioGroupProps) => {
  const ctx = useDropdownRadioRoot(defaultValue, value, onValueChange);

  return (
    <DropdownRadioProvider value={ctx}>
      <div role="group" data-slot="dropdown-radio-group" {...rest}>
        {children}
      </div>
    </DropdownRadioProvider>
  );
};
