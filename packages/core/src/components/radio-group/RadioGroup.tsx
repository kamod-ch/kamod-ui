import type { ComponentChildren, JSX } from "preact";
import { createContext } from "preact";
import { useContext, useEffect, useId, useState } from "preact/hooks";
import { cn } from "../../lib/utils";

type RadioGroupContextValue = {
  value: string | null;
  /** When set, selection follows this prop; otherwise local state is used. */
  controlledValue: string | undefined;
  setValue: (next: string) => void;
  name: string;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export const useRadioGroup = () => {
  const context = useContext(RadioGroupContext);
  if (!context) throw new Error("RadioGroupItem must be used inside RadioGroup");
  return context;
};

export type RadioGroupProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "class"> & {
  /** When omitted, a stable unique name is generated (forms can still submit if you add name to inputs manually). */
  name?: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (next: string) => void;
  class?: string;
  children?: ComponentChildren;
};

export const RadioGroup = ({
  name: nameProp,
  defaultValue,
  value: valueProp,
  onValueChange,
  class: className,
  children,
  ...rest
}: RadioGroupProps) => {
  const autoId = useId();
  const name = nameProp ?? `radio-group-${autoId}`;
  const [internalValue, setInternalValue] = useState<string | null>(
    valueProp !== undefined ? valueProp : (defaultValue ?? null),
  );

  useEffect(() => {
    if (valueProp !== undefined) {
      setInternalValue(valueProp);
    }
  }, [valueProp]);

  const setValue = (next: string) => {
    if (valueProp === undefined) {
      setInternalValue(next);
    }
    onValueChange?.(next);
  };

  return (
    <RadioGroupContext.Provider
      value={{ value: internalValue, controlledValue: valueProp, setValue, name }}
    >
      <div role="radiogroup" data-slot="radio-group" class={cn("grid gap-3", className)} {...rest}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};
