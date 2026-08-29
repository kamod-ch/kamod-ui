import { Chart, Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import { useControllableState } from "../../shared";
import {
  chartToken,
  clampNonNegative,
  formatLocaleNumber,
  maxValue,
  niceCeil,
} from "../shared/chart-math";
import { ChartDataTable, ChartSvg, ChartTooltip } from "../shared/chart-svg";

export type AnalyticsPartnerId = string;

export type AnalyticsRoute = {
  id: string;
  label: string;
  volumes: Record<string, number>;
  overlay: number;
};

export type AnalyticsDrillSeries = {
  id: string;
  label: string;
  values: Array<number | null>;
  color?: string;
};

export type AnalyticsOverviewProps = {
  title?: string;
  description?: string;
  partners?: AnalyticsPartnerId[];
  routes?: AnalyticsRoute[];
  drillLabels?: string[];
  drillSeries?: AnalyticsDrillSeries[];
  selectedRouteId?: string | null;
  defaultSelectedRouteId?: string | null;
  onSelectedRouteChange?: (id: string | null) => void;
  locale?: string;
  formatValue?: (value: number) => string;
};

const defaultPartners = ["ALPHA", "BETA", "GAMMA", "DELTA", "EPSILON"];

const defaultRoutes: AnalyticsRoute[] = [
  {
    id: "r1",
    label: "NODE A → NODE B",
    volumes: { ALPHA: 90, BETA: 25, GAMMA: 18, DELTA: 12, EPSILON: 8 },
    overlay: 12,
  },
  {
    id: "r2",
    label: "NODE C → NODE D",
    volumes: { ALPHA: 4, BETA: 100, GAMMA: 14, DELTA: 12, EPSILON: 24 },
    overlay: 14.7,
  },
  {
    id: "r3",
    label: "NODE E → NODE F",
    volumes: { ALPHA: 14, BETA: 38, GAMMA: 18, DELTA: 32, EPSILON: 28 },
    overlay: 8,
  },
  {
    id: "r4",
    label: "NODE G → NODE H",
    volumes: { ALPHA: 130, BETA: 0, GAMMA: 0, DELTA: 0, EPSILON: 0 },
    overlay: 6,
  },
  {
    id: "r5",
    label: "NODE I → NODE J",
    volumes: { ALPHA: 0, BETA: 0, GAMMA: 60, DELTA: 0, EPSILON: 70 },
    overlay: 17,
  },
  {
    id: "r6",
    label: "NODE K → NODE L",
    volumes: { ALPHA: 60, BETA: 50, GAMMA: 16, DELTA: 0, EPSILON: 0 },
    overlay: 8,
  },
  {
    id: "r7",
    label: "NODE M → NODE N",
    volumes: { ALPHA: 70, BETA: 0, GAMMA: 0, DELTA: 0, EPSILON: 0 },
    overlay: 22,
  },
  {
    id: "r8",
    label: "NODE O → NODE P",
    volumes: { ALPHA: 0, BETA: 0, GAMMA: 0, DELTA: 0, EPSILON: 110 },
    overlay: 29,
  },
  {
    id: "r9",
    label: "NODE Q → NODE R",
    volumes: { ALPHA: 40, BETA: 0, GAMMA: 60, DELTA: 0, EPSILON: 0 },
    overlay: 19,
  },
  {
    id: "r10",
    label: "NODE S → NODE T",
    volumes: { ALPHA: 60, BETA: 30, GAMMA: 0, DELTA: 0, EPSILON: 0 },
    overlay: 23,
  },
];

const defaultDrillLabels = ["Mar 2026", "Apr 2026", "May 2026"];

const defaultDrillSeries: AnalyticsDrillSeries[] = [
  { id: "ALPHA", label: "ALPHA", values: [22, 25, 20] },
  { id: "GAMMA", label: "GAMMA", values: [19, 17, 18] },
  { id: "EPSILON", label: "EPSILON", values: [null, 29, null] },
];

const plot = { left: 48, right: 48, top: 28, bottom: 64 };

export const AnalyticsOverview = ({
  title = "Analytics overview",
  description = "Stacked partner volume with a dual-axis overlay. Select a route to filter the drill-down.",
  partners = defaultPartners,
  routes = defaultRoutes,
  drillLabels = defaultDrillLabels,
  drillSeries = defaultDrillSeries,
  selectedRouteId,
  defaultSelectedRouteId = null,
  onSelectedRouteChange,
  locale = "en-US",
  formatValue,
}: AnalyticsOverviewProps) => {
  const [selected, setSelected] = useControllableState<string | null>({
    value: selectedRouteId,
    defaultValue: defaultSelectedRouteId,
    onChange: onSelectedRouteChange,
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [tooltip, setTooltip] = useState<string | null>(null);

  const fmt = (value: number) => formatLocaleNumber(value, locale, formatValue);
  const selectedRoute = routes.find((route) => route.id === selected) ?? null;
  const volumes = routes.map((route) =>
    partners.reduce((sum, partner) => sum + clampNonNegative(route.volumes[partner]), 0),
  );
  const overlays = routes.map((route) => clampNonNegative(route.overlay));
  const volumeMax = niceCeil(maxValue(volumes));
  const overlayMax = niceCeil(maxValue(overlays));
  const width = 720;
  const height = 280;
  const innerWidth = width - plot.left - plot.right;
  const innerHeight = height - plot.top - plot.bottom;
  const barWidth = innerWidth / Math.max(routes.length, 1);

  const selectRoute = (id: string) => setSelected(selected === id ? null : id);

  const moveActive = (delta: number) => {
    if (routes.length === 0) return;
    const next = Math.min(routes.length - 1, Math.max(0, activeIndex + delta));
    setActiveIndex(next);
    const route = routes[next];
    if (route) setTooltip(`${route.label}: ${fmt(volumes[next] ?? 0)}`);
  };

  return (
    <div data-slot="block-analytics-overview" class="bg-background p-4 text-foreground">
      <Chart title={title} description={description} class="max-w-5xl">
        {routes.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No routes</EmptyTitle>
              <EmptyDescription>Provide at least one route to plot volume.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            <p class="mb-2 text-muted-foreground text-xs">
              Keyboard: Left/Right to inspect a route, Enter to filter the drill-down, Escape to
              clear.
            </p>
            <ChartSvg
              title="Route volume and overlay metric"
              description="Stacked bars are partner volume. Dots use the right axis."
              width={width}
              height={height}
            >
              {routes.map((route, index) => {
                const x = plot.left + index * barWidth + barWidth * 0.18;
                const groupWidth = barWidth * 0.64;
                let y = height - plot.bottom;
                const isActive = index === activeIndex || route.id === selected;
                return (
                  <g
                    key={route.id}
                    tabIndex={0}
                    role="button"
                    aria-pressed={route.id === selected}
                    aria-label={`${route.label}, volume ${fmt(volumes[index] ?? 0)}, overlay ${fmt(overlays[index] ?? 0)}`}
                    onFocus={() => {
                      setActiveIndex(index);
                      setTooltip(`${route.label}: ${fmt(volumes[index] ?? 0)}`);
                    }}
                    onMouseEnter={() => setTooltip(`${route.label}: ${fmt(volumes[index] ?? 0)}`)}
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => selectRoute(route.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        selectRoute(route.id);
                      }
                      if (event.key === "ArrowRight") {
                        event.preventDefault();
                        moveActive(1);
                      }
                      if (event.key === "ArrowLeft") {
                        event.preventDefault();
                        moveActive(-1);
                      }
                      if (event.key === "Escape") {
                        event.preventDefault();
                        setSelected(null);
                        setTooltip(null);
                      }
                    }}
                  >
                    {partners.map((partner, partnerIndex) => {
                      const value = clampNonNegative(route.volumes[partner]);
                      const barHeight = (value / volumeMax) * innerHeight;
                      y -= barHeight;
                      if (barHeight <= 0) return null;
                      return (
                        <rect
                          key={partner}
                          x={x}
                          y={y}
                          width={groupWidth}
                          height={barHeight}
                          fill={chartToken(partnerIndex)}
                          opacity={isActive ? 1 : 0.78}
                        />
                      );
                    })}
                    <circle
                      cx={x + groupWidth / 2}
                      cy={height - plot.bottom - (overlays[index] / overlayMax) * innerHeight}
                      r={isActive ? 5.5 : 4.5}
                      fill={chartToken(2)}
                      stroke="var(--background)"
                      stroke-width="2"
                    />
                    <text
                      x={x + groupWidth / 2}
                      y={height - plot.bottom + 16}
                      text-anchor="middle"
                      fill="var(--muted-foreground)"
                      font-size="8"
                    >
                      {route.label.replace(" → ", " / ")}
                    </text>
                  </g>
                );
              })}
              {tooltip ? (
                <ChartTooltip x={plot.left + activeIndex * barWidth} y={plot.top} label={tooltip} />
              ) : null}
            </ChartSvg>
            <ChartDataTable
              caption="Route volume by partner"
              columns={[
                { key: "route", label: "Route" },
                ...partners.map((partner) => ({ key: partner, label: partner })),
                { key: "overlay", label: "Overlay" },
              ]}
              rows={routes.map((route) => ({
                route: route.label,
                overlay: clampNonNegative(route.overlay),
                ...Object.fromEntries(
                  partners.map((partner) => [partner, clampNonNegative(route.volumes[partner])]),
                ),
              }))}
              locale={locale}
              formatter={formatValue}
            />
            <DrillChart
              title={
                selectedRoute ? `Drill-down · ${selectedRoute.label}` : "Drill-down · all routes"
              }
              labels={drillLabels}
              series={
                selectedRoute
                  ? drillSeries.filter(
                      (item) => clampNonNegative(selectedRoute.volumes[item.id]) > 0,
                    )
                  : drillSeries
              }
              locale={locale}
              formatValue={formatValue}
            />
          </>
        )}
      </Chart>
    </div>
  );
};

