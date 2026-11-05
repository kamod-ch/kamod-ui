import type { ButtonHTMLAttributes, ComponentChildren } from "preact";
import { cn } from "../../lib/utils";
import { useMenubarMenu, useMenubarRoot } from "./menubar-context";

export type MenubarTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ComponentChildren;
};

export const MenubarTrigger = ({
  class: className,
  children,
  onClick,
  onKeyDown,
  ref: outerRef,
  ...rest
}: MenubarTriggerProps) => {
  const root = useMenubarRoot();
  const { menuId, triggerRef } = useMenubarMenu();
  const open = root.openMenuId.value === menuId;

  return (
    <button
      ref={(node) => {
        triggerRef.current = node;
        root.rememberTrigger(node);
        if (typeof outerRef === "function") {
          outerRef(node);
        } else if (outerRef && typeof outerRef === "object" && "current" in outerRef) {
          outerRef.current = node;
        }
      }}
      type="button"
      data-slot="menubar-trigger"
      data-state={open ? "open" : "closed"}
      aria-expanded={open}
      aria-haspopup="menu"
      class={cn(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1 text-sm font-medium outline-none",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        className,
      )}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        root.setOpenMenuId(open ? null : menuId);
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          if (!open) {
            root.setOpenMenuId(menuId);
          }
        }
      }}
      {...rest}
    >
      {children}
    </button>
  );
};
