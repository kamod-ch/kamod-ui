import type { ComponentChildren } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { trapFocus } from "../../lib/interactive";
import { useDialog } from "./Dialog";
import { findDialogLabelParts } from "./dialogLabelParts";

export const useModalPanelA11y = (open: boolean, children?: ComponentChildren) => {
  const dialog = useDialog();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const parts = findDialogLabelParts(children);

  const labelledBy = parts.hasTitle ? (parts.titleId ?? dialog.defaultTitleId) : undefined;
  const describedBy = parts.hasDescription
    ? (parts.descriptionId ?? dialog.defaultDescriptionId)
    : undefined;

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
