import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useMenubarRoot } from "./menubar-context";

export type MenubarItemProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ComponentChildren;
  inset?: boolean;
  variant?: "default" | "destructive";
};

export const MenubarItem = ({
  class: className,
  inset = false,
  variant = "default",
  children,
  disabled,
  onClick,
  ...rest
}: MenubarItemProps) => {
  const root = useMenubarRoot();

  return (
    <button
      type="button"
      role="menuitem"
      data-slot="menubar-item"
      data-inset={inset ? "true" : undefined}
      data-variant={variant}
      disabled={disabled}
      class={cn(
        "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-start text-sm outline-none",
        "focus:bg-accent focus:text-accent-foreground",
        "disabled:pointer-events-none disabled:opacity-50",
        inset && "ps-8",
        variant === "destructive" && "text-destructive focus:bg-destructive/10 focus:text-destructive",
        className
      )}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        root.setOpenMenuId(null);
      }}
      {...rest}
    >
      {children}
    </button>
  );
};
