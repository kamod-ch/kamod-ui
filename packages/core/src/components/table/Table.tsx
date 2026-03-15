import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type TableProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const Table = ({ class: className, children, ...rest }: TableProps) => (
  <div data-slot="table-wrapper" class={cn("relative w-full overflow-x-auto", className)} {...rest}>
    <table data-slot="table" class="w-full caption-bottom text-sm">
      {children}
    </table>
  </div>
);

