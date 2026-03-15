import type { ComponentChildren, JSX } from "preact";
import { PaginationChevronLeft } from "./pagination-icons";
import { PaginationLink, type PaginationLinkProps } from "./PaginationLink";
import { cn } from "../../lib/utils";

export type PaginationPreviousProps = Omit<PaginationLinkProps, "children"> & {
  children?: ComponentChildren;
  text?: string;
};

export const PaginationPrevious = ({
  children,
  text = "Previous",
  class: className,
  ...rest
}: PaginationPreviousProps) => (
  <PaginationLink
    data-slot="pagination-previous"
    aria-label="Go to previous page"
    size="default"
    class={cn("gap-1 pl-2.5 sm:pr-2.5", className)}
    {...rest}
  >
    {children !== undefined && children !== null ? (
      children
    ) : (
      <>
        <PaginationChevronLeft />
        <span class="hidden sm:inline">{text}</span>
      </>
    )}
  </PaginationLink>
);
