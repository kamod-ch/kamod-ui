import type { ComponentChildren, JSX } from "preact";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";
import { useToggleGroup } from "./ToggleGroup";

const toggleGroupItem = tv({
  base: [
    "inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    "data-[size=sm]:[&_svg:not([class*='size-'])]:size-3.5",
    "data-[size=lg]:[&_svg:not([class*='size-'])]:size-4.5",
    "select-none transition-all outline-none",
    "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-50",
    "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:shadow-xs"
  ],
  variants: {
    variant: {
      default: "bg-transparent hover:bg-muted hover:text-muted-foreground",
      outline:
        "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
      pill: "rounded-full border border-transparent bg-muted/70 hover:bg-muted"
    },
    size: {
      sm: "h-8 min-w-8 gap-1 px-2 text-xs",
      default: "h-9 min-w-9 gap-1.5 px-2.5",
      lg: "h-10 min-w-10 gap-2 px-3.5 text-base"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});

type ToggleGroupItemVariants = VariantProps<typeof toggleGroupItem>;

export type ToggleGroupItemProps = Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "class"> &
  ToggleGroupItemVariants & {
    class?: string;
    value: string;
    children?: ComponentChildren;
  };

export const ToggleGroupItem = ({
  class: className,
  value,
  variant,
  size,
  disabled,
  children,
  onClick,
  ...rest
}: ToggleGroupItemProps) => {
  const { values, toggle, disabled: groupDisabled, itemVariant, itemSize } = useToggleGroup();
  const pressed = values.includes(value);
  const isDisabled = groupDisabled || disabled;
  const resolvedVariant = variant ?? itemVariant ?? "default";
  const resolvedSize = size ?? itemSize ?? "default";

  return (
    <button
      type="button"
      data-slot="toggle-group-item"
      data-state={pressed ? "on" : "off"}
      data-variant={resolvedVariant}
      data-size={resolvedSize}
      aria-pressed={pressed}
      disabled={isDisabled}
      class={cn(toggleGroupItem({ variant: resolvedVariant, size: resolvedSize, class: className }))}
      onClick={(event) => {
        if (isDisabled) return;
        toggle(value);
        onClick?.(event);
      }}
      {...rest}
    >
      {children}
    </button>
  );
};

