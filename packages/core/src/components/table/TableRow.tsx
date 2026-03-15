import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type TableRowProps = JSX.HTMLAttributes<HTMLTableRowElement> & {
  children?: ComponentChildren;
};

export const TableRow = ({ class: className, children, ...rest }: TableRowProps) => (
  <tr
    data-slot="table-row"
    class={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)}
    {...rest}
  >
    {children}
  </tr>
);

