import type { ComponentChildren, HTMLAttributes } from "preact";
import { useLayoutEffect, useRef } from "preact/hooks";
import { focusInitialMenuItem, handleMenuContentKeyDown } from "../../lib/interactive";
import { cn } from "../../lib/utils";
import { useMenubarMenu, useMenubarRoot } from "./menubar-context";

export type MenubarContentProps = HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const MenubarContent = ({
  class: className,
  children,
  onKeyDown,
  ...rest
}: MenubarContentProps) => {
  const root = useMenubarRoot();
  const { menuId, triggerRef } = useMenubarMenu();
  const open = root.openMenuId.value === menuId;
  const contentRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (open && content) focusInitialMenuItem(content);
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      role="menu"
      tabIndex={-1}
      data-slot="menubar-content"
      data-state="open"
      class={cn(
        "absolute start-0 top-full z-50 mt-1 min-w-48 rounded-md border border-border bg-popover p-0 text-popover-foreground shadow-md outline-none",
        className,
      )}
      onKeyDown={(event) => {
        handleMenuContentKeyDown(event, event.currentTarget, {
          onEscape: () => {
            root.setOpenMenuId(null);
            triggerRef.current?.focus();
          },
        });
        onKeyDown?.(event);
      }}
      {...rest}
    >
      {children}
    </div>
  );
};
