import type { ComponentChildren, HTMLAttributes } from "preact";
import { useLayoutEffect, useRef } from "preact/hooks";
import {
  focusInitialMenuItem,
  getSubmenuRoot,
  getSubmenuTrigger,
  handleMenuSubContentKeyDown,
  type SubmenuSide,
} from "../../lib/interactive";
import { cn } from "../../lib/utils";
import { useDropdownSub } from "./dropdown-sub-context";

export type DropdownSubContentProps = HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
  /** `inline-end` (default): opens toward inline end (right in LTR). `inline-start`: toward inline start (left in LTR) — use near the viewport edge to avoid horizontal page scroll. */
  side?: SubmenuSide;
};

export const DropdownSubContent = ({
  class: className,
  children,
  onPointerEnter,
  onKeyDown,
  side = "inline-end",
  ...rest
}: DropdownSubContentProps) => {
  const sub = useDropdownSub();
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sub.open.value || !sub.consumeFocusOnOpen()) return;
    const content = contentRef.current;
    if (content) focusInitialMenuItem(content);
  }, [sub.open.value]);

  if (!sub.open.value) return null;

  const sidePosition =
    side === "inline-start"
      ? "end-full me-0.5 rtl:ms-0.5 rtl:me-0"
      : "start-full ms-0.5 rtl:me-0.5 rtl:ms-0";

  return (
    <div
      ref={contentRef}
      role="menu"
      data-slot="dropdown-sub-content"
      data-side={side}
      data-state="open"
      tabIndex={-1}
      class={cn(
        "absolute top-0 z-50 min-w-[7rem] max-h-[min(24rem,calc(100dvh-2rem))] overflow-x-hidden overflow-y-auto rounded-lg bg-white p-px text-popover-foreground shadow-md outline-none ring-1 ring-foreground/10 dark:bg-popover dark:ring-foreground/15",
        sidePosition,
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
          side,
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
