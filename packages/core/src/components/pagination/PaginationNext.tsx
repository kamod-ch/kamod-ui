import type { ComponentChildren } from "preact";
import { cn } from "../../lib/utils";
import { PaginationLink, type PaginationLinkProps } from "./PaginationLink";
import { PaginationChevronRight } from "./pagination-icons";

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
