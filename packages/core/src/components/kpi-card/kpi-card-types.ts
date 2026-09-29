import type { ComponentChildren } from "preact";

export type KpiTrendDirection = "up" | "down" | "flat";

export type KpiTrendSentiment = "positive" | "negative" | "neutral";

export type KpiCardTrendData = {
  direction: KpiTrendDirection;
  sentiment: KpiTrendSentiment;
  /** Consumer-supplied change caption (already formatted; no auto math). */
  label: ComponentChildren;
  /** Optional accessible name when the visible label alone is ambiguous. */
  ariaLabel?: string;
};
