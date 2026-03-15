import type { ComponentChildren, JSX } from "preact";

export type NativeSelectOptionProps = JSX.OptionHTMLAttributes<HTMLOptionElement> & {
  children?: ComponentChildren;
};

export const NativeSelectOption = ({ children, ...rest }: NativeSelectOptionProps) => <option {...rest}>{children}</option>;

