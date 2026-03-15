import type { ComponentChildren, JSX } from "preact";
import { PaginationChevronRight } from "./pagination-icons";
import { PaginationLink, type PaginationLinkProps } from "./PaginationLink";
import { cn } from "../../lib/utils";

export type PaginationNextProps = Omit<PaginationLinkProps, "children"> & {
  children?: ComponentChildren;
  text?: string;
};

export const PaginationNext = ({
  children,
  text = "Next",
  class: className,
  ...rest
}: PaginationNextProps) => (
  <PaginationLink
    data-slot="pagination-next"
    aria-label="Go to next page"
    size="default"
    class={cn("gap-1 pr-2.5 sm:pl-2.5", className)}
    {...rest}
  >
    {children !== undefined && children !== null ? (
      children
    ) : (
      <>
        <span class="hidden sm:inline">{text}</span>
        <PaginationChevronRight />
      </>
    )}
  </PaginationLink>
);
