import { useState } from "preact/hooks";
import type { ComponentChildren, JSX } from "preact";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";

const switchRoot = tv({
  base: [
    "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-xs",
    "outline-none transition-all",
    "focus-visible:ring-3 focus-visible:ring-ring/50",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "data-[state=checked]:bg-primary data-[state=checked]:saturate-125 data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80",
    "aria-invalid:ring-destructive/20 aria-invalid:border-destructive"
  ],
  variants: {
    size: {
      default: "h-6 w-11",
      sm: "h-5 w-9"
    }
  },
  defaultVariants: {
    size: "default"
  }
});

const switchThumb = tv({
  base: [
    "pointer-events-none block rounded-full bg-background",
    "shadow-sm ring-0 transition-transform",
    "data-[state=unchecked]:translate-x-0"
  ],
  variants: {
    size: {
      default: "size-5 data-[state=checked]:translate-x-5",
      sm: "size-4 data-[state=checked]:translate-x-4"
    }
  },
  defaultVariants: {
    size: "default"
  }
});

type SwitchVariants = VariantProps<typeof switchRoot>;

export type SwitchProps = Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "class"> &
  SwitchVariants & {
  class?: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onCheckedChange?: (next: boolean) => void;
  children?: ComponentChildren;
};

export const Switch = ({
  defaultChecked = false,
  checked,
  onCheckedChange,
  size,
  class: className,
  children,
  onClick,
  ...rest
}: SwitchProps) => {
  const [localChecked, setLocalChecked] = useState(defaultChecked);
  const isControlled = typeof checked === "boolean";
  const nextChecked = isControlled ? checked : localChecked;

  return (
    <span data-slot="switch-root" class="inline-flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={nextChecked}
        data-slot="switch"
        data-state={nextChecked ? "checked" : "unchecked"}
        data-size={size ?? "default"}
        class={cn(switchRoot({ size, class: className }))}
        onClick={(event) => {
          const updated = !nextChecked;
          if (!isControlled) {
            setLocalChecked(updated);
          }
          onCheckedChange?.(updated);
          onClick?.(event);
        }}
        {...rest}
      >
        <span
          data-slot="switch-thumb"
          data-size={size ?? "default"}
          data-state={nextChecked ? "checked" : "unchecked"}
          class={cn(switchThumb({ size }))}
        />
      </button>
      {children ? <span data-slot="switch-label">{children}</span> : null}
    </span>
  );
};

