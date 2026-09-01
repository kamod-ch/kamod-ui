import { dialogViewportBleedClass } from "@kamod-ch/ui/dialog";
import type { ComponentChildren, JSX } from "preact";
import { cn } from "../lib/cn.js";

export type MotionAlertDialogViewportProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

/** Centers {@link MotionAlertDialogContent} above {@link MotionAlertDialogOverlay}. */
export function MotionAlertDialogViewport({
  children,
  class: className,
  ...rest
}: MotionAlertDialogViewportProps) {
  return (
    <div
      class={cn(
        dialogViewportBleedClass,
        "z-50 flex items-center justify-center p-3 sm:p-6 pointer-events-none",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
