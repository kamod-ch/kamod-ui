import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { timelineTime } from "./timeline-variants";

export type TimelineTimeProps = Omit<JSX.HTMLAttributes<HTMLTimeElement>, "dateTime"> & {
  /** Machine-readable ISO-8601 timestamp for SSR-stable `<time dateTime>`. */
  dateTime: string;
  children?: ComponentChildren;
};

export const TimelineTime = ({
  dateTime,
  class: className,
  children,
  ...rest
}: TimelineTimeProps) => (
  <time
    dateTime={dateTime}
    data-slot="timeline-time"
    class={cn(timelineTime(), className)}
    {...rest}
  >
    {children}
  </time>
);
