import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { PopoverContent } from "../popover/PopoverContent";
import { SheetContent } from "../sheet/SheetContent";
import { useNotificationCenter } from "./notification-center-context";
import { notificationCenterContent } from "./notification-center-variants";

export type NotificationCenterContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const NotificationCenterContent = ({
  class: className,
  children,
  ...rest
}: NotificationCenterContentProps) => {
  const { isMobile } = useNotificationCenter();

  if (isMobile) {
    return (
      <SheetContent
        side="bottom"
        class={cn(notificationCenterContent(), "gap-3 p-4", className)}
        data-slot="notification-center-content"
        {...rest}
      >
        {children}
      </SheetContent>
    );
  }

  return (
    <PopoverContent
      align="end"
      class={cn(
        notificationCenterContent(),
        "w-[min(22rem,calc(100vw-2rem))] p-3 sm:w-96",
        className,
      )}
      data-slot="notification-center-content"
      {...rest}
    >
      {children}
    </PopoverContent>
  );
};
