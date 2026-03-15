import type { JSX } from "preact";
import { cn } from "../../lib/utils";
import { PaginationMoreHorizontal } from "./pagination-icons";

export type PaginationEllipsisProps = JSX.HTMLAttributes<HTMLSpanElement>;

export const PaginationEllipsis = ({ class: className, ...rest }: PaginationEllipsisProps) => (
  <span
    data-slot="pagination-ellipsis"
    aria-hidden
    class={cn("text-muted-foreground flex size-9 items-center justify-center", className)}
    {...rest}
  >
    <PaginationMoreHorizontal />
    <span class="sr-only">More pages</span>
  </span>
);

