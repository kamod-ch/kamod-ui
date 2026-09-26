import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { kpiCardGrid } from "./kpi-card-variants";

export type KpiCardGridProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const KpiCardGrid = ({ class: className, children, ...rest }: KpiCardGridProps) => (
  <div data-slot="kpi-card-grid" class={cn(kpiCardGrid(), className)} {...rest}>
    {children}
  </div>
);
