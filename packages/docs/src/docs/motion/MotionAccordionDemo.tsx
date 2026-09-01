import { Accordion, AccordionItem, AccordionTrigger } from "@kamod-ch/ui/accordion";
import { MotionAccordionContent } from "@kamod-ch/ui-motion/accordion";

const itemClass = "border-b border-border last:border-b-0 data-[state=open]:bg-muted/60";

export function MotionAccordionDemo() {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="shipping"
      class="max-w-lg overflow-hidden rounded-lg border border-border bg-background"
    >
      <AccordionItem value="shipping" class={itemClass}>
        <AccordionTrigger>What are your shipping options?</AccordionTrigger>
        <MotionAccordionContent class="pt-0 pb-4 text-sm text-muted-foreground">
          We offer standard (5–7 days), express (2–3 days), and overnight shipping.
        </MotionAccordionContent>
      </AccordionItem>
      <AccordionItem value="returns" class={itemClass}>
        <AccordionTrigger>What is your return policy?</AccordionTrigger>
        <MotionAccordionContent class="pt-0 pb-4 text-sm text-muted-foreground">
          Returns accepted within 30 days in original packaging.
        </MotionAccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
