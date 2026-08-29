import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import {
  chartToken,
  clampNonNegative,
  donutPath,
  formatLocaleNumber,
  formatPercent,
  maxValue,
  type NamedValue,
  pieArcs,
} from "../shared/chart-math";
import { ChartDataTable, ChartSvg, ChartTooltip } from "../shared/chart-svg";

export type MetricsChartKind = "pie" | "bar";

export type MetricCard = {
  id: string;
  label: string;
  value: number;
  unit?: "count" | "percent";
  hint?: string;
  chart: MetricsChartKind;
  slices: NamedValue[];
};

export type MetricsGridProps = {
  title?: string;
  description?: string;
  metrics?: MetricCard[];
  locale?: string;
  formatValue?: (value: number) => string;
};

const defaultMetrics: MetricCard[] = [
  {
    id: "uptime",
    label: "Uptime",
    value: 0.998,
    unit: "percent",
    hint: "Last 30 days",
    chart: "pie",
    slices: [
      { id: "ok", label: "Healthy", value: 99.8 },
      { id: "degraded", label: "Degraded", value: 0.2 },
    ],
  },
  {
    id: "tickets",
    label: "Open tickets",
    value: 42,
    unit: "count",
    chart: "bar",
    slices: [
      { id: "p1", label: "P1", value: 4 },
      { id: "p2", label: "P2", value: 11 },
      { id: "p3", label: "P3", value: 27 },
    ],
  },
  {
    id: "nps",
    label: "NPS mix",
    value: 0.62,
    unit: "percent",
    chart: "pie",
    slices: [
      { id: "promoters", label: "Promoters", value: 62 },
      { id: "passives", label: "Passives", value: 24 },
      { id: "detractors", label: "Detractors", value: 14 },
    ],
  },
  {
    id: "seats",
    label: "Seat usage",
    value: 186,
    unit: "count",
    chart: "bar",
    slices: [
      { id: "used", label: "Used", value: 186 },
      { id: "idle", label: "Idle", value: 34 },
    ],
  },
  {
    id: "errors",
    label: "Error budget",
    value: 0.18,
    unit: "percent",
    chart: "pie",
    slices: [
      { id: "spent", label: "Spent", value: 18 },
      { id: "left", label: "Remaining", value: 82 },
    ],
  },
  {
    id: "regions",
    label: "Traffic by region",
    value: 4,
    unit: "count",
    hint: "Active regions",
    chart: "bar",
    slices: [
      { id: "eu", label: "EU", value: 48 },
      { id: "us", label: "US", value: 31 },
      { id: "apac", label: "APAC", value: 21 },
    ],
  },
];

export const MetricsGrid = ({
  title = "Metrics grid",
  description = "KPI tiles stay readable at 320px. Each chart has a hidden data table.",
  metrics = defaultMetrics,
  locale = "en-US",
  formatValue,
}: MetricsGridProps) => (
  <div data-slot="block-metrics-grid" class="bg-background p-4 text-foreground">
    <div class="mx-auto w-full max-w-5xl space-y-4">
      <div>
        <h3 class="text-sm font-medium">{title}</h3>
        <p class="text-muted-foreground text-xs">{description}</p>
      </div>
      <div class="grid grid-cols-1 gap-3 min-[320px]:grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <MetricTile key={metric.id} metric={metric} locale={locale} formatValue={formatValue} />
        ))}
      </div>
    </div>
  </div>
);

const MetricTile = ({
  metric,
  locale,
  formatValue,
}: {
  metric: MetricCard;
  locale: string;
  formatValue?: (value: number) => string;
}) => {
  const headline =
    metric.unit === "percent"
      ? formatPercent(metric.value, locale)
      : formatLocaleNumber(metric.value, locale, formatValue);
  return (
    <Card class="min-w-0">
      <CardHeader class="space-y-1 p-4">
        <CardTitle class="text-sm">{metric.label}</CardTitle>
        <p class="text-2xl font-semibold tabular-nums leading-none">{headline}</p>
        {metric.hint ? <CardDescription>{metric.hint}</CardDescription> : null}
      </CardHeader>
      <CardContent class="p-4 pt-0">
        {metric.chart === "pie" ? (
          <MiniPie slices={metric.slices} locale={locale} formatValue={formatValue} />
        ) : (
          <MiniBars slices={metric.slices} locale={locale} formatValue={formatValue} />
        )}
      </CardContent>
    </Card>
  );
};

const MiniPie = ({
  slices,
  locale,
  formatValue,
}: {
  slices: NamedValue[];
  locale: string;
  formatValue?: (value: number) => string;
}) => {
  const arcs = pieArcs(slices);
  const [active, setActive] = useState<string | null>(null);
  return (
    <>
      <ChartSvg title="Breakdown" width={200} height={92}>
        {arcs.map((arc, index) => (
          <path
            key={arc.id}
            d={donutPath(46, 46, 18, 42, arc.start, arc.end)}
            fill={arc.color ?? chartToken(index)}
            tabIndex={0}
            role="img"
            aria-label={`${arc.label} ${Math.round(arc.percent * 100)}%`}
            onFocus={() => setActive(arc.id)}
            onBlur={() => setActive(null)}
            onMouseEnter={() => setActive(arc.id)}
            onMouseLeave={() => setActive(null)}
          />
        ))}
        {active
          ? (() => {
              const arc = arcs.find((item) => item.id === active);
              return arc ? <ChartTooltip x={96} y={8} label={arc.label} /> : null;
            })()
          : null}
      </ChartSvg>
      <ChartDataTable
        caption="Metric slices"
        columns={[
          { key: "label", label: "Slice" },
          { key: "value", label: "Value" },
        ]}
        rows={arcs.map((arc) => ({ label: arc.label, value: arc.value }))}
        locale={locale}
        formatter={formatValue}
      />
    </>
  );
};

const MiniBars = ({
  slices,
  locale,
  formatValue,
}: {
  slices: NamedValue[];
  locale: string;
  formatValue?: (value: number) => string;
}) => {
  const values = slices.map((slice) => clampNonNegative(slice.value));
  const peak = maxValue(values);
  const [active, setActive] = useState<string | null>(null);
  return (
    <>
      <ChartSvg title="Breakdown" width={220} height={92}>
        {slices.map((slice, index) => {
          const width = (clampNonNegative(slice.value) / peak) * 140;
          const y = 8 + index * 26;
          return (
            <g
              key={slice.id}
              tabIndex={0}
              role="img"
              aria-label={`${slice.label} ${formatLocaleNumber(slice.value, locale, formatValue)}`}
              onFocus={() => setActive(slice.id)}
              onBlur={() => setActive(null)}
              onMouseEnter={() => setActive(slice.id)}
              onMouseLeave={() => setActive(null)}
            >
              <text x="0" y={y + 12} fill="var(--muted-foreground)" font-size="10">
                {slice.label}
              </text>
              <rect
                x="52"
                y={y}
                width={width}
                height="16"
                rx="3"
                fill={slice.color ?? chartToken(index)}
              />
            </g>
          );
        })}
        {active ? <ChartTooltip x={60} y={0} label={active} /> : null}
      </ChartSvg>
      <ChartDataTable
        caption="Metric bars"
        columns={[
          { key: "label", label: "Slice" },
          { key: "value", label: "Value" },
        ]}
        rows={slices.map((slice) => ({ label: slice.label, value: clampNonNegative(slice.value) }))}
        locale={locale}
        formatter={formatValue}
      />
    </>
  );
};
