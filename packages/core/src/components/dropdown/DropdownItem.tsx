import type { ComponentChildren, JSX } from "preact";
import { tv, type VariantProps } from "tailwind-variants";
import { useDropdown } from "./Dropdown";

export const dropdownItem = tv({
  base: [
    "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
    "focus:bg-accent focus:text-accent-foreground",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
  ],
  variants: {
    variant: {
      default: "",
      destructive: "text-destructive focus:bg-destructive/10 focus:text-destructive dark:focus:bg-destructive/20"
    },
    inset: {
      true: "ps-8"
    }
  },
  defaultVariants: {
    variant: "default",
    inset: false
  }
});

export type DropdownItemProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof dropdownItem> & {
    children?: ComponentChildren;
  };

export const DropdownItem = ({
  inset = false,
  variant = "default",
  class: className,
  children,
  onClick,
  ...rest
}: DropdownItemProps) => {
  const dropdown = useDropdown();
  return (
    <button
      type="button"
      role="menuitem"
      data-slot="dropdown-item"
      data-inset={inset ? "true" : undefined}
      data-variant={variant}
      class={dropdownItem({ inset, variant, class: className as string | undefined })}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        dropdown.setOpen(false);
      }}
      {...rest}
    >
      {children}
    </button>
  );
};
