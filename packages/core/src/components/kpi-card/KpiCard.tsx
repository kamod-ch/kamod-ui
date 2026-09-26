import type { ComponentChildren, JSX } from "preact";
import type { VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";
import { Card } from "../card/Card";
import { CardContent } from "../card/CardContent";
import { CardHeader } from "../card/CardHeader";
import { Skeleton } from "../skeleton/Skeleton";
import { KpiCardTrend } from "./KpiCardTrend";
import type { KpiCardTrendData } from "./kpi-card-types";
import {
  kpiCard,
  kpiCardComparison,
  kpiCardDescription,
  kpiCardLabel,
  kpiCardTrend,
  kpiCardValue,
} from "./kpi-card-variants";

const hasRenderableValue = (value: ComponentChildren | undefined) =>
  value !== undefined && value !== null;

export type KpiCardProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, "children"> &
  VariantProps<typeof kpiCard> & {
    label: ComponentChildren;
    value?: ComponentChildren;
    description?: ComponentChildren;
    comparisonLabel?: ComponentChildren;
    icon?: ComponentChildren;
    trend?: KpiCardTrendData;
    loading?: boolean;
    /** Chart, sparkline, or secondary metrics — no chart library required. */
    footer?: ComponentChildren;
  };

export const KpiCard = ({
  label,
  value,
  description,
  comparisonLabel,
  icon,
  trend,
  loading = false,
  footer,
  size = "default",
  class: className,
  ...rest
}: KpiCardProps) => {
  const resolvedSize = size ?? "default";
  const showValue = hasRenderableValue(value);

  return (
    <Card
      size={resolvedSize}
      data-slot="kpi-card"
      data-size={resolvedSize}
      aria-busy={loading || undefined}
      class={cn(kpiCard({ size: resolvedSize }), className)}
      {...rest}
    >
      <CardHeader class="gap-2.5 pb-0">
        <div class="flex min-w-0 items-start justify-between gap-3">
          <div class={cn(kpiCardLabel())} data-slot="kpi-card-label">
            {loading ? <Skeleton class="h-3.5 w-24" aria-hidden="true" /> : label}
          </div>
          {icon ? (
            <div
              class="text-muted-foreground mt-0.5 shrink-0 [&_svg]:size-4"
              data-slot="kpi-card-icon"
              aria-hidden={loading ? "true" : undefined}
            >
              {loading ? <Skeleton class="size-4 rounded-sm" aria-hidden="true" /> : icon}
            </div>
          ) : null}
        </div>

        <div class="flex min-w-0 items-baseline gap-2">
          <div
            class={cn(kpiCardValue())}
            data-slot="kpi-card-value"
            data-empty={showValue ? undefined : "true"}
          >
            {loading ? (
              <Skeleton class="h-8 w-28" aria-hidden="true" />
            ) : showValue ? (
              value
            ) : (
              <span aria-hidden="true">—</span>
            )}
          </div>
          {!loading && trend ? (
            <div class="shrink-0">
              <KpiCardTrend {...trend} />
            </div>
          ) : null}
          {loading && trend ? <Skeleton class="h-4 w-16 shrink-0" aria-hidden="true" /> : null}
        </div>

        {!loading && comparisonLabel ? (
          <div class={cn(kpiCardComparison())} data-slot="kpi-card-comparison">
            {comparisonLabel}
          </div>
        ) : null}
        {loading && comparisonLabel ? <Skeleton class="h-3 w-32" aria-hidden="true" /> : null}

        {!loading && description ? (
          <div class={cn(kpiCardDescription())} data-slot="kpi-card-description">
            {description}
          </div>
        ) : null}
        {loading && description ? <Skeleton class="h-3 w-40" aria-hidden="true" /> : null}
      </CardHeader>

      {!loading && footer ? (
        <CardContent class="pt-4" data-slot="kpi-card-footer">
          {footer}
        </CardContent>
      ) : null}
      {loading && footer ? (
        <CardContent class="pt-4" data-slot="kpi-card-footer">
          <Skeleton class="h-12 w-full" aria-hidden="true" />
        </CardContent>
      ) : null}
    </Card>
  );
};

export const KpiCardVariants = {
  kpiCard,
  kpiCardLabel,
  kpiCardValue,
  kpiCardComparison,
  kpiCardDescription,
  kpiCardTrend,
} as const;
