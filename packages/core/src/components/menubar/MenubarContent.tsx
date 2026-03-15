import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useMenubarMenu, useMenubarRoot } from "./menubar-context";

export type MenubarContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const MenubarContent = ({ class: className, children, ...rest }: MenubarContentProps) => {
  const root = useMenubarRoot();
  const { menuId } = useMenubarMenu();
  const open = root.openMenuId.value === menuId;

  if (!open) return null;

  return (
    <div
      role="menu"
      data-slot="menubar-content"
      data-state="open"
      class={cn(
        "absolute start-0 top-full z-50 mt-1 min-w-48 rounded-md border border-border bg-popover p-0 text-popover-foreground shadow-md outline-none",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
