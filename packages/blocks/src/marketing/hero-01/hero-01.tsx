import { ArrowRightIcon, CirclePlayIcon, SparklesIcon } from "@kamod-ch/icons/lucide";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@kamod-ch/ui";
import type { MarketingAction } from "../shared/types";

export type HeroMetric = {
  label: string;
  value: string;
  hint: string;
  rotate?: string;
};

export type HeroQueueItem = {
  initials: string;
  name: string;
  team: string;
  status: string;
};

export type Hero01Props = {
  badge?: string;
  heading?: string;
  lede?: string;
  primary?: MarketingAction;
  secondary?: MarketingAction;
  proof?: string[];
  metrics?: HeroMetric[];
  queueTitle?: string;
  queueDescription?: string;
  queue?: HeroQueueItem[];
};

const defaultMetrics: HeroMetric[] = [
  { label: "Active users", value: "1,284", hint: "+8.2% MoM", rotate: "rotate-2" },
  { label: "Uptime", value: "100%", hint: "12 cycles, 0 misses", rotate: "-rotate-3" },
];

const defaultQueue: HeroQueueItem[] = [
  { initials: "LW", name: "Lena Wei", team: "Engineering", status: "Pending" },
  { initials: "JR", name: "Joaquín Reyes", team: "Engineering", status: "Pending" },
  { initials: "PS", name: "Priya Shah", team: "Engineering", status: "Pending" },
];

export const Hero01 = ({
  badge = "New: AI-powered insights",
  heading = "The platform your team will actually use.",
  lede = "One workspace for everything your team needs. Built on Kamod UI primitives — fast, accessible, easy to customise.",
  primary = { label: "Start free trial", href: "#trial" },
  secondary = { label: "Watch demo (2 min)", href: "#demo", variant: "outline" },
  proof = ["★★★★★ 4.9 on G2", "14-day free trial", "No credit card required"],
  metrics = defaultMetrics,
  queueTitle = "Onboarding queue",
  queueDescription = "3 starting Monday",
  queue = defaultQueue,
}: Hero01Props) => (
  <section data-slot="block-hero-01" class="relative overflow-hidden bg-background text-foreground">
    <div class="pointer-events-none absolute -top-40 left-1/2 size-[min(600px,100vw)] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
    <div class="relative mx-auto max-w-6xl px-6 py-16 sm:py-24 lg:py-32">
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div class="space-y-6">
          <Badge variant="secondary" class="gap-1">
            <SparklesIcon size={12} />
            {badge}
          </Badge>
          <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">{heading}</h1>
          <p class="max-w-xl text-lg text-muted-foreground">{lede}</p>
          <div class="flex flex-wrap items-center gap-3">
            {primary.href ? (
              <Button size="lg" href={primary.href} onClick={primary.onClick}>
                {primary.label}
                <ArrowRightIcon size={16} />
              </Button>
            ) : (
              <Button size="lg" type="button" onClick={primary.onClick}>
                {primary.label}
                <ArrowRightIcon size={16} />
              </Button>
            )}
            {secondary.href ? (
              <Button
                size="lg"
                href={secondary.href}
                variant={secondary.variant ?? "outline"}
                onClick={secondary.onClick}
              >
                <CirclePlayIcon size={16} />
                {secondary.label}
              </Button>
            ) : (
              <Button
                size="lg"
                type="button"
                variant={secondary.variant ?? "outline"}
                onClick={secondary.onClick}
              >
                <CirclePlayIcon size={16} />
                {secondary.label}
              </Button>
            )}
          </div>
          <ul class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {proof.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div class="relative mx-auto grid w-full max-w-md gap-4 sm:max-w-lg">
          <div class="grid gap-4 sm:grid-cols-2">
            {metrics.map((metric) => (
              <Card key={metric.label} class={metric.rotate}>
                <CardContent class="space-y-1 p-4">
                  <p class="text-xs text-muted-foreground uppercase">{metric.label}</p>
                  <p class="text-2xl font-semibold">{metric.value}</p>
                  <p class="text-xs text-muted-foreground">{metric.hint}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <CardTitle class="text-base">{queueTitle}</CardTitle>
              <CardDescription>{queueDescription}</CardDescription>
            </CardHeader>
            <CardContent class="space-y-3">
              {queue.map((person) => (
                <div key={person.name} class="flex items-center gap-3">
                  <Avatar class="size-8">
                    <AvatarFallback>{person.initials}</AvatarFallback>
                  </Avatar>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium">{person.name}</p>
                    <p class="text-xs text-muted-foreground">{person.team}</p>
                  </div>
                  <Badge variant="secondary">{person.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </section>
);
