import { Motion, type MotionProps } from "@kamod-ch/motion/motion";
import { dialogViewportBleedClass, useDialog, useModalPanelA11y } from "@kamod-ch/ui/dialog";
import { SheetClose } from "@kamod-ch/ui/sheet";
import type { JSX } from "preact";
import { cn } from "../lib/cn.js";
import { fade, type SheetSide, sheetPreset } from "../lib/presets.js";
import { MotionSheetPortal } from "./MotionSheetPortal.js";

export type MotionSheetContentProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "ref"> & {
  side?: SheetSide;
  showCloseButton?: boolean;
  "data-slot"?: string;
};

const edgePanelClass: Record<SheetSide, string> = {
  right: "inset-y-0 right-0 h-full w-full max-w-md border-l",
  left: "inset-y-0 left-0 h-full w-full max-w-md border-r",
  top: "inset-x-0 top-0 max-h-[85dvh] h-auto w-full min-w-0 border-b rounded-b-xl",
  bottom: "inset-x-0 bottom-0 max-h-[85dvh] h-auto w-full min-w-0 border-t rounded-t-xl",
};

export function MotionSheetContent({
  side = "right",
  showCloseButton = true,
  children,
  class: className,
  "data-slot": dataSlot = "sheet-content",
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: MotionSheetContentProps) {
  const dialog = useDialog();
  const open = dialog.open.value === true;
  const { panelRef, labelledBy, describedBy } = useModalPanelA11y(open);
  const preset = sheetPreset(side);
  const isHorizontalEdge = side === "top" || side === "bottom";
  const edgePadding =
    side === "top"
      ? "px-6 pb-6 pt-[calc(1.5rem+env(safe-area-inset-top,0px))]"
      : side === "bottom"
        ? "px-6 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
        : "p-6";

  return (
    <MotionSheetPortal>
      <Motion
        aria-hidden="true"
        data-slot="sheet-overlay"
        data-state={open ? "open" : "closed"}
        class={cn(dialogViewportBleedClass, "z-40 bg-black/50")}
        initial={fade.initial}
        animate={fade.animate}
        exit={fade.exit}
        transition={fade.transition}
      />
      <Motion
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        data-side={side}
        data-state={open ? "open" : "closed"}
        data-slot={dataSlot}
        aria-labelledby={ariaLabelledBy ?? labelledBy}
        aria-describedby={ariaDescribedBy ?? describedBy}
        class={cn(
          "fixed z-50 flex min-h-0 min-w-0 flex-col gap-4 overflow-y-auto border bg-background shadow-lg outline-none",
          edgePadding,
          edgePanelClass[side],
          isHorizontalEdge && "w-full !max-w-none",
          className,
        )}
        initial={preset.initial}
        animate={preset.animate}
        exit={preset.exit}
        transition={preset.transition}
        {...(rest as Omit<MotionProps, "initial" | "animate" | "exit" | "transition">)}
      >
        {showCloseButton ? (
          <SheetClose
            data-slot="sheet-close"
            aria-label="Close sheet"
            class={cn(
              "absolute right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
              side === "top" ? "top-[calc(1rem+env(safe-area-inset-top,0px))]" : "top-4",
            )}
          >
            Close
          </SheetClose>
        ) : null}
        {children}
      </Motion>
    </MotionSheetPortal>
  );
}
