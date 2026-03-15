import type { ComponentChildren, JSX } from "preact";
import { tv, type VariantProps } from "tailwind-variants";
import { button } from "../button/Button";

export const inputGroupButton = tv({
  base: "gap-2 shadow-none",
  variants: {
    size: {
      sm: "h-8 px-2",
      "icon-xs": "size-6 rounded-full p-0 has-[>svg]:p-0",
      "icon-sm": "size-8 rounded-full p-0 has-[>svg]:p-0"
    }
  },
  defaultVariants: {
    size: "sm"
  }
});

export type InputGroupButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button> &
  VariantProps<typeof inputGroupButton> & {
    children?: ComponentChildren;
  };

export const InputGroupButton = ({
  type = "button",
  variant = "ghost",
  size,
  class: className,
  children,
  ...rest
}: InputGroupButtonProps) => (
  <button
    type={type}
    class={`${button({ variant, size, class: className as string | undefined })} ${inputGroupButton({ size })}`}
    data-slot="input-group-button"
    {...rest}
  >
    {children}
  </button>
);

