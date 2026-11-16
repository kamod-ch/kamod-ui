import { cn } from "../../lib/utils";
import { AccordionContent, AccordionItem, AccordionTrigger } from "../accordion";
import { Switch } from "../switch";
import { type ConsentCategory, useConsentContext } from "./useConsent";

export type ConsentManagerCategoryProps = {
  category: ConsentCategory;
  class?: string;
};

/** One category: a labelled switch, with optional accordion details beside it. */
export const ConsentManagerCategory = ({
  category,
  class: className,
}: ConsentManagerCategoryProps) => {
  const { draft, setCategory } = useConsentContext();
  const checked = category.required ? true : draft.value[category.id] === true;
  const hasDetails = category.details != null && category.details !== false;

  return (
    <AccordionItem value={category.id} class={cn("border-b border-border", className)}>
      <div data-slot="consent-manager-category" class="flex items-start gap-3">
        <div class="min-w-0 flex-1">
          {hasDetails ? (
            <AccordionTrigger class="items-start py-3">
              <span class="block text-sm font-medium text-foreground">{category.title}</span>
              <span class="mt-1 block text-sm font-normal text-muted-foreground">
                {category.description}
              </span>
            </AccordionTrigger>
          ) : (
            <div class="py-3">
              <p class="text-sm font-medium text-foreground">{category.title}</p>
              <p class="mt-1 text-sm text-muted-foreground">{category.description}</p>
            </div>
          )}
        </div>
        <Switch
          class="mt-3"
          checked={checked}
          disabled={category.required === true}
          aria-label={category.title}
          onCheckedChange={(next) => setCategory(category.id, next)}
        />
      </div>
      {hasDetails ? (
        <AccordionContent>
          <div class="pb-3 text-sm text-muted-foreground">{category.details}</div>
        </AccordionContent>
      ) : null}
    </AccordionItem>
  );
};
