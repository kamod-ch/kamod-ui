const CHART_TOKEN_COUNT = 5;

export const chartToken = (index: number): string =>
  `var(--chart-${(Math.max(0, index) % CHART_TOKEN_COUNT) + 1})`;

const finiteNumber = (value: unknown): number | null => {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return value;
};

export const clampNonNegative = (value: unknown): number => {
  const next = finiteNumber(value);
  return next == null || next < 0 ? 0 : next;
};

export const formatLocaleNumber = (
  value: number,
  locale = "en-US",
  formatter?: (value: number) => string,
): string => {
  if (formatter) return formatter(value);
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value);
};

export const formatPercent = (ratio: number | null, locale = "en-US"): string => {
  if (ratio == null || !Number.isFinite(ratio)) return "—";
  return new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 0 }).format(
    ratio,
  );
};

export type FunnelStage = {
  id: string;
  label: string;
  value: number;
  color?: string;
};

const FUNNEL_MIN_STAGES = 3;
const FUNNEL_MAX_STAGES = 6;

export const normalizeFunnelStages = (stages: FunnelStage[]): FunnelStage[] => {
  const cleaned = stages
    .map((stage) => ({ ...stage, value: clampNonNegative(stage.value) }))
    .slice(0, FUNNEL_MAX_STAGES);
  return cleaned.length >= FUNNEL_MIN_STAGES ? cleaned : [];
};

export const funnelShareOfFirst = (value: number, first: number): number | null => {
  if (first <= 0) return null;
  return value / first;
};

export const funnelRetention = (current: number, previous: number): number | null => {
  if (previous <= 0) return null;
  return current / previous;
};

export type NamedValue = {
  id: string;
  label: string;
  value: number;
  color?: string;
};

const normalizeNamedValues = (items: NamedValue[]): NamedValue[] =>
  items
    .map((item) => ({ ...item, value: clampNonNegative(item.value) }))
    .filter((item) => item.value > 0);

export type PieArc = NamedValue & {
  start: number;
  end: number;
  percent: number;
};

export const pieArcs = (items: NamedValue[]): PieArc[] => {
  const slices = normalizeNamedValues(items);
  const total = slices.reduce((sum, item) => sum + item.value, 0);
  if (total <= 0) return [];
  let cursor = -Math.PI / 2;
  return slices.map((item) => {
    const sweep = (item.value / total) * Math.PI * 2;
    const start = cursor;
    const end = cursor + sweep;
    cursor = end;
    return { ...item, start, end, percent: item.value / total };
  });
};

const polarToCartesian = (
  cx: number,
  cy: number,
  radius: number,
  angle: number,
): { x: number; y: number } => ({
  x: cx + radius * Math.cos(angle),
  y: cy + radius * Math.sin(angle),
});

export const donutPath = (
  cx: number,
  cy: number,
  inner: number,
  outer: number,
  start: number,
  end: number,
): string => {
  const large = end - start > Math.PI ? 1 : 0;
  const outerStart = polarToCartesian(cx, cy, outer, start);
  const outerEnd = polarToCartesian(cx, cy, outer, end);
  const innerEnd = polarToCartesian(cx, cy, inner, end);
  const innerStart = polarToCartesian(cx, cy, inner, start);
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outer} ${outer} 0 ${large} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${inner} ${inner} 0 ${large} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
};

export const maxValue = (values: number[]): number => {
  const peak = values.reduce((highest, value) => Math.max(highest, value), 0);
  return peak > 0 ? peak : 1;
};

export const niceCeil = (value: number): number => {
  if (value <= 0) return 1;
  const exponent = 10 ** Math.floor(Math.log10(value));
  const scaled = value / exponent;
  const nice = scaled <= 1 ? 1 : scaled <= 2 ? 2 : scaled <= 5 ? 5 : 10;
  return nice * exponent;
};
