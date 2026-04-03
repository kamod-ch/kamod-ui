import { useState } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";

const toggle = tv({
  base: [
    "inline-flex shrink-0 items-center justify-center gap-1 rounded-sm text-xs font-medium whitespace-nowrap",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
    "data-[size=sm]:[&_svg:not([class*='size-'])]:size-3",
    "data-[size=lg]:[&_svg:not([class*='size-'])]:size-4",
    "select-none transition-all outline-none",
    "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/45",
    "disabled:pointer-events-none disabled:opacity-50",
    "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:shadow-xs"
  ],
  variants: {
    variant: {
      default: "bg-transparent hover:bg-muted hover:text-muted-foreground",
      outline:
        "border border-input/80 bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/25 dark:border-input/80 dark:hover:bg-input/45"
    },
    size: {
      sm: "h-7 min-w-7 px-1.5 text-[11px] leading-none",
      default: "h-8 min-w-8 px-2",
      lg: "h-9 min-w-9 px-2.5 text-sm",
      icon: "size-8 p-0"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});

type ToggleVariants = VariantProps<typeof toggle>;

export type ToggleProps = Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "class"> &
  ToggleVariants & {
  class?: string;
  defaultPressed?: boolean;
  pressed?: boolean;
  onPressedChange?: (next: boolean) => void;
  children?: ComponentChildren;
};

export const Toggle = ({
  defaultPressed = false,
  pressed,
  onPressedChange,
  variant,
  size,
  class: className,
  children,
  onClick,
  ...rest
}: ToggleProps) => {
  const [localPressed, setLocalPressed] = useState(defaultPressed);
  const isControlled = typeof pressed === "boolean";
  const nextPressed = isControlled ? pressed : localPressed;

  return (
    <button
      type="button"
      aria-pressed={nextPressed}
      data-slot="toggle"
      data-variant={variant ?? "default"}
      data-size={size ?? "default"}
      data-state={nextPressed ? "on" : "off"}
      class={cn(toggle({ variant, size, class: className }))}
      onClick={(event) => {
        const updated = !nextPressed;
        if (!isControlled) {
          setLocalPressed(updated);
        }
        onPressedChange?.(updated);
        onClick?.(event);
      }}
      {...rest}
    >
      {children}
    </button>
  );
};

