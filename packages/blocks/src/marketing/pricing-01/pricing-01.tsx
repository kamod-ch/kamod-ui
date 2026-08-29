import { CheckIcon, SparklesIcon } from "@kamod-ch/icons/lucide";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ToggleGroup,
  ToggleGroupItem,
} from "@kamod-ch/ui";
import { useControllableState } from "../../shared";
import { MarketingCta } from "../shared/marketing-cta";
import type { MarketingAction } from "../shared/types";

export type BillingCycle = "monthly" | "yearly";

export type PricingTier = {
  id: string;
  name: string;
  description: string;
  monthlyPrice?: string;
  yearlyPrice?: string;
  priceLabel?: string;
  highlighted?: boolean;
  features: string[];
  cta: MarketingAction;
};

export type Pricing01Props = {
  eyebrow?: string;
  heading?: string;
  lede?: string;
  cycle?: BillingCycle;
  defaultCycle?: BillingCycle;
  onCycleChange?: (cycle: BillingCycle) => void;
  yearlyBadge?: string;
  monthlyLabel?: string;
  yearlyLabel?: string;
  periodLabel?: string;
  popularLabel?: string;
  billingAriaLabel?: string;
  tiers?: PricingTier[];
};

const defaultTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For small teams trying things out.",
    monthlyPrice: "$9",
    yearlyPrice: "$7",
    features: ["Up to 10 employees", "Core HR + directory", "Time off + holidays", "Email support"],
    cta: { label: "Start free", href: "#starter", variant: "outline" },
  },
  {
    id: "team",
    name: "Team",
    description: "For growing companies scaling people ops.",
    monthlyPrice: "$29",
    yearlyPrice: "$24",
    highlighted: true,
    features: [
      "Unlimited employees",
      "Payroll + tax filing",
      "Onboarding workflows",
      "Performance reviews",
      "Slack + priority support",
    ],
    cta: { label: "Start 14-day trial", href: "#team" },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Custom controls for regulated industries.",
    priceLabel: "Custom",
    features: [
      "Everything in Team",
      "SSO + SCIM provisioning",
      "Audit logs + role policies",
      "Dedicated success manager",
      "99.99% SLA",
    ],
    cta: { label: "Talk to sales", href: "#sales", variant: "outline" },
  },
];

export const Pricing01 = ({
  eyebrow = "Pricing",
  heading = "Plans for teams of every size",
  lede = "No hidden fees. Cancel anytime. Save 20% with annual billing.",
  cycle,
  defaultCycle = "monthly",
  onCycleChange,
  yearlyBadge = "−20%",
  monthlyLabel = "Monthly",
  yearlyLabel = "Yearly",
  periodLabel = "/ user / month",
  popularLabel = "Most popular",
  billingAriaLabel = "Billing cycle",
  tiers = defaultTiers,
}: Pricing01Props) => {
  const [billing, setBilling] = useControllableState<BillingCycle>({
    value: cycle,
    defaultValue: defaultCycle,
    onChange: onCycleChange,
  });

  return (
    <section data-slot="block-pricing-01" class="bg-background text-foreground">
      <div class="mx-auto max-w-6xl px-6 py-24">
        <div class="mb-10 text-center">
          <p class="text-sm font-medium tracking-widest text-primary uppercase">{eyebrow}</p>
          <h2 class="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{heading}</h2>
          <p class="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">{lede}</p>
          <div class="mt-6 inline-flex">
            <ToggleGroup
              type="single"
              value={billing}
              onValueChange={(value) => {
                if (value === "monthly" || value === "yearly") setBilling(value);
              }}
              aria-label={billingAriaLabel}
            >
              <ToggleGroupItem value="monthly">{monthlyLabel}</ToggleGroupItem>
              <ToggleGroupItem value="yearly">
                {yearlyLabel}
                <Badge variant="secondary" class="ms-2">
                  {yearlyBadge}
                </Badge>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <div class="grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => {
            const price =
              tier.priceLabel ?? (billing === "yearly" ? tier.yearlyPrice : tier.monthlyPrice);
            return (
              <div key={tier.id} class="relative">
                {tier.highlighted ? (
                  <Badge class="absolute -top-3 left-1/2 z-10 -translate-x-1/2 gap-1">
                    <SparklesIcon size={12} /> {popularLabel}
                  </Badge>
                ) : null}
                <Card
                  class={tier.highlighted ? "border-primary ring-1 ring-primary/20" : undefined}
                >
                  <CardHeader>
                    <CardTitle class="text-xl">{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                    <div class="mt-4 flex items-baseline gap-1">
                      <span class="text-4xl font-semibold tracking-tight">{price}</span>
                      {tier.priceLabel ? null : (
                        <span class="text-sm text-muted-foreground">{periodLabel}</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul class="space-y-3 text-sm">
                      {tier.features.map((feature) => (
                        <li key={feature} class="flex items-start gap-2">
                          <CheckIcon class="mt-0.5 shrink-0 text-success" size={16} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <MarketingCta action={tier.cta} class="w-full" />
                  </CardFooter>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
