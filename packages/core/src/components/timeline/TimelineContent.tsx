import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { timelineContent } from "./timeline-variants";

export type TimelineContentProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const TimelineContent = ({ class: className, children, ...rest }: TimelineContentProps) => (
  <div data-slot="timeline-content" class={cn(timelineContent(), className)} {...rest}>
    {children}
  </div>
);
