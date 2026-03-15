import type { ComponentChildren, JSX } from "preact";

export type NativeSelectOptGroupProps = JSX.OptgroupHTMLAttributes<HTMLOptGroupElement> & {
  children?: ComponentChildren;
};

export const NativeSelectOptGroup = ({ children, ...rest }: NativeSelectOptGroupProps) => (
  <optgroup {...rest}>{children}</optgroup>
);

