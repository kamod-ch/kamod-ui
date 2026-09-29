import { Timeline } from "./Timeline";
import { TimelineActions } from "./TimelineActions";
import { TimelineContent } from "./TimelineContent";
import { TimelineDescription } from "./TimelineDescription";
import { TimelineIndicator } from "./TimelineIndicator";
import { TimelineItem } from "./TimelineItem";
import { TimelineTime } from "./TimelineTime";
import { TimelineTitle } from "./TimelineTitle";
import {
  timeline,
  timelineActions,
  timelineContent,
  timelineDescription,
  timelineIndicator,
  timelineItem,
  timelineLine,
  timelineMarker,
  timelineTime,
  timelineTitle,
} from "./timeline-variants";

const TimelineVariants = {
  timeline,
  timelineItem,
  timelineIndicator,
  timelineLine,
  timelineMarker,
  timelineContent,
  timelineTime,
  timelineTitle,
  timelineDescription,
  timelineActions,
};

export type { TimelineProps } from "./Timeline";

export type { TimelineActionsProps } from "./TimelineActions";
export type { TimelineContentProps } from "./TimelineContent";
export type { TimelineDescriptionProps } from "./TimelineDescription";
export type { TimelineIndicatorProps } from "./TimelineIndicator";
export type { TimelineItemProps } from "./TimelineItem";
export type { TimelineTimeProps } from "./TimelineTime";
export type { TimelineTitleProps } from "./TimelineTitle";
export type { TimelineOrientation } from "./timeline-types";
export type { TimelineFormatOptions } from "./timeline-utils";
export { formatTimelineDateTime, toTimelineDate, toTimelineDateTime } from "./timeline-utils";
export {
  Timeline,
  TimelineActions,
  TimelineContent,
  TimelineDescription,
  TimelineIndicator,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
  TimelineVariants,
  timeline,
  timelineActions,
  timelineContent,
  timelineDescription,
  timelineIndicator,
  timelineItem,
  timelineLine,
  timelineMarker,
  timelineTime,
  timelineTitle,
};

export default {
  Root: Timeline,
  Item: TimelineItem,
  Indicator: TimelineIndicator,
  Content: TimelineContent,
  Time: TimelineTime,
  Title: TimelineTitle,
  Description: TimelineDescription,
  Actions: TimelineActions,
};
