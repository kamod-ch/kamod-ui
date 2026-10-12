import type { ComponentChildren, ThHTMLAttributes } from "preact";
import { cn } from "../../lib/utils";

export type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement> & {
  children?: ComponentChildren;
};

export const TableHead = ({ class: className, children, ...rest }: TableHeadProps) => (
  <th
    data-slot="table-head"
    class={cn(
      "text-muted-foreground h-10 px-2 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...rest}
  >
    {children}
  </th>
);
