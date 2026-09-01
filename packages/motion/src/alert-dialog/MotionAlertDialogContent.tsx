import { Motion, type MotionProps } from "@kamod-ch/motion/motion";
import { type DialogContentProps, useDialog, useModalPanelA11y } from "@kamod-ch/ui/dialog";
import type { JSX } from "preact";
import { cn } from "../lib/cn.js";
import { scale } from "../lib/presets.js";

export type MotionAlertDialogContentSize = "default" | "sm";

export type MotionAlertDialogContentProps = Omit<
  DialogContentProps,
  "presentation" | "forceMount" | "ref"
> & {
  size?: MotionAlertDialogContentSize;
};

export function MotionAlertDialogContent({
  size = "default",
  class: className,
  children,
  onKeyDown,
  "data-slot": dataSlot = "alert-dialog-panel",
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: MotionAlertDialogContentProps) {
  const dialog = useDialog();
  const open = dialog.open.value === true;
  const { panelRef, labelledBy, describedBy } = useModalPanelA11y(open);

  const handleKeyDown = (event: JSX.TargetedKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      dialog.setOpen(false);
    }
    onKeyDown?.(event);
  };

  return (
    <Motion
      ref={panelRef}
      role="alertdialog"
      aria-modal="true"
      tabIndex={-1}
      data-slot={dataSlot}
      data-size={size}
      data-state={open ? "open" : "closed"}
      aria-labelledby={ariaLabelledBy ?? labelledBy}
      aria-describedby={ariaDescribedBy ?? describedBy}
      class={cn(
        "relative z-[1] grid min-h-0 min-w-0 w-full max-w-[calc(100svw-1.5rem)] max-h-[calc(100dvh-1.5rem)] overflow-y-auto overflow-x-hidden rounded-xl border bg-background shadow-lg pointer-events-auto",
        size === "sm"
          ? "gap-3 p-4 sm:max-w-sm sm:max-h-[calc(100dvh-3rem)] sm:p-4"
          : "gap-4 p-4 sm:max-w-[32rem] sm:max-h-[calc(100dvh-3rem)] sm:p-6",
        className,
      )}
      initial={scale.initial}
      animate={scale.animate}
      exit={scale.exit}
      transition={scale.transition}
      onKeyDown={handleKeyDown}
      {...(rest as Omit<MotionProps, "initial" | "animate" | "exit" | "transition">)}
    >
      {children}
    </Motion>
  );
}
