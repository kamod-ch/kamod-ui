import type { ComponentChildren, JSX } from "preact";

export type PaginationItemProps = JSX.HTMLAttributes<HTMLLIElement> & {
  children?: ComponentChildren;
};

export const PaginationItem = ({ children, ...rest }: PaginationItemProps) => (
  <li data-slot="pagination-item" {...rest}>
    {children}
  </li>
);

