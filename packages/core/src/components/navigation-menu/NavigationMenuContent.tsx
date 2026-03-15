import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { useNavigationMenuItemCtx, useNavigationMenuRoot } from "./navigation-menu-context";

export type NavigationMenuContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const NavigationMenuContent = ({
  class: className,
  children,
  onPointerEnter,
  onPointerLeave,
  ...rest
}: NavigationMenuContentProps) => {
  const root = useNavigationMenuRoot();
  const { value } = useNavigationMenuItemCtx();
  const open = root.openValue.value === value;

  const handlePointerEnter = (e: JSX.TargetedPointerEvent<HTMLDivElement>) => {
    onPointerEnter?.(e);
    root.clearTimers();
  };

  const handlePointerLeave = (e: JSX.TargetedPointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(e);
    if (e.defaultPrevented) return;
    root.requestClose();
  };

  return (
    <div
      data-slot="navigation-menu-content"
      data-state={open ? "open" : "closed"}
      class={cn(
        "absolute start-0 top-full z-50 mt-1.5 w-max origin-top-start overflow-hidden rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-md outline-none",
        "transition-[opacity,transform] duration-200",
        open ? "pointer-events-auto visible opacity-100" : "pointer-events-none invisible opacity-0",
        className
      )}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      {...rest}
    >
      {children}
    </div>
  );
};
