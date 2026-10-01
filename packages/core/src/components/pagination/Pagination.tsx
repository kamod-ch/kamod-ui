import type { ComponentChildren, HTMLAttributes, JSX } from "preact";
import { cn } from "../../lib/utils";

export type PaginationProps = HTMLAttributes<HTMLElement> & {
  children?: ComponentChildren;
};

export const Pagination = ({ class: className, children, ...rest }: PaginationProps) => (
  <nav
    aria-label="pagination"
    data-slot="pagination"
    class={cn("mx-auto flex w-full justify-center", className)}
    {...(rest as JSX.IntrinsicElements["nav"])}
  >
    {children}
  </nav>
);
