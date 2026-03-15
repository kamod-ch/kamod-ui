import { type Signal, useSignal } from "@preact/signals";
import { createContext } from "preact";
import { useEffect, useId } from "preact/hooks";
import { useContext } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

type RadioGroupContextValue = {
  value: Signal<string | null>;
  /** When set, selection follows this prop (controlled); otherwise `value` signal is used. */
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
  const internal = useSignal<string | null>(
    valueProp !== undefined ? valueProp : (defaultValue ?? null)
  );

  useEffect(() => {
    if (valueProp !== undefined) {
      internal.value = valueProp;
    }
  }, [valueProp]);

  const setValue = (next: string) => {
    if (valueProp === undefined) {
      internal.value = next;
    }
    onValueChange?.(next);
  };

  return (
    <RadioGroupContext.Provider
      value={{ value: internal, controlledValue: valueProp, setValue, name }}
    >
      <div role="radiogroup" data-slot="radio-group" class={cn("grid gap-3", className)} {...rest}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};
