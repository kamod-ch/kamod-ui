import type { ComponentChildren, HTMLAttributes } from "preact";

export type SheetFooterProps = HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const SheetFooter = ({ children, ...rest }: SheetFooterProps) => (
  <div data-slot="sheet-footer" {...rest}>
    {children}
  </div>
);
