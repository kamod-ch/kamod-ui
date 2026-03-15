import { cloneElement, isValidElement, type ComponentChildren, type JSX } from "preact";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";

export const badge = tv({
  base: [
    "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full font-medium whitespace-nowrap",
    "[&+&]:ms-1.5",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "transition-all outline-none focus-visible:ring-3",
    "aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/20",
    "dark:aria-invalid:border-destructive/50 dark:aria-invalid:focus-visible:ring-destructive/40",
    "has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5"
  ],
  variants: {
    variant: {
      default: "bg-foreground text-background focus-visible:ring-outline/50",
      primary: "bg-primary text-primary-foreground focus-visible:ring-primary/50",
      secondary: "bg-secondary text-secondary-foreground focus-visible:ring-secondary/50",
      destructive: "bg-destructive text-destructive-foreground focus-visible:ring-outline/50",
      outline:
        "border-border bg-background focus-visible:border-outline focus-visible:ring-outline/50 dark:bg-input/30 border",
      ghost: "bg-transparent text-foreground hover:bg-muted focus-visible:ring-outline/50",
      link: "h-auto rounded-none border-0 bg-transparent p-0 text-primary underline-offset-4 hover:underline focus-visible:ring-0",
      info: "bg-info text-info-foreground focus-visible:ring-info/50",
      success: "bg-success text-success-foreground focus-visible:ring-success/50",
      warning: "bg-warning text-warning-foreground focus-visible:ring-warning/50",
      error: "border border-error/60 bg-error/90 text-error-foreground focus-visible:ring-error/50"
    },
    size: {
      xxs: "px-2 py-0 text-[10px] leading-4 [&_svg:not([class*='size-'])]:size-2.5",
      xs: "px-2.5 py-0 text-xs leading-4 [&_svg:not([class*='size-'])]:size-3",
      sm: "px-2.5 py-0.5 text-xs [&_svg:not([class*='size-'])]:size-3",
      md: "px-3 py-0.5 text-sm [&_svg:not([class*='size-'])]:size-4",
      lg: "px-4 py-1 text-base [&_svg:not([class*='size-'])]:size-4.5"
    },
    isLink: { true: "cursor-pointer", false: "" }
  },
  compoundVariants: [
    { isLink: true, variant: "default", className: "hover:bg-foreground/90" },
    { isLink: true, variant: "primary", className: "hover:bg-primary/90" },
    { isLink: true, variant: "secondary", className: "hover:bg-secondary/90" },
    { isLink: true, variant: "destructive", className: "hover:bg-destructive/90" },
    { isLink: true, variant: "outline", className: "hover:bg-muted" },
    { isLink: true, variant: "ghost", className: "hover:bg-muted" },
    { isLink: true, variant: "link", className: "hover:underline" },
    { isLink: true, variant: "info", className: "hover:bg-info/90" },
    { isLink: true, variant: "success", className: "hover:bg-success/90" },
    { isLink: true, variant: "warning", className: "hover:bg-warning/90" },
    { isLink: true, variant: "error", className: "hover:bg-error" }
  ],
  defaultVariants: { variant: "default", size: "md", isLink: false }
});

type BadgeCommon = VariantProps<typeof badge> & {
  class?: string;
  children?: ComponentChildren;
  asChild?: boolean;
};

type BadgeAsSpan = BadgeCommon &
  JSX.HTMLAttributes<HTMLSpanElement> & {
    href?: undefined;
  };

type BadgeAsAnchor = BadgeCommon &
  JSX.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type BadgeProps = BadgeAsSpan | BadgeAsAnchor;

export const Badge = ({ variant, size, class: className, children, asChild = false, ...rest }: BadgeProps) => {
  const resolvedVariant = variant ?? "default";
  const resolvedSize = size ?? "md";
  const isHref = "href" in rest && typeof rest.href === "string";
  const isLink = Boolean(isHref);

  const resolvedClass = badge({
    variant: resolvedVariant,
    size: resolvedSize,
    isLink,
    class: className
  });

  if (asChild) {
    if (!isValidElement(children)) {
      return null;
    }

    const childIsAnchor = children.type === "a";
    const childProps = (children.props ?? {}) as JSX.HTMLAttributes<HTMLElement> & {
      class?: string;
      className?: string;
    };

    const asChildClass = badge({
      variant: resolvedVariant,
      size: resolvedSize,
      isLink: childIsAnchor,
      class: className
    });

    return cloneElement(children, {
      ...(rest as JSX.HTMLAttributes<HTMLElement>),
      ...(childProps ?? {}),
      class: cn(asChildClass, childProps.class, childProps.className),
      "data-slot": "badge",
      "data-variant": resolvedVariant
    });
  }

  if (isHref) {
    return (
      <a
        class={resolvedClass}
        data-slot="badge"
        data-variant={resolvedVariant}
        {...(rest as JSX.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <span class={resolvedClass} data-slot="badge" data-variant={resolvedVariant} {...(rest as JSX.HTMLAttributes<HTMLSpanElement>)}>
      {children}
    </span>
  );
};
