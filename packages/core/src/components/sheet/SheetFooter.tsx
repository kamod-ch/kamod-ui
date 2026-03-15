import type { ComponentChildren, JSX } from "preact";

export type SheetFooterProps = JSX.HTMLAttributes<HTMLDivElement> & { children?: ComponentChildren };

export const SheetFooter = ({ children, ...rest }: SheetFooterProps) => (
  <div data-slot="sheet-footer" {...rest}>
    {children}
  </div>
);
