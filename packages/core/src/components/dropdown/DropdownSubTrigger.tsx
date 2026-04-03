import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useDropdownSub } from "./dropdown-sub-context";

const ChevronRight = ({ class: className }: { class?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class={cn("size-3.5 shrink-0 rtl:rotate-180", className)}
    aria-hidden
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export type DropdownSubTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ComponentChildren;
};

export const DropdownSubTrigger = ({
  class: className,
  children,
  onClick,
  onPointerEnter,
  ...rest
}: DropdownSubTriggerProps) => {
  const sub = useDropdownSub();
  const open = sub.open.value;

  return (
    <button
      type="button"
      role="menuitem"
      data-slot="dropdown-sub-trigger"
      data-state={open ? "open" : "closed"}
      aria-expanded={open}
      aria-haspopup="menu"
      class={cn(
        "flex w-full cursor-default select-none items-center gap-1 rounded-sm px-1 py-0.5 text-start text-sm outline-none transition-colors duration-100",
        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
        "[&_svg]:shrink-0",
        className
      )}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        if (e.defaultPrevented) return;
        sub.setOpen(true);
      }}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        sub.setOpen(!open);
      }}
      {...rest}
    >
      {children}
      <ChevronRight class="ms-auto" />
    </button>
  );
};
