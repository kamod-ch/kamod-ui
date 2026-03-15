import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { Table } from "../table/Table";

export type DataTableProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
  /**
   * When true (default), wraps the table in `overflow-hidden rounded-md border` like shadcn data tables.
   * Set false if you already provide an outer chrome or use a bare `<Table>`.
   */
  chrome?: boolean;
};

export const DataTable = ({
  chrome = true,
  class: className,
  children,
  ...rest
}: DataTableProps) => (
  <div data-slot="data-table" class={cn("w-full", className)} {...rest}>
    {chrome ? (
      <div class="overflow-hidden rounded-md border bg-card text-card-foreground">
        <Table class="rounded-none border-0 shadow-none">{children}</Table>
      </div>
    ) : (
      <Table>{children}</Table>
    )}
  </div>
);
