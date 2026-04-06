import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useDropdownSub } from "./dropdown-sub-context";

export type DropdownSubContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
  /** `inline-end` (default): opens toward inline end (right in LTR). `inline-start`: toward inline start (left in LTR) — use near the viewport edge to avoid horizontal page scroll. */
  side?: "inline-end" | "inline-start";
};

export const DropdownSubContent = ({
  class: className,
  children,
  onPointerEnter,
  side = "inline-end",
  ...rest
}: DropdownSubContentProps) => {
  const sub = useDropdownSub();

  if (!sub.open.value) return null;

  const sidePosition =
    side === "inline-start"
      ? "end-full me-0.5 rtl:ms-0.5 rtl:me-0"
      : "start-full ms-0.5 rtl:me-0.5 rtl:ms-0";

  return (
    <div
      role="menu"
      data-slot="dropdown-sub-content"
      data-side={side}
      data-state="open"
      class={cn(
        "absolute top-0 z-50 min-w-[7rem] max-h-[min(24rem,calc(100dvh-2rem))] overflow-x-hidden overflow-y-auto rounded-lg bg-white p-px text-popover-foreground shadow-md outline-none ring-1 ring-foreground/10 dark:bg-popover dark:ring-foreground/15",
        sidePosition,
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
