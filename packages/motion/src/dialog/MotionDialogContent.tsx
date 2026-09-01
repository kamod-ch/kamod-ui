import { Motion, type MotionProps } from "@kamod-ch/motion/motion";
import {
  DialogClose,
  type DialogContentProps,
  useDialog,
  useModalPanelA11y,
} from "@kamod-ch/ui/dialog";
import type { JSX } from "preact";
import { cn } from "../lib/cn.js";
import { scale } from "../lib/presets.js";

const panelBase = [
  "fixed left-1/2 top-1/2 z-50 grid w-full max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg outline-none",
  "rounded-lg sm:max-w-lg",
  "max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden",
].join(" ");

export type MotionDialogContentProps = Omit<
  DialogContentProps,
  "presentation" | "forceMount" | "data-state" | "ref"
> & {
  "data-slot"?: string;
};

export function MotionDialogContent({
  showCloseButton = true,
  class: className,
  children,
  onKeyDown,
  "data-slot": dataSlot = "dialog-content",
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: MotionDialogContentProps) {
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
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      data-slot={dataSlot}
      data-state={open ? "open" : "closed"}
      aria-labelledby={ariaLabelledBy ?? labelledBy}
      aria-describedby={ariaDescribedBy ?? describedBy}
      class={cn(panelBase, className)}
      initial={scale.initial}
      animate={scale.animate}
      exit={scale.exit}
      transition={scale.transition}
      onKeyDown={handleKeyDown}
      {...(rest as Omit<MotionProps, "initial" | "animate" | "exit" | "transition">)}
    >
      {showCloseButton ? (
        <DialogClose
          aria-label="Close"
          data-slot="dialog-close"
          class={cn(
            "absolute end-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:pointer-events-none",
          )}
        >
          <span class="sr-only">Close</span>
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
            class="size-4"
            aria-hidden
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </DialogClose>
      ) : null}
      {children}
    </Motion>
  );
}
