import { createGenericDocPage } from "./create-generic-doc-page";
import {
  AuditTimelineDemo,
  GroupedActivityFeedDemo,
  OrderHistoryTimelineDemo,
  TeamActivityTimelineDemo,
} from "./timeline-activity-demos";

const BASIC_SNIPPET = `import {
  Timeline,
  TimelineActions,
  TimelineContent,
  TimelineDescription,
  TimelineIndicator,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
  formatTimelineDateTime,
  toTimelineDateTime,
} from "@/components/kamod-ui/timeline";

export const Example = ({ events }) => (
  <Timeline aria-label={t("timeline.orderHistory")}>
    {events.map((event) => (
      <TimelineItem key={event.id} itemId={event.id}>
        <TimelineIndicator>{event.icon}</TimelineIndicator>
        <TimelineContent>
          <TimelineTime dateTime={toTimelineDateTime(event.at)}>
            {formatTimelineDateTime(event.at, { locale, timeZone })}
          </TimelineTime>
          <TimelineTitle>{event.title}</TimelineTitle>
          {event.description ? <TimelineDescription>{event.description}</TimelineDescription> : null}
          {event.actions ? <TimelineActions>{event.actions}</TimelineActions> : null}
        </TimelineContent>
      </TimelineItem>
    ))}
  </Timeline>
);`;

export const timelineDocPage = createGenericDocPage({
  title: "Timeline",
  slug: "timeline",
  usageLabel: "Timeline",
  previewCode: BASIC_SNIPPET,
  installationText:
    "Import from `@kamod-ch/ui/timeline`. Timeline is a neutral, semantic `<ol>` list — pass stable entry ids, preserve consumer order, and format timestamps with absolute Intl output for SSR-stable renders.",
  usageText:
    "Compose icons, avatars, titles, descriptions, and actions inside each item. Decorative connector lines are aria-hidden. Day grouping, empty/loading/error states, and load-more behavior belong in the consumer or activity-feed examples — not inside the primitive. Avoid relative time strings unless you compute them with a fixed reference instant on both server and client.",
  installationExample: {
    code: `import { OrderHistoryTimelineDemo } from "./timeline-activity-demos";

export const Example = () => <OrderHistoryTimelineDemo />;`,
    renderPreview: () => <OrderHistoryTimelineDemo />,
  },
  exampleSections: [
    {
      id: "order-history",
      title: "Order history",
      text: "Icons, actions, and absolute `<time dateTime>` values. Event order matches the array passed by the consumer.",
      code: `import { OrderHistoryTimelineDemo } from "./timeline-activity-demos";

export const Example = () => <OrderHistoryTimelineDemo />;`,
      renderPreview: () => <OrderHistoryTimelineDemo />,
    },
    {
      id: "team-activity",
      title: "Team activity with avatars",
      text: "Avatar fallbacks when no image URL exists. Multi-line descriptions wrap naturally — no fixed row height.",
      code: `import { TeamActivityTimelineDemo } from "./timeline-activity-demos";

export const Example = () => <TeamActivityTimelineDemo />;`,
      renderPreview: () => <TeamActivityTimelineDemo />,
    },
    {
      id: "audit-trail",
      title: "Audit-style status changes",
      text: "Presentation-only audit log with status badges. Does not assert immutability or server-side retention.",
      code: `import { AuditTimelineDemo } from "./timeline-activity-demos";

export const Example = () => <AuditTimelineDemo />;`,
      renderPreview: () => <AuditTimelineDemo />,
    },
    {
      id: "grouped-load-more",
      title: "Grouped feed with load more",
      text: "Day grouping uses `@kamod-ch/blocks` datetime helpers in the example. Load more appends items via callback and restores focus to the button — no fetching inside Timeline.",
      code: `import { GroupedActivityFeedDemo } from "./timeline-activity-demos";

export const Example = () => <GroupedActivityFeedDemo />;`,
      renderPreview: () => <GroupedActivityFeedDemo />,
    },
  ],
  apiRows: [
    { prop: "TimelineItem.itemId", type: "string", defaultValue: "required stable id" },
    { prop: "TimelineTime.dateTime", type: "ISO-8601 string", defaultValue: "required" },
    {
      prop: "TimelineTime children",
      type: "ComponentChildren",
      defaultValue: "consumer-formatted label",
    },
    {
      prop: "TimelineIndicator.hideLine",
      type: "boolean",
      defaultValue: "false — hide decorative connector",
    },
    {
      prop: "formatTimelineDateTime",
      type: "(value, { locale, timeZone }) => string",
      defaultValue: "absolute Intl only",
    },
  ],
  accessibilityText:
    "Timeline renders an ordered list (`<ol>`/`<li>`) without a feed-wide aria-live region. Decorative connector lines and default markers are aria-hidden. Provide visible labels via TimelineTitle and format `<time>` children yourself. Compose Empty, Alert, and Skeleton for empty, error, and loading states outside the list.",
});
