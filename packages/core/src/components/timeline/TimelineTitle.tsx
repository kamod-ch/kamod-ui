import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { timelineTitle } from "./timeline-variants";

export type TimelineTitleProps = JSX.HTMLAttributes<HTMLParagraphElement> & {
  children?: ComponentChildren;
};

export const TimelineTitle = ({ class: className, children, ...rest }: TimelineTitleProps) => (
  <p data-slot="timeline-title" class={cn(timelineTitle(), className)} {...rest}>
    {children}
  </p>
);
