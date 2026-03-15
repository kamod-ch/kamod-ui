import { useState } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { ContextMenuRadioProvider } from "./context-menu-radio-context";

export type ContextMenuRadioGroupProps = JSX.HTMLAttributes<HTMLDivElement> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children?: ComponentChildren;
};

export const ContextMenuRadioGroup = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  class: className,
  children,
  ...rest
}: ContextMenuRadioGroupProps) => {
  const [inner, setInner] = useState(() => defaultValue ?? "");
  const isControlled = valueProp !== undefined;
  const current = isControlled ? valueProp! : inner;
  const setValue = (next: string) => {
    onValueChange?.(next);
    if (!isControlled) setInner(next);
  };

  return (
    <ContextMenuRadioProvider value={{ value: current, setValue }}>
      <div role="radiogroup" data-slot="context-menu-radio-group" class={cn(className)} {...rest}>
        {children}
      </div>
    </ContextMenuRadioProvider>
  );
};
