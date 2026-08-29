import { Progress } from "@kamod-ch/ui";
import { DashboardSection } from "../shared/section-card";

export type ProgressBreakdownItem = {
  id: string;
  label: string;
  value: number;
  max?: number;
  hint?: string;
};

export type ProgressBreakdownProps = {
  title?: string;
  description?: string;
  items?: ProgressBreakdownItem[];
};

const defaultItems: ProgressBreakdownItem[] = [
  { id: "onboarding", label: "Onboarding", value: 92, hint: "New workspaces" },
  { id: "activation", label: "Activation", value: 74, hint: "First project created" },
  { id: "retention", label: "Retention", value: 61, hint: "Weekly active" },
  { id: "expansion", label: "Expansion", value: 38, hint: "Seats added" },
];

const clamp = (value: number, max: number): number => Math.min(max, Math.max(0, value));

export const ProgressBreakdown = ({
  title = "Progress breakdown",
  description = "How this quarter is tracking against the plan.",
  items = defaultItems,
}: ProgressBreakdownProps) => (
  <DashboardSection slot="block-progress-breakdown" title={title} description={description}>
    <ul class="grid gap-4">
      {items.map((item) => {
        const max = item.max && item.max > 0 ? item.max : 100;
        const value = clamp(item.value, max);
        const percent = Math.round((value / max) * 100);
        const labelId = `progress-${item.id}-label`;
        return (
          <li key={item.id} class="grid gap-2">
            <div class="flex items-baseline justify-between gap-3">
              <div>
                <p id={labelId} class="text-sm font-medium">
                  {item.label}
                </p>
                {item.hint ? <p class="text-muted-foreground text-xs">{item.hint}</p> : null}
              </div>
              <p class="text-muted-foreground text-xs tabular-nums" aria-hidden="true">
                {percent}%
              </p>
            </div>
            <Progress
              value={value}
              max={max}
              aria-labelledby={labelId}
              aria-valuetext={`${percent} percent`}
            />
          </li>
        );
      })}
    </ul>
  </DashboardSection>
);
