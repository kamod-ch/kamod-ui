import { cloneElement, isValidElement, type ComponentChildren, type JSX } from "preact";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";

export const item = tv({
  base: [
    "group/item flex flex-wrap items-center rounded-md border border-transparent text-sm outline-none transition-[color,background-color,box-shadow] duration-100",
    "[a]:transition-colors [a]:hover:bg-accent/50",
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
  ],
  variants: {
    variant: {
      default: "bg-transparent hover:bg-muted/40",
      outline: "border-border hover:bg-accent/35",
      muted: "bg-muted/50 hover:bg-muted/65",
    },
    size: {
      default: "gap-4 p-4",
      sm: "gap-2.5 px-4 py-3",
      xs: "gap-2 px-3 py-2 text-xs",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export type ItemProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "size"> &
  VariantProps<typeof item> & {
    children?: ComponentChildren;
    asChild?: boolean;
  };

export const Item = ({
  variant,
  size,
  asChild = false,
  class: className,
  children,
  ...rest
}: ItemProps) => {
  const resolvedVariant = variant ?? "default";
  const resolvedSize = size ?? "default";
  const resolvedClassName = item({
    variant: resolvedVariant,
    size: resolvedSize,
    class: className as string | undefined,
  });

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
      "data-slot": "item",
      "data-variant": resolvedVariant,
      "data-size": resolvedSize,
    });
  }

  return (
    <div
      data-slot="item"
      data-variant={resolvedVariant}
      data-size={resolvedSize}
      class={resolvedClassName}
      {...rest}
    >
      {children}
    </div>
  );
};
