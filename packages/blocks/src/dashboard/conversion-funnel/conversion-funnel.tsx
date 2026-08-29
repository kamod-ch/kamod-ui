import { Chart, Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@kamod-ch/ui";
import {
  chartToken,
  type FunnelStage,
  formatLocaleNumber,
  formatPercent,
  funnelRetention,
  funnelShareOfFirst,
  normalizeFunnelStages,
} from "../shared/chart-math";
import { ChartDataTable, ChartSvg } from "../shared/chart-svg";

export type ConversionFunnelStage = FunnelStage;

export type ConversionFunnelProps = {
  title?: string;
  description?: string;
  stages?: ConversionFunnelStage[];
  height?: number;
  colors?: string[];
  locale?: string;
  formatValue?: (value: number) => string;
  hideRetention?: boolean;
};

const defaultStages: ConversionFunnelStage[] = [
  { id: "views", label: "Views", value: 72000 },
  { id: "cart", label: "Cart", value: 38200 },
  { id: "checkout", label: "Checkout", value: 16800 },
  { id: "purchase", label: "Purchase", value: 5600 },
];

export const ConversionFunnel = ({
  title = "Conversion funnel",
  description = "Stage counts, share of the first stage, and retention from the previous step.",
  stages = defaultStages,
  height = 180,
  colors,
  locale = "en-US",
  formatValue,
  hideRetention = false,
}: ConversionFunnelProps) => {
  const normalized = normalizeFunnelStages(stages);
  const first = normalized[0]?.value ?? 0;
  const fmt = (value: number) => formatLocaleNumber(value, locale, formatValue);
  const width = 640;
  const bandHeight = Math.max(96, height - 24);

  return (
    <div data-slot="block-conversion-funnel" class="bg-background p-4 text-foreground">
      <Chart title={title} description={description} class="max-w-3xl">
        {normalized.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Need 3–6 stages</EmptyTitle>
              <EmptyDescription>
                Funnels require three to six stages with non-negative counts.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div class="space-y-2">
            <div
              class="grid px-2 text-center"
              style={{ gridTemplateColumns: `repeat(${normalized.length}, minmax(0, 1fr))` }}
            >
              {normalized.map((stage) => (
                <p key={stage.id} class="font-bold tabular-nums">
                  {fmt(stage.value)}
                </p>
              ))}
            </div>
            <ChartSvg
              title="Conversion funnel"
              description="Each band is the share of the first stage. Empty first-stage totals are treated as undefined, not 100%."
              width={width}
              height={bandHeight}
            >
              {normalized.map((stage, index) => {
                const share = funnelShareOfFirst(stage.value, first) ?? 0;
                const nextShare =
                  funnelShareOfFirst(normalized[index + 1]?.value ?? stage.value, first) ?? share;
                const slot = width / normalized.length;
                const pad = 4;
                const x0 = index * slot + pad;
                const x1 = (index + 1) * slot - pad;
                const top0 = ((1 - share) / 2) * bandHeight;
                const top1 = ((1 - nextShare) / 2) * bandHeight;
                const bottom0 = bandHeight - top0;
                const color = stage.color ?? colors?.[index] ?? chartToken(index);
                return (
                  <g key={stage.id}>
                    <path
                      d={`M ${x0} ${top0} L ${x1} ${top1} L ${x1} ${bandHeight - top1} L ${x0} ${bottom0} Z`}
                      fill={color}
                    />
                    <text
                      x={(x0 + x1) / 2}
                      y={bandHeight / 2 + 4}
                      text-anchor="middle"
                      fill="var(--primary-foreground)"
                      font-size="12"
                      font-weight="700"
                    >
                      {formatPercent(funnelShareOfFirst(stage.value, first), locale)}
                    </text>
                  </g>
                );
              })}
            </ChartSvg>
            <div
              class="grid px-2 text-center"
              style={{ gridTemplateColumns: `repeat(${normalized.length}, minmax(0, 1fr))` }}
            >
              {normalized.map((stage, index) => {
                const retention =
                  index === 0
                    ? null
                    : funnelRetention(stage.value, normalized[index - 1]?.value ?? 0);
                return (
                  <div key={stage.id} class="space-y-0.5">
                    <p class="text-muted-foreground text-xs">{stage.label}</p>
                    {!hideRetention && retention !== null ? (
                      <p class="text-info text-[10px] font-semibold tabular-nums">
                        → {formatPercent(retention, locale)} retained
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
            <ChartDataTable
              caption="Funnel stages"
              columns={[
                { key: "stage", label: "Stage" },
                { key: "value", label: "Count" },
                { key: "share", label: "Share of first" },
                { key: "retention", label: "Retention" },
              ]}
              rows={normalized.map((stage, index) => ({
                stage: stage.label,
                value: stage.value,
                share: formatPercent(funnelShareOfFirst(stage.value, first), locale),
                retention:
                  index === 0
                    ? "—"
                    : formatPercent(
                        funnelRetention(stage.value, normalized[index - 1]?.value ?? 0),
                        locale,
                      ),
              }))}
              locale={locale}
              formatter={formatValue}
            />
            <p class="text-muted-foreground text-xs">
              Accessible summary lives in the visually hidden table. Division by zero is shown as an
              em dash instead of Infinity.
            </p>
          </div>
        )}
      </Chart>
    </div>
  );
};
