import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { timelineIndicator, timelineLine, timelineMarker } from "./timeline-variants";

export type TimelineIndicatorProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
  /** When true, hides the decorative connector line (e.g. last item override). */
  hideLine?: boolean;
  /** Marker size when no custom icon/avatar children are provided. */
  markerSize?: "default" | "md" | "lg";
};

export const TimelineIndicator = ({
  hideLine = false,
  markerSize = "default",
  class: className,
  children,
  ...rest
}: TimelineIndicatorProps) => (
  <div
    data-slot="timeline-indicator"
    class={cn(timelineIndicator(), className)}
    aria-hidden={children ? undefined : true}
    {...rest}
  >
    {!hideLine ? (
      <span data-slot="timeline-line" class={timelineLine()} aria-hidden="true" />
    ) : null}
    {children ?? (
      <span
        data-slot="timeline-marker"
        class={timelineMarker({ size: markerSize })}
        aria-hidden="true"
      />
    )}
  </div>
);
