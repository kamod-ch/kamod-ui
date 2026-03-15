import { useEffect, useMemo } from "preact/hooks";
import { signal } from "@preact/signals";
import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { MenubarRadioContext } from "./menubar-context";

export type MenubarRadioGroupProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

export const MenubarRadioGroup = ({
  class: className,
  children,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  ...rest
}: MenubarRadioGroupProps) => {
  const selected = useMemo(() => signal(controlledValue ?? defaultValue), []);

  useEffect(() => {
    if (controlledValue !== undefined) selected.value = controlledValue;
  }, [controlledValue, selected]);

  const ctx = useMemo(
    () => ({
      selected,
      controlledValue,
      setValue: (next: string) => {
        if (controlledValue === undefined) selected.value = next;
        onValueChange?.(next);
      }
    }),
    [controlledValue, onValueChange, selected]
  );

  return (
    <MenubarRadioContext.Provider value={ctx}>
      <div role="group" data-slot="menubar-radio-group" class={cn("p-1", className)} {...rest}>
        {children}
      </div>
    </MenubarRadioContext.Provider>
  );
};
