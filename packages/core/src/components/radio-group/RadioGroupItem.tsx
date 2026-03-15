import type { ComponentChildren, JSX } from "preact";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";
import { useRadioGroup } from "./RadioGroup";

const itemRoot = tv({
  base: [
    "flex cursor-pointer items-center gap-3 text-sm leading-none font-medium text-foreground",
    "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50"
  ],
  variants: {
    size: {
      default: "",
      sm: "gap-2 text-xs"
    }
  },
  defaultVariants: { size: "default" }
});

const indicatorBox = tv({
  base: "relative inline-flex shrink-0 items-center justify-center",
  variants: {
    size: {
      default: "size-4",
      sm: "size-3.5"
    }
  },
  defaultVariants: { size: "default" }
});

const dotSize = tv({
  base: "pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary opacity-0 transition-[opacity,transform] peer-checked:scale-100 peer-checked:opacity-100 scale-75",
  variants: {
    size: {
      default: "size-2.5",
      sm: "size-2"
    }
  },
  defaultVariants: { size: "default" }
});

type ItemVariants = VariantProps<typeof itemRoot>;

export type RadioGroupItemProps = Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  "type" | "name" | "class" | "size"
> &
  ItemVariants & {
    value: string;
    children?: ComponentChildren;
    class?: string;
  };

export const RadioGroupItem = ({
  value,
  children,
  size,
  class: className,
  onChange,
  disabled,
  ...rest
}: RadioGroupItemProps) => {
  const group = useRadioGroup();
  const selected =
    group.controlledValue !== undefined ? group.controlledValue : group.value.value;
  const checked = selected === value;

  return (
    <label
      data-slot="radio-group-item"
      data-state={checked ? "checked" : "unchecked"}
      data-size={size ?? "default"}
      class={cn(itemRoot({ size, class: className }))}
    >
      <span class={indicatorBox({ size })}>
        <input
          type="radio"
          data-slot="radio-group-input"
          class="peer absolute inset-0 z-20 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          name={group.name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={(event) => {
            group.setValue(value);
            onChange?.(event);
            const el = event.currentTarget as HTMLInputElement;
            const selected =
              group.controlledValue !== undefined ? group.controlledValue : group.value.value;
            el.checked = selected === value;
          }}
          {...rest}
        />
        <span
          aria-hidden
          class={cn(
            "pointer-events-none absolute inset-0 z-0 flex items-center justify-center rounded-full border border-input bg-background shadow-xs transition-[color,box-shadow]",
            "peer-focus-visible:outline-none peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50",
            "peer-disabled:opacity-50",
            "peer-checked:border-primary",
            "peer-aria-invalid:border-destructive peer-aria-invalid:ring-destructive/20"
          )}
        />
        <span aria-hidden class={dotSize({ size })} />
      </span>
      {children ? <span data-slot="radio-group-label">{children}</span> : null}
    </label>
  );
};
