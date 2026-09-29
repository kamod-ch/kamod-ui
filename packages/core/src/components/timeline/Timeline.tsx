import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { timeline } from "./timeline-variants";

export type TimelineProps = JSX.HTMLAttributes<HTMLOListElement> & {
  children?: ComponentChildren;
  /** Accessible name when the timeline is a standalone landmark. */
  "aria-label"?: string;
};

export const Timeline = ({
  class: className,
  children,
  "aria-label": ariaLabel,
  ...rest
}: TimelineProps) => (
  <ol data-slot="timeline" aria-label={ariaLabel} class={cn(timeline(), className)} {...rest}>
    {children}
  </ol>
);
