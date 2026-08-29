import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@kamod-ch/ui";
import type { BlockLinkComponent } from "../../shared";
import { renderBlockLink } from "../../shared";

export type FaqItem = {
  value: string;
  question: string;
  answer: string;
};

export type Faq01Props = {
  eyebrow?: string;
  heading?: string;
  lede?: string;
  contactEmail?: string;
  contactHref?: string;
  items?: FaqItem[];
  linkComponent?: BlockLinkComponent;
};

const defaultItems: FaqItem[] = [
  {
    value: "trial",
    question: "How does the 14-day free trial work?",
    answer:
      "Sign up with a work email — no credit card. You get every feature on the Team plan for 14 days. At the end of the trial you pick a plan or your workspace switches to read-only until you do; nothing is deleted.",
  },
  {
    value: "migrate",
    question: "Can we migrate from our current tool?",
    answer:
      "Yes. Most teams import people, time off balances and org structure with one CSV. For everything else, our team will run the migration with you free of charge.",
  },
  {
    value: "security",
    question: "Is our employee data secure?",
    answer:
      "SOC 2 Type II, ISO 27001, GDPR and HIPAA compliant. Data is encrypted at rest (AES-256) and in transit (TLS 1.3).",
  },
  {
    value: "pricing",
    question: "What does the per-user pricing include?",
    answer:
      "All core modules — directory, payroll, time off, performance, onboarding — are included on the Team plan. There are no per-feature add-ons.",
  },
  {
    value: "support",
    question: "What support do we get?",
    answer:
      "Email support is included on every plan with a 4-hour business-hours reply. Team and Enterprise customers get a shared Slack channel.",
  },
  {
    value: "cancel",
    question: "How do we cancel?",
    answer:
      "One click in Settings → Billing. If you cancel mid-cycle, your workspace stays active through the end of the period and you can export all data before it ends.",
  },
];

export const Faq01 = ({
  eyebrow = "FAQ",
  heading = "Questions, answered",
  lede = "Anything we missed? Email",
  contactEmail = "hello@acme.test",
  contactHref,
  items = defaultItems,
  linkComponent,
}: Faq01Props) => (
  <section data-slot="block-faq-01" class="bg-background text-foreground">
    <div class="mx-auto max-w-3xl px-6 py-24">
      <p class="text-sm font-medium tracking-widest text-primary uppercase">{eyebrow}</p>
      <h2 class="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{heading}</h2>
      <p class="mt-3 text-muted-foreground">
        {lede}{" "}
        {renderBlockLink(linkComponent, {
          href: contactHref ?? `mailto:${contactEmail}`,
          class: "text-foreground underline-offset-4 hover:underline",
          children: contactEmail,
        })}{" "}
        and we'll reply within a day.
      </p>
      <Accordion class="mt-10" type="single" collapsible defaultValue={items[0]?.value}>
        {items.map((item) => (
          <AccordionItem key={item.value} value={item.value} class="border-b">
            <h3>
              <AccordionTrigger class="w-full py-4 text-left text-sm font-medium sm:text-base">
                {item.question}
              </AccordionTrigger>
            </h3>
            <AccordionContent class="pb-4 text-sm text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);
