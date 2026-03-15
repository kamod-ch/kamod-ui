import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type TableBodyProps = JSX.HTMLAttributes<HTMLTableSectionElement> & {
  children?: ComponentChildren;
};

export const TableBody = ({ class: className, children, ...rest }: TableBodyProps) => (
  <tbody data-slot="table-body" class={cn("[&_tr:last-child]:border-0", className)} {...rest}>
    {children}
  </tbody>
);

