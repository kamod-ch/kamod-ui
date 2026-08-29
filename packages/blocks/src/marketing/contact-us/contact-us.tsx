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

export type ContactMapAdapter = (input: {
  accessToken: string;
  location: [number, number];
  locationLabel: string;
}) => ComponentChildren;

export type ContactUsProps = {
  eyebrow?: string;
  heading?: string;
  lede?: string;
  rows?: ContactRow[];
  /** Mapbox (or other) token. Without it a SSR-safe placeholder is shown. */
  accessToken?: string;
  location?: [number, number];
  locationLabel?: string;
  /** Optional map renderer. The package does not depend on Mapbox. */
  renderMap?: ContactMapAdapter;
  mapSlot?: ComponentChildren;
  subjects?: ContactSubjectOption[];
  formCopy?: ContactFormCopy;
  onSubmit?: (payload: ContactPayload) => void | Promise<void>;
  linkComponent?: BlockLinkComponent;
};

const defaultRows = (locationLabel: string): ContactRow[] => [
  { label: "Email", value: "hello@acme.test", href: "mailto:hello@acme.test", icon: MailIcon },
  { label: "Phone", value: "+1 (555) 010-2030", href: "tel:+15550102030", icon: PhoneIcon },
  { label: "Office", value: locationLabel, icon: MapPinIcon },
];

export const ContactUs = ({
  eyebrow = "Contact",
  heading = "Talk to our team",
  lede = "Questions about pricing, onboarding, or a custom plan? Send a note and we'll get back within one business day.",
  rows,
  accessToken = "",
  location = [-122.4194, 37.7749],
  locationLabel = "San Francisco, CA",
  renderMap,
  mapSlot,
  subjects,
  formCopy,
  onSubmit,
  linkComponent,
}: ContactUsProps) => {
  const contactRows = rows ?? defaultRows(locationLabel);
  const map = (() => {
    if (mapSlot) return mapSlot;
    if (accessToken && renderMap) {
      return renderMap({ accessToken, location, locationLabel });
    }
    return (
      <div
        data-slot="map-placeholder"
        role="img"
        aria-label={`Map unavailable for ${locationLabel}`}
        class="flex size-full items-center justify-center gap-2 bg-muted text-sm text-muted-foreground"
      >
        <MapPinIcon size={16} />
        <span>{locationLabel}</span>
      </div>
    );
  })();

  return (
    <section data-slot="block-contact-us" class="bg-background text-foreground">
      <div class="mx-auto max-w-6xl px-6 py-20">
        <div class="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div class="space-y-6">
            <p class="text-sm font-medium tracking-widest text-primary uppercase">{eyebrow}</p>
            <h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">{heading}</h2>
            <p class="max-w-md text-muted-foreground">{lede}</p>
            <ul class="space-y-3">
              {contactRows.map((row) => {
                const Icon = row.icon;
                const value = row.href ? (
                  renderBlockLink(linkComponent, {
                    href: row.href,
                    class: "text-sm",
                    children: row.value,
                  })
                ) : (
                  <span class="text-sm">{row.value}</span>
                );
                return (
                  <li key={row.label} class="flex items-center gap-3">
                    {Icon ? (
                      <span class="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground">
                        <Icon size={16} />
                      </span>
                    ) : null}
                    {value}
                  </li>
                );
              })}
            </ul>
            <div class="h-56 overflow-hidden rounded-xl border">{map}</div>
          </div>
          <Card>
            <ContactForm
              idPrefix="contact-us"
              subjects={subjects}
              copy={{
                title: "Send a message",
                description: "We'll route it to the right person.",
                ...formCopy,
              }}
              onSubmit={onSubmit}
            />
          </Card>
        </div>
      </div>
    </section>
  );
};
