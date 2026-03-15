import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type TableCellProps = JSX.HTMLAttributes<HTMLTableCellElement> & {
  children?: ComponentChildren;
  /** @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-colspan */
  colSpan?: number;
};

export const TableCell = ({ class: className, children, colSpan, ...rest }: TableCellProps) => (
  <td
    data-slot="table-cell"
    class={cn(
      "p-2 align-middle [&:has([data-slot=checkbox])]:pr-0 [&:has([role=checkbox])]:pr-0",
      className
    )}
    colSpan={colSpan}
    {...rest}
  >
    {children}
  </td>
);

