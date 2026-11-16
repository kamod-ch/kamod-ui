import { Accordion } from "../accordion";
import { Button } from "../button";
import { DialogDescription } from "../dialog/DialogDescription";
import { DialogTitle } from "../dialog/DialogTitle";
import { ConsentManagerCategory } from "./ConsentManagerCategory";
import { useConsentContext } from "./useConsent";

export type ConsentManagerSettingsProps = {
  class?: string;
};

/** Second level: one switch per category, inside the same dialog. */
export const ConsentManagerSettings = ({ class: className }: ConsentManagerSettingsProps) => {
  const { categories, labels, acceptAll, save, back } = useConsentContext();

  return (
    <div data-slot="consent-manager-settings" class={className}>
      <div class="flex flex-col gap-2">
        <DialogTitle tabIndex={-1}>{labels.settingsTitle}</DialogTitle>
        <DialogDescription>{labels.settingsDescription}</DialogDescription>
      </div>
      <Accordion type="single" collapsible class="mt-2">
        {categories.map((category) => (
          <ConsentManagerCategory key={category.id} category={category} />
        ))}
      </Accordion>
      <div data-slot="consent-manager-actions" class="mt-4 flex flex-col gap-2">
        <Button class="w-full" onClick={save}>
          {labels.save}
        </Button>
        <Button class="w-full" variant="outline" onClick={acceptAll}>
          {labels.acceptAll}
        </Button>
        <Button class="w-full" variant="ghost" onClick={back}>
          {labels.back}
        </Button>
      </div>
    </div>
  );
};
