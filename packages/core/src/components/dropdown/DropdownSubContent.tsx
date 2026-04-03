import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useDropdownSub } from "./dropdown-sub-context";

export type DropdownSubContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const DropdownSubContent = ({ class: className, children, onPointerEnter, ...rest }: DropdownSubContentProps) => {
  const sub = useDropdownSub();

  if (!sub.open.value) return null;

  return (
    <div
      role="menu"
      data-slot="dropdown-sub-content"
      data-state="open"
      class={cn(
        "absolute start-full top-0 z-50 min-w-[7rem] overflow-x-hidden overflow-y-auto rounded-lg bg-white p-px text-popover-foreground shadow-md outline-none ring-1 ring-foreground/10 ms-0.5 rtl:me-0.5 rtl:ms-0 dark:bg-popover dark:ring-foreground/15",
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
