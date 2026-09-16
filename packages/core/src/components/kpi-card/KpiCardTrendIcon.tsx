import { cn } from "../../lib/utils";
import type { KpiTrendDirection } from "./kpi-card-types";

const iconClass = "size-3.5 shrink-0";

export const KpiCardTrendIcon = ({
  direction,
  class: className,
}: {
  direction: KpiTrendDirection;
  class?: string;
}) => {
  if (direction === "flat") {
    return (
      <svg
        class={cn(iconClass, className)}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path d="M5 12h14" />
      </svg>
    );
  }

  if (direction === "down") {
    return (
      <svg
        class={cn(iconClass, className)}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    );
  }

  return (
    <svg
      class={cn(iconClass, className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
};
