import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { timelineActions } from "./timeline-variants";

export type TimelineActionsProps = JSX.HTMLAttributes<HTMLDivElement> & {
  children?: ComponentChildren;
};

export const TimelineActions = ({ class: className, children, ...rest }: TimelineActionsProps) => (
  <div data-slot="timeline-actions" class={cn(timelineActions(), className)} {...rest}>
    {children}
  </div>
);
