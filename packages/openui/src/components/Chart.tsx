import { Chart } from "@kamod-ch/ui/chart";
import { defineComponent } from "@openuidev/react-lang";
import { z } from "zod";
import { MAX_DESCRIPTION_LENGTH, MAX_LABEL_LENGTH } from "../constants";

const seriesItemSchema = z.object({
  label: z.string().min(1).max(MAX_LABEL_LENGTH),
  value: z.number(),
});

export const chartComponent = defineComponent({
  name: "Chart",
  description:
    "Simple horizontal bar chart chrome. Args: optional title, description, series [{label, value}] max 24. Values are shown as bar widths relative to the max.",
  props: z.object({
    title: z.string().max(MAX_LABEL_LENGTH).optional(),
    description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
    series: z.array(seriesItemSchema).min(1).max(24),
  }),
  component: ({ props }) => {
    const max = Math.max(...props.series.map((s) => Math.abs(s.value)), 0) || 1;
    return (
      <Chart title={props.title} description={props.description}>
        <ul class="flex flex-col gap-2" data-slot="openui-chart-bars">
          {props.series.map((item) => {
            const pct = Math.max(0, Math.min(100, (Math.abs(item.value) / max) * 100));
            return (
              <li key={item.label} class="flex flex-col gap-1">
                <div class="flex items-baseline justify-between gap-2 text-xs">
                  <span class="truncate font-medium">{item.label}</span>
                  <span class="shrink-0 text-muted-foreground tabular-nums">{item.value}</span>
                </div>
                <div class="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    class="h-full rounded-full bg-primary"
                    style={{ width: `${pct}%` }}
                    role="presentation"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </Chart>
    );
  },
});