const DrillChart = ({
  title,
  labels,
  series,
  locale,
  formatValue,
}: {
  title: string;
  labels: string[];
  series: AnalyticsDrillSeries[];
  locale: string;
  formatValue?: (value: number) => string;
}) => {
  const [active, setActive] = useState<{ series: number; point: number } | null>(null);
  const width = 720;
  const height = 220;
  const innerWidth = width - plot.left - plot.right;
  const innerHeight = height - 72;
  const values = series.flatMap((item) => item.values.map((value) => clampNonNegative(value ?? 0)));
  const yMax = niceCeil(maxValue(values));
  const step = labels.length > 1 ? innerWidth / (labels.length - 1) : innerWidth;
  const fmt = (value: number) => formatLocaleNumber(value, locale, formatValue);

  return (
    <div class="mt-6 border-t border-border pt-4">
      <h4 class="mb-2 text-sm font-medium">{title}</h4>
      <ChartSvg
        title={title}
        description="Monthly partner series for the selected route."
        width={width}
        height={height}
      >
        {series.map((item, seriesIndex) => {
          const points = item.values.map((value, pointIndex) => {
            const numeric = value == null || value < 0 ? null : value;
            return {
              x: plot.left + pointIndex * step,
              y: numeric == null ? null : 36 + innerHeight - (numeric / yMax) * innerHeight,
              value: numeric,
            };
          });
          const path = points
            .map((point, index) => {
              if (point.y == null) return null;
              const command = index === 0 || points[index - 1]?.y == null ? "M" : "L";
              return `${command} ${point.x} ${point.y}`;
            })
            .filter(Boolean)
            .join(" ");
          return (
            <g key={item.id}>
              <path
                d={path}
                fill="none"
                stroke={item.color ?? chartToken(seriesIndex)}
                stroke-width="2"
              />
              {points.map((point, pointIndex) =>
                point.y == null ? null : (
                  <circle
                    key={`${item.id}-${pointIndex}`}
                    cx={point.x}
                    cy={point.y}
                    r={active?.series === seriesIndex && active.point === pointIndex ? 5 : 3.5}
                    fill={item.color ?? chartToken(seriesIndex)}
                    tabIndex={0}
                    role="img"
                    aria-label={`${item.label} ${labels[pointIndex]} ${fmt(point.value ?? 0)}`}
                    onFocus={() => setActive({ series: seriesIndex, point: pointIndex })}
                    onBlur={() => setActive(null)}
                    onMouseEnter={() => setActive({ series: seriesIndex, point: pointIndex })}
                    onMouseLeave={() => setActive(null)}
                  />
                ),
              )}
            </g>
          );
        })}
        {labels.map((label, index) => (
          <text
            key={label}
            x={plot.left + index * step}
            y={height - 12}
            text-anchor="middle"
            fill="var(--muted-foreground)"
            font-size="10"
          >
            {label}
          </text>
        ))}
        {active && series[active.series] && labels[active.point] ? (
          <ChartTooltip
            x={plot.left + active.point * step}
            y={20}
            label={`${series[active.series]?.label} ${fmt(series[active.series]?.values[active.point] ?? 0)}`}
          />
        ) : null}
      </ChartSvg>
      <ChartDataTable
        caption="Drill-down series"
        columns={[
          { key: "series", label: "Series" },
          ...labels.map((label) => ({ key: label, label })),
        ]}
        rows={series.map((item) => ({
          series: item.label,
          ...Object.fromEntries(labels.map((label, index) => [label, item.values[index]])),
        }))}
        locale={locale}
        formatter={formatValue}
      />
    </div>
  );
};
