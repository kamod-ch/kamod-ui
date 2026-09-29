import type { ComponentChildren, JSX } from "preact";
import { cn } from "../../lib/utils";
import { timelineItem } from "./timeline-variants";

export type TimelineItemProps = JSX.HTMLAttributes<HTMLLIElement> & {
  /** Stable entry id — exposed as `data-item-id` for keys and testing. */
  itemId: string;
  children?: ComponentChildren;
};

export const TimelineItem = ({
  itemId,
  class: className,
  children,
  ...rest
}: TimelineItemProps) => (
  <li
    data-slot="timeline-item"
    data-item-id={itemId}
    class={cn("group/timeline-item", timelineItem(), className)}
    {...rest}
  >
    {children}
  </li>
);
