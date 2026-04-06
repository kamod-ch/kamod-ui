import { cloneElement, isValidElement, type ComponentChildren, type JSX } from "preact";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";

export const button = tv({
  base: [
    "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg bg-clip-padding text-sm font-medium whitespace-nowrap",
    "select-none transition-all outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
    "active:translate-y-px disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
    "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    "has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
  ],
  variants: {
    variant: {
      default: "bg-primary text-background hover:bg-foreground/90 focus-visible:ring-outline/50",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 focus-visible:ring-secondary/50",
      inverse: "bg-foreground text-background hover:opacity-[0.85] focus-visible:ring-outline/50",
      outline:
        "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50 border",
      ghost: "hover:bg-muted hover:text-foreground focus-visible:ring-outline/50",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-outline/50",
      link: "h-auto p-0 text-primary underline-offset-4 hover:underline active:translate-y-0 focus-visible:ring-0"
    },
    size: {
      xxs: "h-5 gap-1 px-1.5 text-[10px]",
      xs: "h-6 gap-1 px-2 text-xs",
      sm: "h-7 gap-1.5 px-3",
      default: "h-8 gap-1.5 px-2.5",
      lg: "h-9 gap-2 px-5 text-base has-[>svg]:px-4 [&_svg:not([class*='size-'])]:size-4.5",
      icon: "size-8",
      "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3.5",
      "icon-sm": "size-7 [&_svg:not([class*='size-'])]:size-4",
      "icon-lg": "size-9 [&_svg:not([class*='size-'])]:size-5"
    }
  },
  defaultVariants: { variant: "default", size: "default" }
});

type CommonProps = VariantProps<typeof button> & {
  class?: string;
  asChild?: boolean;
  children?: ComponentChildren;
};

type ButtonAsButton = CommonProps &
  JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsAnchor = CommonProps &
  JSX.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export const Button = ({ variant, size, asChild = false, class: className, children, ...rest }: ButtonProps) => {
  const resolvedVariant = variant ?? "default";
  const resolvedSize = size ?? "default";
  const resolvedClassName = button({ variant: resolvedVariant, size: resolvedSize, class: className });

  if (asChild) {
    if (!isValidElement(children)) {
      return null;
    }

    const childProps = (children.props ?? {}) as JSX.HTMLAttributes<HTMLElement> & {
      class?: string;
      className?: string;
    };

    return cloneElement(children, {
      ...(childProps ?? {}),
      ...(rest as JSX.HTMLAttributes<HTMLElement>),
      class: cn(childProps.class, childProps.className, resolvedClassName),
      "data-slot": "button",
      "data-variant": resolvedVariant,
      "data-size": resolvedSize
    });
  }

  if ("href" in rest && typeof rest.href === "string") {
    return (
      <a
        class={resolvedClassName}
        data-slot="button"
        data-variant={resolvedVariant}
        data-size={resolvedSize}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      class={resolvedClassName}
      data-slot="button"
      data-variant={resolvedVariant}
      data-size={resolvedSize}
      {...rest}
    >
      {children}
    </button>
  );
};

