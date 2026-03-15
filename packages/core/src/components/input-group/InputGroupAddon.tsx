import type { ComponentChildren, JSX } from "preact";
import { tv, type VariantProps } from "tailwind-variants";

export const inputGroupAddon = tv({
  base: [
    "text-muted-foreground flex cursor-text items-center justify-center gap-2 text-sm font-medium select-none",
    "group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-xs [&>svg:not([class*='size-'])]:size-4"
  ],
  variants: {
    align: {
      "inline-start": "order-first pl-2.5 has-[>button]:ml-[-0.3rem]",
      "inline-end": "order-last pr-2.5 has-[>button]:mr-[-0.3rem]",
      "block-start":
        "order-first w-full justify-start px-3 pt-2 group-has-[>input]/input-group:pt-2.5 [.border-b]:pb-2.5",
      "block-end":
        "order-last w-full justify-start px-3 pb-2 group-has-[>input]/input-group:pb-2.5 [.border-t]:pt-2.5"
    }
  },
  defaultVariants: {
    align: "inline-start"
  }
});

export type InputGroupAddonProps = JSX.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof inputGroupAddon> & {
    children?: ComponentChildren;
  };

export const InputGroupAddon = ({
  align,
  class: className,
  children,
  onClick,
  ...rest
}: InputGroupAddonProps) => (
  <div
    role="group"
    data-align={align}
    class={inputGroupAddon({ align, class: className as string | undefined })}
    data-slot="input-group-addon"
    onClick={(event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("button")) {
        onClick?.(event);
        return;
      }

      const root = event.currentTarget.parentElement;
      const control = root?.querySelector("input, textarea") as HTMLInputElement | HTMLTextAreaElement | null;
      control?.focus();
      onClick?.(event);
    }}
    {...rest}
  >
    {children}
  </div>
);

