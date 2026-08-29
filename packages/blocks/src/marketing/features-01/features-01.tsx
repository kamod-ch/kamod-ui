import {
  CalendarIcon,
  ChartBarIcon,
  FileCheckIcon,
  ShieldCheckIcon,
  UsersIcon,
  WalletIcon,
} from "@kamod-ch/icons/lucide";
import { Card, CardContent, CardHeader, CardTitle } from "@kamod-ch/ui";
import type { MarketingIcon } from "../shared/types";

export type FeatureItem = {
  title: string;
  description: string;
  icon?: MarketingIcon;
};

export type Features01Props = {
  eyebrow?: string;
  heading?: string;
  lede?: string;
  features?: FeatureItem[];
};

const defaultFeatures: FeatureItem[] = [
  {
    icon: UsersIcon,
    title: "Employee directory",
    description:
      "Single source of truth for people, roles and reporting lines — searchable and exportable.",
  },
  {
    icon: WalletIcon,
    title: "Payroll",
    description:
      "Multi-currency runs with automatic tax filing and direct deposit. Pause and resume in one click.",
  },
  {
    icon: ChartBarIcon,
    title: "Performance",
    description: "OKRs, 1:1s, 360 reviews and continuous feedback all linked to the org chart.",
  },
  {
    icon: FileCheckIcon,
    title: "Onboarding",
    description:
      "34 templated tasks split across pre-start, day 1, week 1, month 1 and 90-day milestones.",
  },
  {
    icon: CalendarIcon,
    title: "Time off",
    description: "Accrual-based leave with manager approval workflow and shared team calendar.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Compliance",
    description: "GDPR, SOC2 and HIPAA-ready audit trails. Right-to-erasure built in.",
  },
];

export const Features01 = ({
  eyebrow = "Features",
  heading = "Everything teams need, nothing they don't.",
  lede = "Six modules that work together out of the box. Pay only for what you use.",
  features = defaultFeatures,
}: Features01Props) => (
  <section data-slot="block-features-01" class="bg-background text-foreground">
    <div class="mx-auto max-w-6xl px-6 py-24">
      <div class="mx-auto max-w-2xl text-center">
        <p class="text-sm font-medium tracking-widest text-primary uppercase">{eyebrow}</p>
        <h2 class="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{heading}</h2>
        <p class="mt-3 text-lg text-muted-foreground">{lede}</p>
      </div>
      <div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title}>
              <CardHeader class="gap-4">
                {Icon ? (
                  <div class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon size={20} />
                  </div>
                ) : null}
                <CardTitle class="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p class="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  </section>
);
