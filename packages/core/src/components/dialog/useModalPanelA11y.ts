import { useEffect, useRef } from "preact/hooks";
import { trapFocus } from "../../lib/interactive";
import { useDialog } from "./Dialog";

export const useModalPanelA11y = (open: boolean) => {
  const dialog = useDialog();
  const panelRef = useRef<HTMLDivElement | null>(null);

  const labelledBy = dialog.titleId.value;
  const describedBy = dialog.descriptionId.value;

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    return trapFocus(panel);
  }, [open]);

  return {
    panelRef,
    labelledBy,
    describedBy,
  };
};
