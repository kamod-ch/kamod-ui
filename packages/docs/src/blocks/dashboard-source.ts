import type { DashboardBlockId } from "@kamod-ch/blocks";
import analyticsOverview from "../../../blocks/src/dashboard/analytics-overview/analytics-overview.tsx?raw";
import commandPalette from "../../../blocks/src/dashboard/command-palette/command-palette.tsx?raw";
import conversionFunnel from "../../../blocks/src/dashboard/conversion-funnel/conversion-funnel.tsx?raw";
import costBreakdown from "../../../blocks/src/dashboard/cost-breakdown/cost-breakdown.tsx?raw";
import dashboardLayout from "../../../blocks/src/dashboard/dashboard-layout/dashboard-layout.tsx?raw";
import eventCalendarDate from "../../../blocks/src/dashboard/event-calendar/date.ts?raw";
import eventCalendar from "../../../blocks/src/dashboard/event-calendar/event-calendar.tsx?raw";
import eventCalendarTypes from "../../../blocks/src/dashboard/event-calendar/types.ts?raw";
import eventCalendarHook from "../../../blocks/src/dashboard/event-calendar/use-event-calendar.ts?raw";
import eventList from "../../../blocks/src/dashboard/event-list/event-list.tsx?raw";
import kanbanBoard from "../../../blocks/src/dashboard/kanban-board/kanban-board.tsx?raw";
import kanbanMachine from "../../../blocks/src/dashboard/kanban-board/kanban-machine.ts?raw";
import kanbanTypes from "../../../blocks/src/dashboard/kanban-board/types.ts?raw";
import kanbanHook from "../../../blocks/src/dashboard/kanban-board/use-kanban.ts?raw";
import metricsGrid from "../../../blocks/src/dashboard/metrics-grid/metrics-grid.tsx?raw";
import notificationsPopover from "../../../blocks/src/dashboard/notifications-popover/notifications-popover.tsx?raw";
import profileMenu from "../../../blocks/src/dashboard/profile-menu/profile-menu.tsx?raw";
import progressBreakdown from "../../../blocks/src/dashboard/progress-breakdown/progress-breakdown.tsx?raw";
import quickActions from "../../../blocks/src/dashboard/quick-actions/quick-actions.tsx?raw";
import chartMath from "../../../blocks/src/dashboard/shared/chart-math.ts?raw";
import chartSvg from "../../../blocks/src/dashboard/shared/chart-svg.tsx?raw";
import sectionCard from "../../../blocks/src/dashboard/shared/section-card.tsx?raw";
import themeCustomize from "../../../blocks/src/dashboard/theme-customize/theme-customize.tsx?raw";
import toggleSettingList from "../../../blocks/src/dashboard/toggle-setting-list/toggle-setting-list.tsx?raw";

const chartSupport = {
  "components/chart-math.ts": chartMath,
  "components/chart-svg.tsx": chartSvg,
};

const sources: Record<DashboardBlockId, Record<string, string>> = {
  "analytics-overview": {
    "components/analytics-overview.tsx": analyticsOverview,
    ...chartSupport,
  },
  "command-palette": { "components/command-palette.tsx": commandPalette },
  "conversion-funnel": {
    "components/conversion-funnel.tsx": conversionFunnel,
    ...chartSupport,
  },
  "cost-breakdown": {
    "components/cost-breakdown.tsx": costBreakdown,
    ...chartSupport,
  },
  "dashboard-layout": { "components/dashboard-layout.tsx": dashboardLayout },
  "event-calendar": {
    "components/event-calendar.tsx": eventCalendar,
    "components/types.ts": eventCalendarTypes,
    "components/date.ts": eventCalendarDate,
    "components/use-event-calendar.ts": eventCalendarHook,
  },
  "event-list": {
    "components/event-list.tsx": eventList,
    "components/section-card.tsx": sectionCard,
  },
  "kanban-board": {
    "components/kanban-board.tsx": kanbanBoard,
    "components/types.ts": kanbanTypes,
    "components/kanban-machine.ts": kanbanMachine,
    "components/use-kanban.ts": kanbanHook,
  },
  "metrics-grid": {
    "components/metrics-grid.tsx": metricsGrid,
    ...chartSupport,
  },
  "notifications-popover": { "components/notifications-popover.tsx": notificationsPopover },
  "profile-menu": { "components/profile-menu.tsx": profileMenu },
  "progress-breakdown": {
    "components/progress-breakdown.tsx": progressBreakdown,
    "components/section-card.tsx": sectionCard,
  },
  "quick-actions": {
    "components/quick-actions.tsx": quickActions,
    "components/section-card.tsx": sectionCard,
  },
  "theme-customize": { "components/theme-customize.tsx": themeCustomize },
  "toggle-setting-list": {
    "components/toggle-setting-list.tsx": toggleSettingList,
    "components/section-card.tsx": sectionCard,
  },
};

export const getDashboardBlockSource = (id: DashboardBlockId, fileLabel: string): string =>
  sources[id]?.[fileLabel] ?? Object.values(sources[id] ?? {})[0] ?? "";
