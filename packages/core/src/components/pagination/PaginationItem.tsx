import type { ComponentChildren, HTMLAttributes } from "preact";

export type PaginationItemProps = HTMLAttributes<HTMLLIElement> & {
  children?: ComponentChildren;
};

export const PaginationItem = ({ children, ...rest }: PaginationItemProps) => (
  <li data-slot="pagination-item" {...rest}>
    {children}
  </li>
);
