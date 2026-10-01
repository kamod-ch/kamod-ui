import type { ComponentChildren, OptgroupHTMLAttributes } from "preact";

export type NativeSelectOptGroupProps = OptgroupHTMLAttributes<HTMLOptGroupElement> & {
  children?: ComponentChildren;
};

export const NativeSelectOptGroup = ({ children, ...rest }: NativeSelectOptGroupProps) => (
  <optgroup {...rest}>{children}</optgroup>
);
