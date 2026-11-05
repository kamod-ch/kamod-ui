/** Prefer cancel for alert dialogs; otherwise focus the portaled root panel. */
export const getAlertDialogInitialFocus = (panel: HTMLElement): HTMLElement => {
  const cancel = panel.querySelector<HTMLElement>(
    '[data-slot="alert-dialog-cancel"]:not([disabled])',
  );
  if (cancel && cancel.tabIndex >= 0) return cancel;
  return panel;
};
