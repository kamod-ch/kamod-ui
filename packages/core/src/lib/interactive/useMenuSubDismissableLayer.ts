import { useEffect, useRef } from "preact/hooks";
import { createDismissableLayer } from "./createDismissableLayer";
import { getSubmenuTrigger } from "./createMenuKeyboard";

type MenuSubOpenState = {
  open: { value: boolean };
  setOpen: (next: boolean) => void;
};

/** Registers a submenu on the Escape dismiss stack so only the open sub closes first. */
export const useMenuSubDismissableLayer = (sub: MenuSubOpenState) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = createDismissableLayer({
      root: () => rootRef.current,
      open: () => sub.open.value,
      onDismiss: () => {
        sub.setOpen(false);
      },
      onEscapeDismiss: () => {
        sub.setOpen(false);
        const root = rootRef.current;
        if (root) getSubmenuTrigger(root)?.focus();
      },
    });
    return () => layer.dispose();
  }, [sub]);

  return rootRef;
};
