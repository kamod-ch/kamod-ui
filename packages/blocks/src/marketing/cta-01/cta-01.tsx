import { ArrowRightIcon } from "@kamod-ch/icons/lucide";
import { Button } from "@kamod-ch/ui";
import type { MarketingAction } from "../shared/types";

export type Cta01Props = {
  heading?: string;
  lede?: string;
  finePrint?: string;
  primary?: MarketingAction;
  secondary?: MarketingAction;
};

export const Cta01 = ({
  heading = "Ready to give your team a Monday they'll actually look forward to?",
  lede = "Set up takes 12 minutes. Migrate from your current tool with one CSV upload.",
  finePrint = "14-day free trial · No credit card required · Cancel anytime",
  primary = { label: "Start free trial", href: "#trial" },
  secondary = { label: "Book a demo", href: "#demo", variant: "outline" },
}: Cta01Props) => (
  <section data-slot="block-cta-01" class="bg-background text-foreground">
    <div class="mx-auto max-w-3xl px-6 py-24 text-center">
      <div class="rounded-2xl border bg-muted/30 px-6 py-16 sm:px-12">
        <h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">{heading}</h2>
        <p class="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">{lede}</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          {primary.href ? (
            <Button href={primary.href} onClick={primary.onClick}>
              {primary.label}
              <ArrowRightIcon size={16} />
            </Button>
          ) : (
            <Button type="button" onClick={primary.onClick}>
              {primary.label}
              <ArrowRightIcon size={16} />
            </Button>
          )}
          {secondary.href ? (
            <Button
              href={secondary.href}
              variant={secondary.variant ?? "outline"}
              onClick={secondary.onClick}
            >
              {secondary.label}
            </Button>
          ) : (
            <Button
              type="button"
              variant={secondary.variant ?? "outline"}
              onClick={secondary.onClick}
            >
              {secondary.label}
            </Button>
          )}
        </div>
        <p class="mt-6 text-xs text-muted-foreground">{finePrint}</p>
      </div>
    </div>
  </section>
);
