import type { CatalogBlockDefinition } from "../shared";
import { AnalyticsOverview } from "./analytics-overview";
import { type DashboardBlockId, definitions } from "./catalog-definitions";
import { CommandPalette } from "./command-palette";
import { ConversionFunnel } from "./conversion-funnel";
import { CostBreakdown } from "./cost-breakdown";
import { DashboardLayoutPreview } from "./dashboard-layout";
import { EventCalendarPreview } from "./event-calendar";
import { EventList } from "./event-list";
import { KanbanBoardPreview } from "./kanban-board";
import { MetricsGrid } from "./metrics-grid";
import { NotificationsPopover } from "./notifications-popover";
import { ProfileMenu } from "./profile-menu";
import { ProgressBreakdown } from "./progress-breakdown";
import { QuickActions } from "./quick-actions";
import { ThemeCustomize } from "./theme-customize";
import { ToggleSettingList } from "./toggle-setting-list";

export type { DashboardBlockId } from "./catalog-definitions";

export type DashboardBlockDefinition = CatalogBlockDefinition<DashboardBlockId> & {
  props: { name: string; type: string; description: string }[];
  usage: string;
};

const components = {
  "analytics-overview": AnalyticsOverview,
  "command-palette": CommandPalette,
  "conversion-funnel": ConversionFunnel,
  "cost-breakdown": CostBreakdown,
  "dashboard-layout": DashboardLayoutPreview,
  "event-calendar": EventCalendarPreview,
  "event-list": EventList,
  "kanban-board": KanbanBoardPreview,
  "metrics-grid": MetricsGrid,
  "notifications-popover": NotificationsPopover,
  "profile-menu": ProfileMenu,
  "progress-breakdown": ProgressBreakdown,
  "quick-actions": QuickActions,
  "theme-customize": ThemeCustomize,
  "toggle-setting-list": ToggleSettingList,
} satisfies Record<DashboardBlockId, DashboardBlockDefinition["component"]>;

export const dashboardBlocks: DashboardBlockDefinition[] = definitions.map((block) => ({
  ...(block as Omit<DashboardBlockDefinition, "component" | "installCommand" | "source">),
  source: "uipkge",
  component: components[block.id as DashboardBlockId],
  installCommand: `@kamod-ch/blocks/dashboard/${block.id}`,
}));

export const dashboardBlocksById = dashboardBlocks.reduce(
  (acc, block) => {
    acc[block.id] = block;
    return acc;
  },
  {} as Record<DashboardBlockId, DashboardBlockDefinition>,
);
