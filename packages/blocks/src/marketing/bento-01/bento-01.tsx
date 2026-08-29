import { ActivityIcon, ClockIcon, ShieldCheckIcon, SparklesIcon } from "@kamod-ch/icons/lucide";
import { Badge, Card, CardContent, Progress } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import type { MarketingIcon } from "../shared/types";

export type BentoStat = { value: string; label: string };

export type BentoTile = {
  title: string;
  description: string;
  icon?: MarketingIcon;
  badge?: string;
  stats?: BentoStat[];
  progress?: { label: string; value: number; max?: number };
  span?: "hero" | "wide" | "square";
};

export type Bento01Props = {
  eyebrow?: string;
  heading?: string;
  lede?: string;
  tiles?: BentoTile[];
  children?: ComponentChildren;
};

const defaultTiles: BentoTile[] = [
  {
    span: "hero",
    icon: SparklesIcon,
    badge: "New",
    title: "AI-assisted reviews",
    description:
      "Draft 360 feedback in seconds. Every suggestion cites the source so nothing comes out of nowhere.",
    progress: { label: "Draft quality", value: 92 },
    stats: [
      { value: "12", label: "Goals" },
      { value: "34", label: "1:1 notes" },
      { value: "8", label: "Peers" },
    ],
  },
  {
    span: "wide",
    icon: ActivityIcon,
    title: "Real-time activity",
    description:
      "Every event — hire, promotion, time-off, payroll run — streams into a single timeline you can filter by team.",
  },
  {
    span: "square",
    icon: ClockIcon,
    title: "12 min",
    description: "Average setup time",
  },
  {
    span: "square",
    icon: ShieldCheckIcon,
    title: "SOC 2 · ISO 27001 · GDPR",
    description: "Encrypted at rest, audited quarterly.",
  },
];

const tileClass = (span: BentoTile["span"]) => {
  if (span === "hero") return "lg:col-span-2 lg:row-span-2";
  if (span === "wide") return "lg:col-span-2";
  return "";
};

export const Bento01 = ({
  eyebrow = "Built for scale",
  heading = "A workspace your team grows into, not out of.",
  lede = "Four surfaces that work end-to-end. Replace any one without touching the rest.",
  tiles = defaultTiles,
  children,
}: Bento01Props) => (
  <section data-slot="block-bento-01" class="bg-background text-foreground">
    <div class="mx-auto max-w-6xl px-6 py-24">
      <div class="mb-12 max-w-2xl space-y-3">
        <p class="text-sm font-medium tracking-widest text-primary uppercase">{eyebrow}</p>
        <h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">{heading}</h2>
        <p class="text-lg text-muted-foreground">{lede}</p>
      </div>
      <div class="grid gap-4 lg:grid-cols-4 lg:grid-rows-2">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Card key={tile.title} class={tileClass(tile.span)}>
              <CardContent class="flex h-full flex-col gap-4 p-6 sm:p-8">
                <div class="flex items-center gap-3">
                  {Icon ? (
                    <div class="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon size={20} />
                    </div>
                  ) : null}
                  {tile.badge ? <Badge variant="secondary">{tile.badge}</Badge> : null}
                </div>
                <div class="space-y-2">
                  <h3 class="text-lg font-semibold tracking-tight sm:text-2xl">{tile.title}</h3>
                  <p class="text-sm text-muted-foreground sm:text-base">{tile.description}</p>
                </div>
                {tile.progress ? (
                  <div class="mt-auto rounded-lg border bg-muted/30 p-5">
                    <div class="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{tile.progress.label}</span>
                      <span class="font-mono">
                        {tile.progress.value} / {tile.progress.max ?? 100}
                      </span>
                    </div>
                    <Progress
                      class="mt-3"
                      value={tile.progress.value}
                      max={tile.progress.max ?? 100}
                    />
                    {tile.stats ? (
                      <div class="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
                        {tile.stats.map((stat) => (
                          <div key={stat.label}>
                            <p class="font-mono text-base text-foreground">{stat.value}</p>
                            <p class="text-muted-foreground">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
      {children}
    </div>
  </section>
);
