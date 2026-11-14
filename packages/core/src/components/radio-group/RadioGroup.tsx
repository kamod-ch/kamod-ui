import type { ComponentChildren, HTMLAttributes } from "preact";
import { createContext } from "preact";
import { useContext, useEffect, useId, useRef, useState } from "preact/hooks";
import { useFormReset } from "../../lib/form-control";
import { cn } from "../../lib/utils";

type RadioGroupContextValue = {
  value: string | null;
  /** When set, selection follows this prop; otherwise local state is used. */
  controlledValue: string | undefined;
  /** Value restored by a parent form's reset event. */
  resetValue: string | null;
  setValue: (next: string) => void;
  name: string;
  required: boolean;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export const useRadioGroup = () => {
  const context = useContext(RadioGroupContext);
  if (!context) throw new Error("RadioGroupItem must be used inside RadioGroup");
  return context;
};

export type RadioGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "class"> & {
  /** When omitted, a stable unique name is generated (forms can still submit if you add name to inputs manually). */
  name?: string;
  defaultValue?: string;
  value?: string;
  required?: boolean;
  onValueChange?: (next: string) => void;
  class?: string;
  children?: ComponentChildren;
};

export const RadioGroup = ({
  name: nameProp,
  defaultValue,
  value: valueProp,
  required = false,
  onValueChange,
  class: className,
  children,
  ...rest
}: RadioGroupProps) => {
  const autoId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const name = nameProp ?? `radio-group-${autoId}`;
  const resetValueRef = useRef<string | null>(
    valueProp !== undefined ? valueProp : (defaultValue ?? null),
  );
  const [internalValue, setInternalValue] = useState<string | null>(resetValueRef.current);

  useFormReset(rootRef, () => {
    const next = resetValueRef.current;
    if (valueProp === undefined) {
      setInternalValue(next);
      return;
    }
    if (valueProp !== next && next != null) onValueChange?.(next);
  });

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
      value={{
        value: internalValue,
        controlledValue: valueProp,
        resetValue: resetValueRef.current,
        setValue,
        name,
        required,
      }}
    >
      <div
        ref={rootRef}
        role="radiogroup"
        data-slot="radio-group"
        class={cn("grid gap-3", className)}
        {...rest}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};
