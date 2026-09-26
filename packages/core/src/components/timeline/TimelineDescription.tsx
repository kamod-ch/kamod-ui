import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { timelineDescription } from "./timeline-variants";

export type TimelineDescriptionProps = JSX.HTMLAttributes<HTMLParagraphElement> & {
  children?: ComponentChildren;
};

export const TimelineDescription = ({
  class: className,
  children,
  ...rest
}: TimelineDescriptionProps) => (
  <p data-slot="timeline-description" class={cn(timelineDescription(), className)} {...rest}>
    {children}
  </p>
);
