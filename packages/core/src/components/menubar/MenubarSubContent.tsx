import type { ComponentChildren, HTMLAttributes } from "preact";
import { useLayoutEffect, useRef } from "preact/hooks";
import {
  focusInitialMenuItem,
  getSubmenuRoot,
  getSubmenuTrigger,
  handleMenuSubContentKeyDown,
} from "../../lib/interactive";
import { cn } from "../../lib/utils";
import { useMenubarSub } from "./menubar-context";

export type MenubarSubContentProps = HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const MenubarSubContent = ({
  class: className,
  children,
  onPointerEnter,
  onKeyDown,
  ...rest
}: MenubarSubContentProps) => {
  const sub = useMenubarSub();
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sub.open.value || !sub.consumeFocusOnOpen()) return;
    const content = contentRef.current;
    if (content) focusInitialMenuItem(content);
  }, [sub.open.value]);

  if (!sub.open.value) return null;

  return (
    <div
      ref={contentRef}
      role="menu"
      data-slot="menubar-sub-content"
      data-state="open"
      tabIndex={-1}
      class={cn(
        "absolute start-full top-0 z-50 min-w-40 rounded-md border border-border bg-popover p-0 text-popover-foreground shadow-md outline-none ms-1 rtl:me-1 rtl:ms-0",
        className,
      )}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        sub.setOpen(true);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        const subRoot = getSubmenuRoot(event.currentTarget);
        handleMenuSubContentKeyDown(event, event.currentTarget, {
          onCloseSubmenu: () => sub.setOpen(false),
          getParentTrigger: () => (subRoot ? getSubmenuTrigger(subRoot) : null),
        });
      }}
      {...rest}
    >
      {children}
    </div>
  );
};
