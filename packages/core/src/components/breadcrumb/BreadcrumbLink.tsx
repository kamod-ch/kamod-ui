import { type AnchorHTMLAttributes, type ComponentChildren, type JSX } from "preact";
import { Slot } from "../../lib/slot";
import { cn } from "../../lib/utils";

export type BreadcrumbLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children?: ComponentChildren;
  asChild?: boolean;
};

const linkClass = "hover:text-foreground transition-colors";

export const BreadcrumbLink = ({
  asChild = false,
  class: className,
  children,
  ...rest
}: BreadcrumbLinkProps) => {
  const mergedClass = cn(linkClass, className);

  if (asChild) {
    return (
      <Slot {...rest} class={mergedClass} data-slot="breadcrumb-link">
        {children}
      </Slot>
    );
  }

  return (
    <a data-slot="breadcrumb-link" class={mergedClass} {...(rest as JSX.IntrinsicElements["a"])}>
      {children}
    </a>
  );
};
