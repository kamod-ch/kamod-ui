import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useMenubarSub } from "./menubar-context";

export type MenubarSubContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const MenubarSubContent = ({ class: className, children, onPointerEnter, ...rest }: MenubarSubContentProps) => {
  const sub = useMenubarSub();

  if (!sub.open.value) return null;

  return (
    <div
      role="menu"
      data-slot="menubar-sub-content"
      data-state="open"
      class={cn(
        "absolute start-full top-0 z-50 min-w-40 rounded-md border border-border bg-popover p-0 text-popover-foreground shadow-md outline-none ms-1 rtl:me-1 rtl:ms-0",
        className
      )}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        sub.setOpen(true);
      }}
      {...rest}
    >
      {children}
    </div>
  );
};
