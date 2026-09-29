import { KpiCard, KpiCardVariants } from "./KpiCard";
import { KpiCardGrid } from "./KpiCardGrid";
import { KpiCardTrend, KpiCardTrendLabel } from "./KpiCardTrend";
import {
  kpiCard,
  kpiCardComparison,
  kpiCardDescription,
  kpiCardGrid,
  kpiCardLabel,
  kpiCardTrend,
  kpiCardValue,
} from "./kpi-card-variants";

export type { KpiCardProps } from "./KpiCard";
export type { KpiCardGridProps } from "./KpiCardGrid";
export type { KpiCardTrendLabelProps, KpiCardTrendProps } from "./KpiCardTrend";
export type { KpiCardTrendData, KpiTrendDirection, KpiTrendSentiment } from "./kpi-card-types";
export {
  KpiCard,
  KpiCardGrid,
  KpiCardTrend,
  KpiCardTrendLabel,
  KpiCardVariants,
  kpiCard,
  kpiCardComparison,
  kpiCardDescription,
  kpiCardGrid,
  kpiCardLabel,
  kpiCardTrend,
  kpiCardValue,
};

export default {
  Root: KpiCard,
  Grid: KpiCardGrid,
  Trend: KpiCardTrend,
};
