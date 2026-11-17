import { useEffect, useMemo, useRef } from "preact/hooks";
import { cn } from "../../lib/utils";
import { useDialog } from "../dialog/Dialog";
import { DialogContent, dialogViewportBleedClass } from "../dialog/DialogContent";
import { ConsentManagerSettings } from "./ConsentManagerSettings";
import { ConsentManagerSummary } from "./ConsentManagerSummary";
import { useConsentContext } from "./useConsent";

export type ConsentManagerContentProps = {
  class?: string;
};

/**
 * Slot presentation: this component owns the overlay and the panel.
 * The dialog itself cannot be dismissed without a decision.
 */
export const ConsentManagerContent = ({ class: className }: ConsentManagerContentProps) => {
  const dialog = useDialog();
  const { view } = useConsentContext();
  const isOpen = dialog.open.value;
  const currentView = view.value;
  const viewRef = useRef(currentView);
  viewRef.current = currentView;
  const seenOpen = useRef(false);

  const getInitialFocus = useMemo(
    () => (panel: HTMLElement) => {
      if (viewRef.current === "settings") {
        return panel.querySelector<HTMLElement>('[data-slot="dialog-title"]');
      }
      return panel.querySelector<HTMLElement>('[data-slot="consent-manager-actions"] button');
    },
    [],
  );

  useEffect(() => {
    if (!isOpen) {
      seenOpen.current = false;
      return;
    }
    if (!seenOpen.current) {
      seenOpen.current = true;
      return;
    }
    document.getElementById(dialog.defaultTitleId)?.focus();
  }, [isOpen, currentView, dialog.defaultTitleId]);

  return (
    <DialogContent
      presentation="slot"
      showCloseButton={false}
      getInitialFocus={getInitialFocus}
      data-slot="consent-manager-content"
      aria-labelledby={dialog.defaultTitleId}
      aria-describedby={dialog.defaultDescriptionId}
      class={cn(dialogViewportBleedClass, "z-50 flex items-center justify-center bg-black/50 p-4")}
    >
      <div
        data-slot="consent-manager-panel"
        class={cn(
          "grid max-h-[calc(100dvh-2rem)] w-full max-w-md gap-4 overflow-y-auto rounded-xl border border-border bg-background p-6 text-foreground shadow-lg",
          className,
        )}
      >
        {currentView === "summary" ? <ConsentManagerSummary /> : <ConsentManagerSettings />}
      </div>
    </DialogContent>
  );
};
