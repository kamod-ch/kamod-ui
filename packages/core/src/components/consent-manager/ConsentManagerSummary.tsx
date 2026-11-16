import { Button } from "../button";
import { DialogDescription } from "../dialog/DialogDescription";
import { DialogTitle } from "../dialog/DialogTitle";
import { useConsentContext } from "./useConsent";

export type ConsentManagerSummaryProps = {
  class?: string;
};

/** First level: the immediate decision. */
export const ConsentManagerSummary = ({ class: className }: ConsentManagerSummaryProps) => {
  const { labels, acceptAll, rejectAll, open } = useConsentContext();

  return (
    <div data-slot="consent-manager-summary" class={className}>
      <div class="flex flex-col gap-2">
        <DialogTitle tabIndex={-1}>{labels.title}</DialogTitle>
        <DialogDescription>{labels.description}</DialogDescription>
      </div>
      <div data-slot="consent-manager-actions" class="mt-4 flex flex-col gap-2">
        <Button class="w-full" onClick={acceptAll}>
          {labels.acceptAll}
        </Button>
        <Button class="w-full" variant="outline" onClick={rejectAll}>
          {labels.necessaryOnly}
        </Button>
        <Button class="w-full" variant="ghost" onClick={open}>
          {labels.settings}
        </Button>
      </div>
    </div>
  );
};
