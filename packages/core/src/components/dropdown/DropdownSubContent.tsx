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
