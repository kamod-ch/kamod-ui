import type { ComponentChildren, JSX } from "preact";
import type { VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";
import { pageHeaderTitle } from "./page-header-variants";

export type PageHeaderTitleLevel = "h1" | "h2" | "h3";

export type PageHeaderTitleProps = Omit<JSX.HTMLAttributes<HTMLHeadingElement>, "as"> &
  VariantProps<typeof pageHeaderTitle> & {
    as?: PageHeaderTitleLevel;
    children?: ComponentChildren;
  };

export const PageHeaderTitle = ({
  as = "h1",
  size,
  class: className,
  children,
  ...rest
}: PageHeaderTitleProps) => {
  const resolvedSize = size ?? "default";
  const props = {
    "data-slot": "page-header-title",
    "data-level": as,
    "data-size": resolvedSize,
    class: cn(pageHeaderTitle({ size: resolvedSize }), className),
    ...rest,
  } as JSX.HTMLAttributes<HTMLHeadingElement>;

  if (as === "h2") {
    return <h2 {...props}>{children}</h2>;
  }
  if (as === "h3") {
    return <h3 {...props}>{children}</h3>;
  }
  return <h1 {...props}>{children}</h1>;
};

export const PageHeaderTitleVariants = {
  pageHeaderTitle,
} satisfies { pageHeaderTitle: typeof pageHeaderTitle };
