import { effect, signal } from "@preact/signals";

type CreateDismissableLayerOptions = {
  root: () => HTMLElement | null;
  open: () => boolean;
  onDismiss: () => void;
};

export const createDismissableLayer = ({
  root,
  open,
  onDismiss
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
          const isOverlayLayer = layerSlot ? overlayLayerSlots.has(layerSlot) : false;

          // For overlay wrappers, clicking the backdrop (root element itself) should dismiss.
          if (!isOverlayLayer || target !== closestLayer) return;
        }
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
    dispose: () => stop()
  };
};
