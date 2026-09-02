import type { ComponentChildren, JSX } from "preact";
import { tv, type VariantProps } from "tailwind-variants";
import { useDropdown } from "./Dropdown";

const dropdownItem = tv({
  base: [
    "relative flex w-full cursor-default select-none items-center gap-1 rounded-sm px-1 py-0.5 text-sm outline-none transition-colors duration-100 ease-out",
    "text-popover-foreground hover:bg-accent hover:text-accent-foreground",
    "focus:bg-accent focus:text-accent-foreground",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  ],
  variants: {
    variant: {
      default: "",
      destructive:
        "text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive dark:focus:bg-destructive/20 [&_svg]:text-destructive",
    },
    inset: {
      true: "ps-6",
    },
  },
  defaultVariants: {
    variant: "default",
    inset: false,
  },
});

type DropdownItemSharedProps = VariantProps<typeof dropdownItem> & {
  children?: ComponentChildren;
};

export type DropdownItemProps = DropdownItemSharedProps &
  (
    | (Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "href"> & { href?: undefined })
    | (JSX.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
  );

export const DropdownItem = ({
  inset = false,
  variant = "default",
  class: className,
  children,
  onClick,
  href,
  ...rest
}: DropdownItemProps) => {
  const dropdown = useDropdown();
  const resolvedClass = dropdownItem({
    inset,
    variant,
    class: className as string | undefined,
  });

  const handleActivate = (event: JSX.TargetedMouseEvent<HTMLElement>) => {
    (onClick as ((event: JSX.TargetedMouseEvent<HTMLElement>) => void) | undefined)?.(event);
    if (event.defaultPrevented) return;
    dropdown.setOpen(false);
  };

  if (href) {
    return (
      <a
        href={href}
        role="menuitem"
        data-slot="dropdown-item"
        data-inset={inset ? "true" : undefined}
        data-variant={variant}
        class={resolvedClass}
        onClick={handleActivate}
        {...(rest as JSX.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      role="menuitem"
      data-slot="dropdown-item"
      data-inset={inset ? "true" : undefined}
      data-variant={variant}
      class={resolvedClass}
      onClick={handleActivate as JSX.MouseEventHandler<HTMLButtonElement>}
      {...(rest as JSX.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
};
