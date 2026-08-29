import { MailIcon, MapPinIcon, PhoneIcon } from "@kamod-ch/icons/lucide";
import { Card } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import type { BlockLinkComponent } from "../../shared";
import { renderBlockLink } from "../../shared";
import {
  ContactForm,
  type ContactFormCopy,
  type ContactPayload,
  type ContactSubjectOption,
} from "../shared/contact-form";
import type { ContactRow } from "../shared/types";

export type { ContactRow } from "../shared/types";

export type Contact01Props = {
  eyebrow?: string;
  heading?: string;
  lede?: string;
  rows?: ContactRow[];
  mapPlaceholder?: string;
  mapSlot?: ComponentChildren;
  subjects?: ContactSubjectOption[];
  formCopy?: ContactFormCopy;
  onSubmit?: (payload: ContactPayload) => void | Promise<void>;
  linkComponent?: BlockLinkComponent;
};

const defaultRows: ContactRow[] = [
  { label: "Email", value: "hello@acme.test", href: "mailto:hello@acme.test", icon: MailIcon },
  { label: "Phone", value: "+1 (415) 555-0142", href: "tel:+14155550142", icon: PhoneIcon },
  { label: "Office", value: "120 Howard St, San Francisco", icon: MapPinIcon },
];

export const Contact01 = ({
  eyebrow = "Contact",
  heading = "Talk to a human",
  lede = "Tell us a bit about your team and we'll show you how we'd fit. Average reply: 4 hours.",
  rows = defaultRows,
  mapPlaceholder = "Map placeholder",
  mapSlot,
  subjects,
  formCopy,
  onSubmit,
  linkComponent,
}: Contact01Props) => (
  <section data-slot="block-contact-01" class="bg-background text-foreground">
    <div class="mx-auto max-w-6xl px-6 py-24">
      <div class="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div class="space-y-6">
          <p class="text-sm font-medium tracking-widest text-primary uppercase">{eyebrow}</p>
          <h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">{heading}</h2>
          <p class="text-lg text-muted-foreground">{lede}</p>
          <ul class="space-y-3 pt-2">
            {rows.map((row) => {
              const Icon = row.icon;
              const value = row.href ? (
                renderBlockLink(linkComponent, {
                  href: row.href,
                  class: "text-sm font-medium hover:underline",
                  children: row.value,
                })
              ) : (
                <p class="text-sm font-medium">{row.value}</p>
              );
              return (
                <li key={row.label} class="flex items-center gap-3">
                  {Icon ? (
                    <div class="rounded-lg bg-primary/10 p-2 text-primary">
                      <Icon size={16} />
                    </div>
                  ) : null}
                  <div>
                    <p class="text-xs text-muted-foreground uppercase">{row.label}</p>
                    {value}
                  </div>
                </li>
              );
            })}
          </ul>
          <div class="mt-6 flex h-48 items-center justify-center rounded-lg border border-dashed bg-muted/40">
            {mapSlot ?? <p class="text-sm text-muted-foreground">{mapPlaceholder}</p>}
          </div>
        </div>
        <Card>
          <ContactForm
            idPrefix="contact-01"
            subjects={subjects}
            copy={formCopy}
            onSubmit={onSubmit}
          />
        </Card>
      </div>
    </div>
  </section>
);
