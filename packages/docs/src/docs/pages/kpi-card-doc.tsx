import { KpiCard, KpiCardGrid } from "@kamod-ch/ui";
import { Activity, AlertTriangle, DollarSign, Users } from "lucide-preact";
import type { ComponentChildren } from "preact";
import { createGenericDocPage } from "./create-generic-doc-page";

const currency = (value: number, locale = "de-DE") =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);

const percent = (value: number, locale = "de-DE") =>
  new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 1 }).format(value);

const MiniSparkline = ({ values }: { values: number[] }) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100;
      const y = 22 - ((value - min) / range) * 18;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 24" class="text-primary h-6 w-full" aria-hidden="true">
      <polyline fill="none" stroke="currentColor" stroke-width="2" points={points} />
    </svg>
  );
};

const KpiPreviewFrame = ({ children }: { children: ComponentChildren }) => (
  <div class="w-full max-w-sm">{children}</div>
);

const USAGE_SNIPPET = `import { KpiCard } from "@/components/kamod-ui/kpi-card";

const revenue = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
}).format(128_400);

export const Example = () => (
  <KpiCard
    label="Revenue"
    value={revenue}
    trend={{ direction: "up", sentiment: "positive", label: "+8.2%" }}
    comparisonLabel="vs previous month"
  />
);`;

const RevenuePreview = () => (
  <KpiPreviewFrame>
    <KpiCard
      label="Revenue"
      icon={<DollarSign />}
      value={currency(128_400)}
      trend={{ direction: "up", sentiment: "positive", label: "+8.2%" }}
      comparisonLabel="vs previous month"
    />
  </KpiPreviewFrame>
);

const ErrorRatePreview = () => (
  <KpiPreviewFrame>
    <KpiCard
      label="Error rate"
      icon={<AlertTriangle />}
      value={percent(0.024)}
      trend={{
        direction: "up",
        sentiment: "negative",
        label: "+0.6 pp",
        ariaLabel: "Error rate increased by 0.6 percentage points",
      }}
      comparisonLabel="vs previous week"
      description="5xx responses / total requests"
    />
  </KpiPreviewFrame>
);

const CostsPreview = () => (
  <KpiPreviewFrame>
    <KpiCard
      label="Cloud spend"
      icon={<Activity />}
      value={currency(18_200)}
      trend={{
        direction: "down",
        sentiment: "positive",
        label: "-€1.2k",
        ariaLabel: "Cloud spend decreased by 1,200 euros",
      }}
      comparisonLabel="vs previous month"
    />
  </KpiPreviewFrame>
);

const NeutralZeroLoadingPreview = () => (
  <KpiCardGrid class="max-w-3xl">
    <KpiCard
      label="Active sessions"
      value={1240}
      trend={{ direction: "flat", sentiment: "neutral", label: "±0%" }}
      comparisonLabel="vs yesterday"
    />
    <KpiCard label="Failed jobs" value={0} description="Queue drained successfully" />
    <KpiCard label="Pending exports" loading comparisonLabel="Refreshing…" />
  </KpiCardGrid>
);

const GridPreview = () => (
  <KpiCardGrid class="max-w-4xl">
    <KpiCard
      label="Users"
      icon={<Users />}
      value="18,420"
      trend={{ direction: "up", sentiment: "positive", label: "+3.1%" }}
    />
    <KpiCard
      label="Error rate"
      value={percent(0.012)}
      trend={{ direction: "down", sentiment: "positive", label: "-0.4 pp" }}
    />
    <KpiCard
      label="Revenue"
      value={currency(92_100)}
      trend={{ direction: "up", sentiment: "positive", label: "+5.0%" }}
    />
    <KpiCard
      label="Usage"
      value={percent(0.67)}
      trend={{ direction: "flat", sentiment: "neutral", label: "±0%" }}
    />
  </KpiCardGrid>
);

const SparklinePreview = () => (
  <KpiPreviewFrame>
    <KpiCard
      label="Daily signups"
      value="1,284"
      trend={{ direction: "up", sentiment: "positive", label: "+12%" }}
      footer={<MiniSparkline values={[12, 18, 14, 22, 19, 26, 24]} />}
    />
  </KpiPreviewFrame>
);

