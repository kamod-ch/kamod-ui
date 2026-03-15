import type { ComponentChildren } from "preact";
import { cn } from "../../lib/utils";
import { DialogContent, dialogViewportBleedClass, type DialogContentProps } from "../dialog/DialogContent";

export type AlertDialogContentSize = "default" | "sm";

export type AlertDialogContentProps = DialogContentProps & {
  /** `sm` — narrower panel (shadcn parity). */
  size?: AlertDialogContentSize;
  children?: ComponentChildren;
};

export const AlertDialogContent = ({
  size = "default",
  class: className,
  children,
  ...rest
}: AlertDialogContentProps) => (
  // presentation="slot": we own the full-screen flex overlay + inner panel; default "modal" would add a second backdrop.
  <DialogContent
    presentation="slot"
    class={cn(
      dialogViewportBleedClass,
      "z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6 pointer-events-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fill-mode-forwards fade-in fade-out"
    )}
    data-slot="alert-dialog-content"
    {...rest}
  >
    <div
      class={cn(
        "data-open:animate-in relative z-[1] grid min-h-0 min-w-0 w-full max-w-[calc(100svw-1.5rem)] max-h-[calc(100dvh-1.5rem)] overflow-y-auto overflow-x-hidden rounded-xl border bg-background shadow-lg pointer-events-auto",
        size === "sm" ? "gap-3 p-4 sm:max-w-sm sm:max-h-[calc(100dvh-3rem)] sm:p-4" : "gap-4 p-4 sm:max-w-[32rem] sm:max-h-[calc(100dvh-3rem)] sm:p-6",
        className
      )}
      data-slot="alert-dialog-panel"
      data-size={size}
      data-open="true"
    >
      {children}
    </div>
  </DialogContent>
);
