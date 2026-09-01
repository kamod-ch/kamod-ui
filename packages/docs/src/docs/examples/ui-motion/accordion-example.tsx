import { Accordion, AccordionItem, AccordionTrigger } from "@kamod-ch/ui/accordion";
import { MotionAccordionContent } from "@kamod-ch/ui-motion/accordion";
import type { UiMotionDocExample } from "./types.js";

const faqItems = [
  {
    value: "shipping",
    trigger: "What are your shipping options?",
    content:
      "We offer standard (5–7 business days), express (2–3 days), and overnight shipping. Free standard shipping on orders over $50.",
  },
  {
    value: "returns",
    trigger: "What is your return policy?",
    content:
      "Returns are accepted within 30 days. Items must be unused and in original packaging. Refunds are processed within 5–7 business days.",
  },
  {
    value: "support",
    trigger: "How can I contact customer support?",
    content:
      "Email support@example.com, use live chat on our site, or call +1 (555) 010-2000. We respond within one business day.",
  },
] as const;

const itemClass = "border-b border-border last:border-b-0 data-[state=open]:bg-muted/60";

export const MOTION_ACCORDION_EXAMPLE_CODE = `import { Accordion, AccordionItem, AccordionTrigger } from "@kamod-ch/ui/accordion";
import { MotionAccordionContent } from "@kamod-ch/ui-motion/accordion";

const faqItems = [
  {
    value: "shipping",
    trigger: "What are your shipping options?",
    content: "Standard, express, and overnight shipping…",
  },
  {
    value: "returns",
    trigger: "What is your return policy?",
    content: "Returns accepted within 30 days…",
  },
  {
    value: "support",
    trigger: "How can I contact customer support?",
    content: "Email, live chat, or phone…",
  },
];

const itemClass = "border-b border-border last:border-b-0 data-[state=open]:bg-muted/60";

export function MotionFaqAccordion() {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="shipping"
      class="max-w-lg overflow-hidden rounded-lg border border-border bg-background"
    >
      {faqItems.map((item) => (
        <AccordionItem key={item.value} value={item.value} class={itemClass}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <MotionAccordionContent class="pt-0 pb-4 text-sm text-muted-foreground">
            {item.content}
          </MotionAccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}`;

export function MotionAccordionFaqPreview() {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="shipping"
      class="max-w-lg overflow-hidden rounded-lg border border-border bg-background"
      data-testid="ui-motion-accordion"
    >
      {faqItems.map((item) => (
        <AccordionItem key={item.value} value={item.value} class={itemClass}>
          <AccordionTrigger data-testid={`ui-motion-accordion-trigger-${item.value}`}>
            {item.trigger}
          </AccordionTrigger>
          <MotionAccordionContent
            class="pt-0 pb-4 text-sm text-muted-foreground"
            data-testid={`ui-motion-accordion-content-${item.value}`}
          >
            {item.content}
          </MotionAccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export const accordionExample: UiMotionDocExample = {
  id: "accordion",
  title: "Accordion",
  text: 'Three-item FAQ with type="single" and collapsible. Panel height and opacity animate via measured layout; the trigger chevron keeps its CSS rotate transition. Content stays inert and visually hidden until the panel is interactive — no clipped, focusable text during measurement. Reduced motion snaps height instantly with a short opacity fade.',
  code: MOTION_ACCORDION_EXAMPLE_CODE,
  renderPreview: () => <MotionAccordionFaqPreview />,
  previewClass: "data-[chromeless=true]:overflow-visible",
};

export { faqItems as motionAccordionFaqItems };
