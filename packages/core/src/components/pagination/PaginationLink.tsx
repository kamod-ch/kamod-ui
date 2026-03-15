import type { ComponentChildren, JSX } from "preact";
import type { VariantProps } from "tailwind-variants";
import { button } from "../button/Button";
import { cn } from "../../lib/utils";

export type PaginationLinkProps = Omit<JSX.AnchorHTMLAttributes<HTMLAnchorElement>, "size"> & {
  isActive?: boolean;
  size?: VariantProps<typeof button>["size"];
  children?: ComponentChildren;
  "data-slot"?: string;
};

export const PaginationLink = ({
  isActive = false,
  size = "default",
  class: className,
  "data-slot": dataSlot = "pagination-link",
  children,
  ...rest
}: PaginationLinkProps) => {
  const r = rest as Record<string, unknown>;
  const restStyleClass = (r.class ?? r.className) as string | undefined;
  const { class: _c, className: _cn, ...anchorRest } = r;

  return (
    <a
      {...(anchorRest as JSX.AnchorHTMLAttributes<HTMLAnchorElement>)}
      data-slot={dataSlot}
      aria-current={isActive ? "page" : undefined}
      class={cn(
        button({ variant: isActive ? "outline" : "ghost", size }),
        "h-9 min-w-9 justify-center px-2.5 [&_svg]:size-4 [&_svg]:shrink-0",
        className,
        restStyleClass
      )}
    >
      {children}
    </a>
  );
};
