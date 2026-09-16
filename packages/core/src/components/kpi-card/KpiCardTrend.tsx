import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { KpiCardTrendIcon } from "./KpiCardTrendIcon";
import type { KpiCardTrendData, KpiTrendDirection, KpiTrendSentiment } from "./kpi-card-types";
import { kpiCardTrend } from "./kpi-card-variants";

export type KpiCardTrendProps = Omit<JSX.HTMLAttributes<HTMLSpanElement>, "children"> &
  KpiCardTrendData;

export const KpiCardTrend = ({
  direction,
  sentiment,
  label,
  ariaLabel,
  class: className,
  ...rest
}: KpiCardTrendProps) => (
  <span
    data-slot="kpi-card-trend"
    data-direction={direction}
    data-sentiment={sentiment}
    aria-label={ariaLabel}
    class={cn(kpiCardTrend({ sentiment }), className)}
    {...rest}
  >
    <KpiCardTrendIcon direction={direction} />
    <span class="min-w-0 truncate">{label}</span>
  </span>
);

export type KpiCardTrendLabelProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  direction: KpiTrendDirection;
  sentiment: KpiTrendSentiment;
  children?: ComponentChildren;
};

/** Trend row without icon — prefer `KpiCardTrend` for the full pattern. */
export const KpiCardTrendLabel = ({
  direction,
  sentiment,
  class: className,
  children,
  ...rest
}: KpiCardTrendLabelProps) => (
  <span
    data-slot="kpi-card-trend-label"
    data-direction={direction}
    data-sentiment={sentiment}
    class={cn(kpiCardTrend({ sentiment }), className)}
    {...rest}
  >
    {children}
  </span>
);
