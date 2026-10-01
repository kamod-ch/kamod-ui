import {
  type AnchorHTMLAttributes,
  type ComponentChildren,
  cloneElement,
  type HTMLAttributes,
  isValidElement,
  type JSX,
} from "preact";
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
    if (!isValidElement(children)) {
      return null;
    }

    const childProps = (children.props ?? {}) as HTMLAttributes<HTMLElement> & {
      class?: string;
      className?: string;
    };

    return cloneElement(children, {
      ...(rest as HTMLAttributes<HTMLElement>),
      ...childProps,
      class: cn(mergedClass, childProps.class, childProps.className),
      "data-slot": "breadcrumb-link",
    });
  }

  return (
    <a data-slot="breadcrumb-link" class={mergedClass} {...(rest as JSX.IntrinsicElements["a"])}>
      {children}
    </a>
  );
};
