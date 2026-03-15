import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { SheetContent, type SheetContentProps } from "../sheet/SheetContent";
import { useDrawerRoot } from "./drawer-context";

export type DrawerContentProps = Omit<SheetContentProps, "side"> & {
  /** Drag affordance for top/bottom drawers. Default: `true` when `direction` is top or bottom. */
  showHandle?: boolean;
  children?: ComponentChildren;
};

export const DrawerContent = ({
  showHandle,
  showCloseButton = false,
  class: className,
  children,
  ...rest
}: DrawerContentProps) => {
  const { direction } = useDrawerRoot();
  const edge = direction === "top" || direction === "bottom";
  const handleVisible = showHandle !== undefined ? showHandle : edge;

  const Handle = () => (
    <div
      data-slot="drawer-handle"
      aria-hidden
      class={cn(
        "bg-muted mx-auto h-1.5 w-[100px] shrink-0 rounded-full",
        direction === "bottom" && "mb-2",
        direction === "top" && "mt-4"
      )}
    />
  );

  return (
    <SheetContent
      side={direction}
      showCloseButton={showCloseButton}
      data-slot="drawer-content"
      data-vaul-drawer-direction={direction}
      class={cn(className)}
      {...rest}
    >
      {direction === "bottom" && handleVisible ? <Handle /> : null}
      {children}
      {direction === "top" && handleVisible ? <Handle /> : null}
    </SheetContent>
  );
};
