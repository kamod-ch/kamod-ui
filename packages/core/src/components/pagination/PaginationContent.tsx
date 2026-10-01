import type { ComponentChildren, HTMLAttributes } from "preact";
import { cn } from "../../lib/utils";

export type PaginationContentProps = HTMLAttributes<HTMLUListElement> & {
  children?: ComponentChildren;
};

export const PaginationContent = ({
  class: className,
  children,
  ...rest
}: PaginationContentProps) => (
  <ul
    data-slot="pagination-content"
    class={cn("flex flex-row items-center gap-1 list-none", className)}
    {...rest}
  >
    {children}
  </ul>
);
