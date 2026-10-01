import type { ComponentChildren, OptionHTMLAttributes } from "preact";

export type NativeSelectOptionProps = OptionHTMLAttributes<HTMLOptionElement> & {
  children?: ComponentChildren;
};

export const NativeSelectOption = ({ children, ...rest }: NativeSelectOptionProps) => (
  <option {...rest}>{children}</option>
);
