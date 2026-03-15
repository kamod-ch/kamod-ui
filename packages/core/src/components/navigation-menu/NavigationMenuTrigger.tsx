import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useNavigationMenuItemCtx, useNavigationMenuRoot } from "./navigation-menu-context";
import { navigationMenuTriggerStyle } from "./navigationMenuTriggerStyle";

const ChevronDownIcon = ({ class: className }: { class?: string }) => (
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
    aria-hidden
    class={cn("size-4 shrink-0 transition duration-200 group-data-[state=open]:rotate-180 rtl:-rotate-180 group-data-[state=open]:rtl:rotate-0", className)}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export type NavigationMenuTriggerProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ComponentChildren;
};

export const NavigationMenuTrigger = ({ class: className, children, onClick, onPointerEnter, onPointerLeave, ...rest }: NavigationMenuTriggerProps) => {
  const root = useNavigationMenuRoot();
  const { value } = useNavigationMenuItemCtx();
  const open = root.openValue.value === value;

  const handlePointerEnter = (e: JSX.TargetedPointerEvent<HTMLButtonElement>) => {
    onPointerEnter?.(e);
    if (e.defaultPrevented) return;
    root.requestOpen(value);
  };

  const handlePointerLeave = (e: JSX.TargetedPointerEvent<HTMLButtonElement>) => {
    onPointerLeave?.(e);
    if (e.defaultPrevented) return;
    root.requestClose();
  };

  const handleClick = (e: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    root.toggleItem(value);
  };

  return (
    <button
      type="button"
      data-slot="navigation-menu-trigger"
      data-state={open ? "open" : "closed"}
      aria-expanded={open}
      class={cn(navigationMenuTriggerStyle(), "group", className)}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
      {...rest}
    >
      {children}
      <ChevronDownIcon />
    </button>
  );
};
