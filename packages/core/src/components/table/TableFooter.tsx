import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type TableFooterProps = JSX.HTMLAttributes<HTMLTableSectionElement> & {
  children?: ComponentChildren;
};

export const TableFooter = ({ class: className, children, ...rest }: TableFooterProps) => (
  <tfoot
    data-slot="table-footer"
    class={cn("bg-muted/50 border-t font-medium [&>tr]:last:border-b-0", className)}
    {...rest}
  >
    {children}
  </tfoot>
);

