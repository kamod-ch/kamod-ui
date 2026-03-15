import type { ComponentChildren, JSX } from "preact";

export type SheetHeaderProps = JSX.HTMLAttributes<HTMLDivElement> & { children?: ComponentChildren };

export const SheetHeader = ({ children, ...rest }: SheetHeaderProps) => (
  <div data-slot="sheet-header" {...rest}>
    {children}
  </div>
);
