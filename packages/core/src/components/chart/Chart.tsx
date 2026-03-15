import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";

export type ChartProps = JSX.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
  children?: ComponentChildren;
};

export const Chart = ({ class: className, title, description, children, ...rest }: ChartProps) => (
  <div data-slot="chart" class={cn("rounded-md border p-4", className)} {...rest}>
    {title ? <h3 class="text-sm font-medium">{title}</h3> : null}
    {description ? <p class="mt-1 text-xs text-muted-foreground">{description}</p> : null}
    <div class="mt-3">{children}</div>
  </div>
);

