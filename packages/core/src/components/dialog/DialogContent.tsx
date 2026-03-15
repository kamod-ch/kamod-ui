import type { ComponentChildren, JSX } from "preact";
import { createPortal } from "preact/compat";
import { cn } from "../../lib/utils";
import { DialogClose } from "./DialogClose";
import { useDialog } from "./Dialog";

/**
 * `fixed inset-0` can miss edge pixels vs full-viewport overlays; explicit `100vw` / `100vh`
 * keeps the backdrop flush with the visual viewport.
 */
export const dialogViewportBleedClass =
  "fixed left-0 top-0 h-screen min-h-[100dvh] w-screen min-w-[100vw]";

const modalOverlayClass = [
  dialogViewportBleedClass,
  "z-40 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fill-mode-forwards fade-in fade-out"
].join(" ");

const modalPanelBase =
  [
    "fixed left-1/2 top-1/2 z-50 grid w-full max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg outline-none",
    "rounded-lg sm:max-w-lg",
    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fill-mode-forwards",
    "fade-in zoom-in-95 fade-out zoom-out-95 duration-200",
    "max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden"
  ].join(" ");

export type DialogContentPresentation = "modal" | "slot";

export type DialogContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  forceMount?: boolean;
  /**
   * `modal` — built-in overlay + centered panel + optional corner close.
   * `slot` — one portaled element only; use when **you** provide overlay + panel (legacy fullscreen `DialogContent` pattern with `fixed inset-0 …`).
   */
  presentation?: DialogContentPresentation;
  showCloseButton?: boolean;
  children?: ComponentChildren;
  "data-slot"?: string;
};

/**
 * Renders dialog body in a portal.
 *
 * - **modal (default):** Backdrop + centered panel; use `class` only for sizing (e.g. `sm:max-w-sm`).
 * - **slot:** Single root node — **required** for legacy/custom layouts that already implement `fixed inset-0` overlay + inner card (otherwise you stack two modals).
 */
export const DialogContent = ({
  forceMount = false,
  presentation = "modal",
  showCloseButton = true,
  class: className,
  children,
  onKeyDown,
  "data-slot": dataSlot = "dialog-content",
  ...rest
}: DialogContentProps) => {
  const dialog = useDialog();
  if (!dialog.open.value && !forceMount) return null;

  const state = dialog.open.value ? "open" : "closed";

  const handleKeyDown = (event: JSX.TargetedKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      dialog.setOpen(false);
      dialog.triggerRef.current?.focus();
    }
    onKeyDown?.(event);
  };

  if (presentation === "slot") {
    const content = (
      <div
        role="dialog"
        aria-modal="true"
        data-slot={dataSlot}
        data-state={state}
        {...rest}
        onKeyDown={handleKeyDown}
        class={cn(className as string | undefined)}
      >
        {children}
      </div>
    );

    if (typeof document === "undefined") return content;
    return createPortal(content, document.body);
  }

  const tree = (
    <>
      <div aria-hidden="true" data-slot="dialog-overlay" data-state={state} class={modalOverlayClass} />
      <div
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        data-slot={dataSlot}
        data-state={state}
        {...rest}
        onKeyDown={handleKeyDown}
        class={cn(modalPanelBase, className as string | undefined)}
      >
        {showCloseButton ? (
          <DialogClose
            aria-label="Close"
            data-slot="dialog-close"
            class={cn(
              "absolute end-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:pointer-events-none"
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
      </div>
    </>
  );

  if (typeof document === "undefined") return tree;
  return createPortal(tree, document.body);
};
