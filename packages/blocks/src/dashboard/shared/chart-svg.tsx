import type { ComponentChildren } from "preact";
import { formatLocaleNumber } from "./chart-math";

export type ChartTableColumn = {
  key: string;
  label: string;
};

export type ChartTableRow = Record<string, string | number | null | undefined>;

export const ChartDataTable = ({
  caption,
  columns,
  rows,
  locale,
  formatter,
}: {
  caption: string;
  columns: ChartTableColumn[];
  rows: ChartTableRow[];
  locale?: string;
  formatter?: (value: number) => string;
}) => (
  <table class="sr-only">
    <caption>{caption}</caption>
    <thead>
      <tr>
        {columns.map((column) => (
          <th key={column.key} scope="col">
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, index) => (
        <tr key={index}>
          {columns.map((column) => {
            const value = row[column.key];
            const text =
              typeof value === "number"
                ? formatLocaleNumber(value, locale, formatter)
                : (value ?? "—");
            return <td key={column.key}>{text}</td>;
          })}
        </tr>
      ))}
    </tbody>
  </table>
);

export const ChartSvg = ({
  title,
  description,
  width,
  height,
  children,
  class: className,
  labelledBy,
}: {
  title: string;
  description?: string;
  width: number;
  height: number;
  children?: ComponentChildren;
  class?: string;
  labelledBy?: string;
}) => (
  <svg
    role="img"
    aria-labelledby={labelledBy}
    aria-label={labelledBy ? undefined : title}
    viewBox={`0 0 ${width} ${height}`}
    class={className ?? "h-auto w-full overflow-visible"}
    preserveAspectRatio="xMidYMid meet"
  >
    <title>{title}</title>
    {description ? <desc>{description}</desc> : null}
    {children}
  </svg>
);

export const ChartTooltip = ({ x, y, label }: { x: number; y: number; label: string }) => (
  <g pointer-events="none">
    <rect
      x={x}
      y={y}
      rx="4"
      width={Math.max(72, label.length * 6.2)}
      height="24"
      fill="var(--popover)"
      stroke="var(--border)"
    />
    <text x={x + 8} y={y + 16} fill="var(--popover-foreground)" font-size="10">
      {label}
    </text>
  </g>
);
