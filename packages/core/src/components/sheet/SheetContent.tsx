import type { ComponentChildren, JSX } from "preact";
import { createPortal } from "preact/compat";
import { cn } from "../../lib/utils";
import { useDialog } from "../dialog/Dialog";
import { dialogViewportBleedClass } from "../dialog/DialogContent";
import { SheetClose } from "./SheetClose";

export type SheetContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  side?: "left" | "right" | "top" | "bottom";
  forceMount?: boolean;
  showCloseButton?: boolean;
  children?: ComponentChildren;
  "data-slot"?: string;
};

const sidePanelClass: Record<NonNullable<SheetContentProps["side"]>, string> = {
  right:
    "inset-y-0 right-0 h-full w-full max-w-md border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
  left:
    "inset-y-0 left-0 h-full w-full max-w-md border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
  top:
    "inset-x-0 top-0 max-h-[85dvh] h-auto w-full min-w-0 border-b rounded-b-xl data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
  bottom:
    "inset-x-0 bottom-0 max-h-[85dvh] h-auto w-full min-w-0 border-t rounded-t-xl data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom"
};

export const SheetContent = ({
  side = "right",
  showCloseButton = true,
  children,
  class: className,
  forceMount = false,
  "data-slot": dataSlot = "sheet-content",
  ...rest
}: SheetContentProps) => {
  const dialog = useDialog();
  if (!dialog.open && !forceMount) return null;

  const state = dialog.open ? "open" : "closed";
  const isHorizontalEdge = side === "top" || side === "bottom";
  const edgePadding =
    side === "top"
      ? "px-6 pb-6 pt-[calc(1.5rem+env(safe-area-inset-top,0px))]"
      : side === "bottom"
        ? "px-6 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]"
        : "p-6";

  const tree = (
    <>
      <div
        aria-hidden="true"
        data-slot="sheet-overlay"
        data-state={state}
        class={cn(
          "fade-in fade-out",
          dialogViewportBleedClass,
          "z-40 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fill-mode-forwards"
        )}
      />
      <div
        {...rest}
        role="dialog"
        aria-modal="true"
        data-side={side}
        data-state={state}
        data-slot={dataSlot}
        class={cn(
          "fixed z-50 flex min-h-0 min-w-0 flex-col gap-4 overflow-y-auto border bg-background shadow-lg outline-none",
          edgePadding,
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fill-mode-forwards duration-300",
          sidePanelClass[side],
          className,
          // Top/bottom sheets must span the viewport width; a consumer `max-w-*` (e.g. from copy-pasted right-sheet examples) would otherwise narrow them.
          isHorizontalEdge && "w-full !max-w-none"
        )}
      >
        {showCloseButton ? (
          <SheetClose
            data-slot="sheet-close"
            aria-label="Close sheet"
            class={cn(
              "absolute right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
              side === "top" ? "top-[calc(1rem+env(safe-area-inset-top,0px))]" : "top-4"
            )}
          >
            Close
          </SheetClose>
        ) : null}
        {children}
      </div>
    </>
  );

  if (typeof document === "undefined") return tree;
  return createPortal(tree, document.body);
};

