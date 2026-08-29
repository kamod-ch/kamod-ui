import { Chart, Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import {
  chartToken,
  clampNonNegative,
  donutPath,
  maxValue,
  type NamedValue,
  niceCeil,
  pieArcs,
} from "../shared/chart-math";
import { ChartDataTable, ChartSvg, ChartTooltip } from "../shared/chart-svg";

export type CostWeek = {
  id: string;
  label: string;
  values: Record<string, number>;
};

export type CostSeries = {
  id: string;
  label: string;
  color?: string;
};

export type CostBreakdownProps = {
  title?: string;
  description?: string;
  weeks?: CostWeek[];
  series?: CostSeries[];
  byLane?: NamedValue[];
  byCarrier?: NamedValue[];
  locale?: string;
  formatValue?: (value: number) => string;
};

const defaultSeries: CostSeries[] = [
  { id: "detentionOrigin", label: "Detention origin" },
  { id: "combinedDndOrigin", label: "Combined origin" },
  { id: "demurrageOrigin", label: "Demurrage origin" },
  { id: "detentionDest", label: "Detention dest." },
  { id: "demurrageDest", label: "Demurrage dest." },
  { id: "combinedDndDest", label: "Combined dest." },
];

const defaultWeeks: CostWeek[] = [
  { id: "w1", label: "Jan 26", values: { detentionOrigin: 2800 } },
  { id: "w2", label: "Feb 2", values: { detentionOrigin: 1100 } },
  {
    id: "w3",
    label: "Feb 9",
    values: {
      detentionOrigin: 1800,
      combinedDndOrigin: 3100,
      demurrageOrigin: 800,
      detentionDest: 1800,
      demurrageDest: 4300,
      combinedDndDest: 1100,
    },
  },
  {
    id: "w4",
    label: "Feb 16",
    values: {
      combinedDndOrigin: 22000,
      demurrageOrigin: 12500,
      demurrageDest: 1900,
      combinedDndDest: 35500,
    },
  },
  {
    id: "w5",
    label: "Feb 23",
    values: {
      demurrageOrigin: 3300,
      detentionDest: 800,
      demurrageDest: 6800,
      combinedDndDest: 4400,
    },
  },
  {
    id: "w6",
    label: "Mar 2",
    values: {
      detentionOrigin: 2400,
      demurrageOrigin: 6400,
      detentionDest: 1200,
      demurrageDest: 2800,
      combinedDndDest: 6600,
    },
  },
  {
    id: "w7",
    label: "Mar 9",
    values: {
      demurrageOrigin: 600,
      detentionDest: 1300,
      demurrageDest: 5300,
      combinedDndDest: 5400,
    },
  },
  {
    id: "w8",
    label: "Mar 16",
    values: {
      detentionOrigin: 5400,
      demurrageOrigin: 6000,
      detentionDest: 600,
      demurrageDest: 4200,
      combinedDndDest: 1400,
    },
  },
];

const defaultLanes: NamedValue[] = [
  { id: "lane-01", label: "LANE-01", value: 119800 },
  { id: "lane-02", label: "LANE-02", value: 39000 },
  { id: "lane-03", label: "LANE-03", value: 53100 },
  { id: "other", label: "OTHER", value: 8100 },
];

const defaultCarriers: NamedValue[] = [
  { id: "alpha", label: "C-ALPHA", value: 144200 },
  { id: "beta", label: "C-BETA", value: 69800 },
  { id: "gamma", label: "C-GAMMA", value: 32700 },
  { id: "other", label: "OTHER", value: 10100 },
];

const usd = (value: number) => `$${(value / 1000).toFixed(1)}k`;

export const CostBreakdown = ({
  title = "Cost breakdown",
  description = "Weekly stacked spend plus share by lane and carrier. Negative and missing values are treated as zero.",
  weeks = defaultWeeks,
  series = defaultSeries,
  byLane = defaultLanes,
  byCarrier = defaultCarriers,
  locale = "en-US",
  formatValue = usd,
}: CostBreakdownProps) => {
  const totals = weeks.map((week) =>
    series.reduce((sum, item) => sum + clampNonNegative(week.values[item.id]), 0),
  );
  const grandTotal = totals.reduce((sum, value) => sum + value, 0);
  const yMax = niceCeil(maxValue(totals));
  const width = 720;
  const height = 240;
  const left = 40;
  const bottom = 36;
  const innerWidth = width - left - 16;
  const innerHeight = height - 24 - bottom;
  const barWidth = innerWidth / Math.max(weeks.length, 1);

  return (
    <div data-slot="block-cost-breakdown" class="bg-background p-4 text-foreground">
      <Chart title={title} description={description} class="max-w-5xl">
        {weeks.length === 0 || grandTotal === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No spend to chart</EmptyTitle>
              <EmptyDescription>
                Empty, negative, or inconsistent series collapse to zero and show this empty state.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div class="space-y-6">
            <div class="flex items-baseline justify-between gap-4">
              <p class="text-muted-foreground text-xs">
                Weekly rollup. Focus a stack for the breakdown.
              </p>
              <p class="font-semibold tabular-nums">{formatValue(grandTotal)}</p>
            </div>
            <StackedBars
              weeks={weeks}
              series={series}
              totals={totals}
              yMax={yMax}
              width={width}
              height={height}
              left={left}
              bottom={bottom}
              innerHeight={innerHeight}
              barWidth={barWidth}
              locale={locale}
              formatValue={formatValue}
            />
            <div class="grid gap-4 md:grid-cols-2">
              <SharePie
                title="Share by lane"
                items={byLane}
                locale={locale}
                formatValue={formatValue}
              />
              <SharePie
                title="Share by carrier"
                items={byCarrier}
                locale={locale}
                formatValue={formatValue}
              />
            </div>
          </div>
        )}
      </Chart>
    </div>
  );
};

