import { signal } from "@preact/signals";
import { createContext } from "preact";
import { useContext, useEffect, useMemo, useRef } from "preact/hooks";

export type DropdownRadioContextValue = {
  value: ReturnType<typeof signal<string>>;
  setValue: (next: string) => void;
};

const DropdownRadioContext = createContext<DropdownRadioContextValue | null>(null);

export const DropdownRadioProvider = DropdownRadioContext.Provider;

export const useDropdownRadio = () => {
  const ctx = useContext(DropdownRadioContext);
  if (!ctx) throw new Error("DropdownRadioItem must be used within DropdownRadioGroup");
  return ctx;
};

export const useDropdownRadioRoot = (
  defaultValue: string,
  valueProp: string | undefined,
  onValueChange: ((v: string) => void) | undefined
): DropdownRadioContextValue => {
  const internal = useMemo(() => signal(valueProp ?? defaultValue), []);
  const controlledRef = useRef(false);
  controlledRef.current = valueProp !== undefined;

  useEffect(() => {
    if (valueProp !== undefined) {
      internal.value = valueProp;
    }
  }, [valueProp, internal]);

  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;

  return useMemo(
    (): DropdownRadioContextValue => ({
      value: internal,
      setValue: (next: string) => {
        if (!controlledRef.current) {
          internal.value = next;
        }
        onValueChangeRef.current?.(next);
      }
    }),
    [internal]
  );
};