export const kpiCardDocPage = createGenericDocPage({
  slug: "kpi-card",
  title: "KPI Card",
  usageLabel: "KPI Card",
  previewChromeClass: "justify-start",
  previewCode: USAGE_SNIPPET,
  installationText:
    "Import from `@kamod-ch/ui/kpi-card`. The card composes `Card`, `Skeleton`, and optional footer slots — no chart library is required.",
  installationExample: {
    code: USAGE_SNIPPET,
    renderPreview: RevenuePreview,
  },
  usageText:
    "KPI Card displays a label, formatted value, optional trend, and footer slot. Pass `direction` (up | down | flat) separately from `sentiment` (positive | negative | neutral) so rising error rates can read as negative while falling costs read as positive. Format numbers with `Intl` before passing `value`. Omit `value` for an empty state — it is never coerced to zero.",
  exampleSections: [
    {
      id: "revenue-positive",
      title: "Revenue with positive change",
      text: "Currency formatting stays in the consumer. The trend label is pre-formatted text.",
      code: USAGE_SNIPPET,
      renderPreview: RevenuePreview,
    },
    {
      id: "error-rate",
      title: "Error rate — up and negative",
      text: "Direction reflects the metric movement; sentiment reflects business impact. Icons and text carry meaning beyond color.",
      code: `import { KpiCard } from "@/components/kamod-ui/kpi-card";

const rate = new Intl.NumberFormat("de-DE", {
  style: "percent",
  maximumFractionDigits: 1,
}).format(0.024);

export const Example = () => (
  <KpiCard
    label="Error rate"
    value={rate}
    trend={{
      direction: "up",
      sentiment: "negative",
      label: "+0.6 pp",
      ariaLabel: "Error rate increased by 0.6 percentage points",
    }}
  />
);`,
      renderPreview: ErrorRatePreview,
    },
    {
      id: "costs-positive",
      title: "Costs — down and positive",
      text: 'Falling spend uses `direction: "down"` with `sentiment: "positive"`.',
      code: `import { KpiCard } from "@/components/kamod-ui/kpi-card";

export const Example = () => (
  <KpiCard
    label="Cloud spend"
    value="€18,200"
    trend={{ direction: "down", sentiment: "positive", label: "-€1.2k" }}
  />
);`,
      renderPreview: CostsPreview,
    },
    {
      id: "neutral-zero-loading",
      title: "Neutral trend, zero value, and loading",
      text: "`value={0}` renders zero. Omit `value` for an em dash. `loading` sets `aria-busy` and skeleton placeholders.",
      code: `import { KpiCard, KpiCardGrid } from "@/components/kamod-ui/kpi-card";

export const Example = () => (
  <KpiCardGrid>
    <KpiCard label="Active sessions" value={1240} trend={{ direction: "flat", sentiment: "neutral", label: "±0%" }} />
    <KpiCard label="Failed jobs" value={0} />
    <KpiCard label="Pending exports" loading />
  </KpiCardGrid>
);`,
      renderPreview: NeutralZeroLoadingPreview,
    },
    {
      id: "responsive-grid",
      title: "Four cards in a responsive grid",
      text: "`KpiCardGrid` wraps cards in a 1 / 2 / 4 column layout from 320px upward.",
      code: `import { KpiCard, KpiCardGrid } from "@/components/kamod-ui/kpi-card";

export const Example = () => (
  <KpiCardGrid>
    <KpiCard label="Users" value="18,420" trend={{ direction: "up", sentiment: "positive", label: "+3.1%" }} />
    <KpiCard label="Error rate" value="1.2%" trend={{ direction: "down", sentiment: "positive", label: "-0.4 pp" }} />
    <KpiCard label="Revenue" value="€92,100" trend={{ direction: "up", sentiment: "positive", label: "+5.0%" }} />
    <KpiCard label="Usage" value="67%" trend={{ direction: "flat", sentiment: "neutral", label: "±0%" }} />
  </KpiCardGrid>
);`,
      renderPreview: GridPreview,
    },
    {
      id: "sparkline-footer",
      title: "Optional sparkline footer",
      text: "Pass any JSX to `footer` — here a tiny inline SVG polyline without an extra chart dependency.",
      code: `import { KpiCard } from "@/components/kamod-ui/kpi-card";

export const Example = () => (
  <KpiCard
    label="Daily signups"
    value="1,284"
    trend={{ direction: "up", sentiment: "positive", label: "+12%" }}
    footer={
      <svg viewBox="0 0 100 24" class="text-primary h-6 w-full" aria-hidden="true">
        <polyline fill="none" stroke="currentColor" stroke-width="2" points="0,18 25,12 50,14 75,8 100,10" />
      </svg>
    }
  />
);`,
      renderPreview: SparklinePreview,
    },
  ],
  apiRows: [
    { prop: "label", type: "ComponentChildren", defaultValue: "required" },
    { prop: "value", type: "ComponentChildren | undefined", defaultValue: "undefined → em dash" },
    { prop: "description", type: "ComponentChildren", defaultValue: "—" },
    { prop: "comparisonLabel", type: "ComponentChildren", defaultValue: "—" },
    { prop: "icon", type: "ComponentChildren", defaultValue: "—" },
    {
      prop: "trend.direction",
      type: '"up" | "down" | "flat"',
      defaultValue: "—",
    },
    {
      prop: "trend.sentiment",
      type: '"positive" | "negative" | "neutral"',
      defaultValue: "—",
    },
    { prop: "trend.label", type: "ComponentChildren", defaultValue: "required when trend set" },
    { prop: "trend.ariaLabel", type: "string", defaultValue: "—" },
    { prop: "loading", type: "boolean", defaultValue: "false" },
    { prop: "footer", type: "ComponentChildren", defaultValue: "—" },
    { prop: "size", type: '"default" | "sm"', defaultValue: '"default"' },
  ],
  accessibilityText:
    "KPI Card is informative only: no tabindex, button role, or click handlers are added. Trends pair icon direction, visible label text, and semantic color tokens — provide `trend.ariaLabel` when the visible label is ambiguous. Loading sets `aria-busy` on the card root. Wrap actionable links in `footer` or compose a separate control outside the card.",
});