const StackedBars = ({
  weeks,
  series,
  totals,
  yMax,
  width,
  height,
  left,
  bottom,
  innerHeight,
  barWidth,
  locale,
  formatValue,
}: {
  weeks: CostWeek[];
  series: CostSeries[];
  totals: number[];
  yMax: number;
  width: number;
  height: number;
  left: number;
  bottom: number;
  innerHeight: number;
  barWidth: number;
  locale: string;
  formatValue: (value: number) => string;
}) => {
  const [active, setActive] = useState<number | null>(null);
  return (
    <>
      <ChartSvg title="Weekly stacked cost" width={width} height={height}>
        {weeks.map((week, index) => {
          const x = left + index * barWidth + barWidth * 0.2;
          let y = height - bottom;
          return (
            <g
              key={week.id}
              tabIndex={0}
              role="img"
              aria-label={`${week.label} ${formatValue(totals[index] ?? 0)}`}
              onFocus={() => setActive(index)}
              onBlur={() => setActive(null)}
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
            >
              {series.map((item, seriesIndex) => {
                const value = clampNonNegative(week.values[item.id]);
                const barHeight = (value / yMax) * innerHeight;
                y -= barHeight;
                if (barHeight <= 0) return null;
                return (
                  <rect
                    key={item.id}
                    x={x}
                    y={y}
                    width={barWidth * 0.6}
                    height={barHeight}
                    fill={item.color ?? chartToken(seriesIndex)}
                  />
                );
              })}
              <text
                x={x + barWidth * 0.3}
                y={height - 12}
                text-anchor="middle"
                fill="var(--muted-foreground)"
                font-size="9"
              >
                {week.label}
              </text>
            </g>
          );
        })}
        {active != null ? (
          <ChartTooltip
            x={left + active * barWidth}
            y={8}
            label={`${weeks[active]?.label} ${formatValue(totals[active] ?? 0)}`}
          />
        ) : null}
      </ChartSvg>
      <ChartDataTable
        caption="Weekly cost stacks"
        columns={[
          { key: "week", label: "Week" },
          ...series.map((item) => ({ key: item.id, label: item.label })),
          { key: "total", label: "Total" },
        ]}
        rows={weeks.map((week, index) => ({
          week: week.label,
          total: totals[index],
          ...Object.fromEntries(
            series.map((item) => [item.id, clampNonNegative(week.values[item.id])]),
          ),
        }))}
        locale={locale}
        formatter={formatValue}
      />
    </>
  );
};

const SharePie = ({
  title,
  items,
  locale,
  formatValue,
}: {
  title: string;
  items: NamedValue[];
  locale: string;
  formatValue: (value: number) => string;
}) => {
  const arcs = pieArcs(items);
  const [active, setActive] = useState<string | null>(null);
  return (
    <div>
      <h4 class="mb-2 text-sm font-medium">{title}</h4>
      {arcs.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No positive slices</EmptyTitle>
            <EmptyDescription>Negative or empty categories are omitted.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <ChartSvg title={title} width={280} height={220}>
            {arcs.map((arc, index) => (
              <path
                key={arc.id}
                d={donutPath(140, 110, 0, 86, arc.start, arc.end)}
                fill={arc.color ?? chartToken(index)}
                tabIndex={0}
                role="img"
                aria-label={`${arc.label} ${formatValue(arc.value)} (${Math.round(arc.percent * 100)}%)`}
                onFocus={() => setActive(arc.id)}
                onBlur={() => setActive(null)}
                onMouseEnter={() => setActive(arc.id)}
                onMouseLeave={() => setActive(null)}
              />
            ))}
            {active
              ? (() => {
                  const arc = arcs.find((item) => item.id === active);
                  return arc ? (
                    <ChartTooltip x={86} y={8} label={`${arc.label} ${formatValue(arc.value)}`} />
                  ) : null;
                })()
              : null}
          </ChartSvg>
          <ChartDataTable
            caption={title}
            columns={[
              { key: "label", label: "Category" },
              { key: "value", label: "Value" },
            ]}
            rows={arcs.map((arc) => ({ label: arc.label, value: arc.value }))}
            locale={locale}
            formatter={formatValue}
          />
        </>
      )}
    </div>
  );
};
