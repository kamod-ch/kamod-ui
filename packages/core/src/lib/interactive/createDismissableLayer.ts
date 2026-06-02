import { effect, signal } from "@preact/signals";

/** Clicks on `box-shadow` fall through to the overlay (shadow is not hit-testable). */
export const MODAL_DIALOG_PANEL_OUTSIDE_SLOP_PX = 48;

/**
 * True when the pointer lies in an expanded box around an open modal dialog panel
 * (`dialog-content` without `data-kamod-root-dismissible`). Used so overlay hits
 * in the shadow “halo” do not close the dialog.
 *
 * Skips panels with zero layout size (e.g. JSDOM) so tests keep dismissing on overlay.
 */
export const isPointerWithinModalDialogPanelSlop = (
  event: Pick<PointerEvent, "clientX" | "clientY">,
): boolean => {
  const { clientX: x, clientY: y } = event;
  const slop = MODAL_DIALOG_PANEL_OUTSIDE_SLOP_PX;

  for (const panel of document.querySelectorAll(
    '[data-slot="dialog-content"][data-state="open"]:not([data-kamod-root-dismissible])',
  )) {
    if (!(panel instanceof HTMLElement)) continue;
    const r = panel.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) continue;
    if (x >= r.left - slop && x <= r.right + slop && y >= r.top - slop && y <= r.bottom + slop) {
      return true;
    }
  }
  return false;
};

type CreateDismissableLayerOptions = {
  root: () => HTMLElement | null;
  open: () => boolean;
  onDismiss: () => void;
};

export const createDismissableLayer = ({
  root,
  open,
  onDismiss,
}: CreateDismissableLayerOptions) => {
  const enabled = signal(true);
  const portalLayerSelector =
    '[data-slot="dialog-content"], [data-slot="alert-dialog-content"], [data-slot="sheet-content"], [data-slot="popover-content"], [data-slot="select-content"], [data-slot="dropdown-content"]';
  const overlayLayerSlots = new Set(["dialog-content", "alert-dialog-content"]);

  const stop = effect(() => {
    if (!enabled.value || !open()) return;

    const onPointerDown = (event: PointerEvent) => {
      const node = root();
      if (!node) return;
      const target = event.target as Node | null;
      if (!target) return;
      if (node.contains(target)) return;
      if (target instanceof Element) {
        const closestLayer = target.closest(portalLayerSelector);
        if (closestLayer) {
          const layerSlot = closestLayer.getAttribute("data-slot");
          const rootDismissible = closestLayer.hasAttribute("data-kamod-root-dismissible");

          // Modal `DialogContent` uses a separate `[data-slot="dialog-overlay"]`; hits on the
          // panel root (grid gap, padding, border) still target this div — those must not dismiss.
          // `presentation="slot"` fullscreen shells set `data-kamod-root-dismissible` so a direct
          // hit on that root (dim backdrop) still dismisses.
          if (layerSlot === "dialog-content" && target === closestLayer && !rootDismissible) {
            return;
          }

          const isOverlayLayer = layerSlot ? overlayLayerSlots.has(layerSlot) : false;

          // For overlay wrappers, clicking the backdrop (root element itself) should dismiss.
          if (!isOverlayLayer || target !== closestLayer) return;
        }
      }
      if (
        target instanceof Element &&
        target.closest('[data-slot="dialog-overlay"]') &&
        isPointerWithinModalDialogPanelSlop(event)
      ) {
        return;
      }
      onDismiss();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onDismiss();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  });

  return {
    enabled,
    dispose: () => stop(),
  };
};
