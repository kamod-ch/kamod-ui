import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type TableHeaderProps = JSX.HTMLAttributes<HTMLTableSectionElement> & {
  children?: ComponentChildren;
};

export const TableHeader = ({ class: className, children, ...rest }: TableHeaderProps) => (
  <thead data-slot="table-header" class={cn("[&_tr]:border-b", className)} {...rest}>
    {children}
  </thead>
);

