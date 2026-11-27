import type { ButtonHTMLAttributes, ComponentChildren } from "preact";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";
import { button } from "../button/Button";

export const inputGroupButton = tv({
  base: "gap-2 shadow-none",
  variants: {
    size: {
      sm: "h-8 px-2",
      "icon-xs": "size-6 rounded-full p-0 has-[>svg]:p-0",
      "icon-sm": "size-8 rounded-full p-0 has-[>svg]:p-0",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

export type InputGroupButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
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
}: InputGroupButtonProps) => {
  const domRest = { ...(rest as Record<string, unknown>) };
  // Slot forwards the same tokens as `class` and `className`. Preact applies
  // `className` after `class` and would otherwise drop the variant classes.
  const classNameAlias = typeof domRest.className === "string" ? domRest.className : undefined;
  if (classNameAlias !== undefined) delete domRest.className;

  return (
    <button
      type={type}
      class={cn(button({ variant, size }), inputGroupButton({ size }), className, classNameAlias)}
      data-slot="input-group-button"
      {...domRest}
    >
      {children}
    </button>
  );
};
