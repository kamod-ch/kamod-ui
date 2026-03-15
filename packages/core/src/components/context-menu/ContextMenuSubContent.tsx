import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useContextMenuSub } from "./context-menu-sub-context";

export type ContextMenuSubContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const ContextMenuSubContent = ({
  class: className,
  children,
  onPointerEnter,
  ...rest
}: ContextMenuSubContentProps) => {
  const sub = useContextMenuSub();

  if (!sub.open.value) return null;

  return (
    <div
      role="menu"
      data-slot="context-menu-sub-content"
      data-state="open"
      class={cn(
        "absolute start-full top-0 z-50 min-w-40 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none ms-1 rtl:me-1 rtl:ms-0",
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
