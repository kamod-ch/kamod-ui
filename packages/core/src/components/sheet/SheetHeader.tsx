import type { ComponentChildren, HTMLAttributes } from "preact";

export type SheetHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const SheetHeader = ({ children, ...rest }: SheetHeaderProps) => (
  <div data-slot="sheet-header" {...rest}>
    {children}
  </div>
);
