import type { CatalogBlockDefinition, CatalogBlockFile } from "../shared";
import { AnalyticsOverview } from "./analytics-overview";
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

export type DashboardBlockId =
  | "analytics-overview"
  | "command-palette"
  | "conversion-funnel"
  | "cost-breakdown"
  | "dashboard-layout"
  | "event-calendar"
  | "event-list"
  | "kanban-board"
  | "metrics-grid"
  | "notifications-popover"
  | "profile-menu"
  | "progress-breakdown"
  | "quick-actions"
  | "theme-customize"
  | "toggle-setting-list";

export type DashboardBlockDefinition = CatalogBlockDefinition<DashboardBlockId> & {
  props: { name: string; type: string; description: string }[];
  usage: string;
};

const catalog = (id: DashboardBlockId) => `https://uipkge.dev/react/blocks/${id}`;

const componentFile = (id: DashboardBlockId, fileName: string): CatalogBlockFile => ({
  path: `src/dashboard/${id}/${fileName}`,
  label: `components/${fileName}`,
  kind: "component",
});

const support = (path: string, label: string): CatalogBlockFile => ({
  path,
  label,
  kind: "support",
});

const usage = (id: DashboardBlockId, name: string) =>
  `import { ${name} } from "@kamod-ch/blocks/dashboard/${id}";\n\nexport const Example = () => <${name} />;`;

const sectionCard = support("src/dashboard/shared/section-card.tsx", "components/section-card.tsx");

const chartMath = support("src/dashboard/shared/chart-math.ts", "components/chart-math.ts");
const chartSvg = support("src/dashboard/shared/chart-svg.tsx", "components/chart-svg.tsx");

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

const definitions: Omit<DashboardBlockDefinition, "component" | "installCommand" | "source">[] = [
  {
    id: "analytics-overview",
    title: "Analytics Overview",
    description:
      "Stacked route volume with a dual-axis overlay and a keyboard-filterable drill-down. Charts use --chart-* tokens, a hidden data table, and SVG viewBox sizing (no window during SSR).",
    category: "dashboard",
    catalogUrl: catalog("analytics-overview"),
    files: [componentFile("analytics-overview", "analytics-overview.tsx"), chartMath, chartSvg],
    dependencies: ["@kamod-ch/ui", "preact"],
    uiComponents: ["Chart", "Empty"],
    tags: ["dashboard", "charts"],
    features: ["controlled-route", "keyboard-drilldown", "ssr-svg", "data-table"],
    preview: { height: 760, fullWidth: true },
    props: [
      {
        name: "routes",
        type: "AnalyticsRoute[]",
        description: "Partner volumes plus overlay metric.",
      },
      {
        name: "selectedRouteId",
        type: "string | null",
        description: "Controlled selected route for the drill-down.",
      },
      { name: "locale", type: "string", description: "Intl locale for value formatting." },
    ],
    usage: `import { AnalyticsOverview } from "@kamod-ch/blocks/dashboard/analytics-overview";

export const Example = () => (
  <AnalyticsOverview
    selectedRouteId={null}
    onSelectedRouteChange={(id) => console.log(id)}
    routes={[
      {
        id: "r1",
        label: "NODE A → NODE B",
        volumes: { ALPHA: 90, BETA: 25 },
        overlay: 12,
      },
    ]}
  />
);`,
  },
  {
    id: "command-palette",
    title: "Command Palette",
    description:
      "Searchable command dialog with groups, optional trigger, and a Cmd/Ctrl+K shortcut.",
    category: "dashboard",
    catalogUrl: catalog("command-palette"),
    files: [componentFile("command-palette", "command-palette.tsx")],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Button", "Command", "CommandDialog", "DialogTitle", "Kbd"],
    tags: ["dashboard", "command", "keyboard"],
    features: ["controlled-open", "shortcut-ssr-safe", "focus-restore", "editable-guard"],
    preview: { height: 360, fullWidth: true },
    props: [
      {
        name: "groups",
        type: "CommandPaletteGroup[]",
        description: "Heading plus searchable items.",
      },
      {
        name: "onSelect",
        type: "(item: CommandPaletteItem) => void",
        description: "Fired when an item is chosen.",
      },
      {
        name: "showTrigger",
        type: "boolean",
        description: "Show the search button. Defaults to true.",
      },
      { name: "shortcut", type: "boolean", description: "Register Cmd/Ctrl+K in the browser." },
      { name: "open", type: "boolean", description: "Controlled open state." },
    ],
    usage: usage("command-palette", "CommandPalette"),
  },
  {
    id: "conversion-funnel",
    title: "Conversion Funnel",
    description:
      "Three to six stages with share-of-first bands, retention, and a hidden data table. Empty or invalid stage counts show an empty state; division by zero is an em dash.",
    category: "dashboard",
    catalogUrl: catalog("conversion-funnel"),
    files: [componentFile("conversion-funnel", "conversion-funnel.tsx"), chartMath, chartSvg],
    dependencies: ["@kamod-ch/ui", "preact"],
    uiComponents: ["Chart", "Empty"],
    tags: ["dashboard", "charts", "funnel"],
    features: ["stage-validation", "zero-safe-ratios", "ssr-svg", "data-table"],
    preview: { height: 420, fullWidth: true },
    props: [
      {
        name: "stages",
        type: "ConversionFunnelStage[]",
        description: "3–6 labeled counts. Extra stages are dropped; fewer than 3 shows empty.",
      },
      { name: "locale", type: "string", description: "Intl locale for counts and percents." },
      {
        name: "formatValue",
        type: "(value: number) => string",
        description: "Optional count formatter.",
      },
    ],
    usage: `import { ConversionFunnel } from "@kamod-ch/blocks/dashboard/conversion-funnel";

export const Example = () => (
  <ConversionFunnel
    stages={[
      { id: "views", label: "Views", value: 72000 },
      { id: "cart", label: "Cart", value: 38200 },
      { id: "checkout", label: "Checkout", value: 16800 },
      { id: "purchase", label: "Purchase", value: 5600 },
    ]}
  />
);`,
  },
  {
    id: "cost-breakdown",
    title: "Cost Breakdown",
    description:
      "Weekly stacked spend plus lane/carrier pies. Negative, missing, or empty series collapse to zero. Keyboard-focusable stacks and a screen-reader table.",
    category: "dashboard",
    catalogUrl: catalog("cost-breakdown"),
    files: [componentFile("cost-breakdown", "cost-breakdown.tsx"), chartMath, chartSvg],
    dependencies: ["@kamod-ch/ui", "preact"],
    uiComponents: ["Chart", "Empty"],
    tags: ["dashboard", "charts", "cost"],
    features: ["empty-negative-guard", "keyboard-tooltips", "ssr-svg", "data-table"],
    preview: { height: 720, fullWidth: true },
    props: [
      { name: "weeks", type: "CostWeek[]", description: "Weekly stacks keyed by series id." },
      {
        name: "series",
        type: "CostSeries[]",
        description: "Stack layers with optional color tokens.",
      },
      {
        name: "byLane",
        type: "NamedValue[]",
        description: "Pie slices by lane. Negatives omitted.",
      },
      { name: "byCarrier", type: "NamedValue[]", description: "Pie slices by carrier." },
    ],
    usage: `import { CostBreakdown } from "@kamod-ch/blocks/dashboard/cost-breakdown";

export const Example = () => (
  <CostBreakdown
    weeks={[{ id: "w1", label: "Jan 26", values: { detention: 2800 } }]}
    series={[{ id: "detention", label: "Detention" }]}
    byLane={[{ id: "lane-01", label: "LANE-01", value: 2800 }]}
    byCarrier={[{ id: "alpha", label: "C-ALPHA", value: 2800 }]}
  />
);`,
  },
  {
    id: "dashboard-layout",
    title: "Dashboard Layout",
    description:
      "App shell with App Sidebar 02, breadcrumb model, and topbar slots for theme, notifications, and profile. Auth and routing stay with the consumer.",
    category: "dashboard",
    catalogUrl: catalog("dashboard-layout"),
    files: [componentFile("dashboard-layout", "dashboard-layout.tsx")],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Sidebar", "SidebarProvider", "Breadcrumb", "ThemeToggle"],
    tags: ["dashboard", "layout", "sidebar"],
    features: ["children-slot", "breadcrumb-model", "topbar-slots"],
    preview: { height: 720, fullWidth: true },
    props: [
      {
        name: "children",
        type: "ComponentChildren",
        description: "Main canvas content.",
      },
      {
        name: "breadcrumbs",
        type: "DashboardBreadcrumbItem[]",
        description: "Typed crumb labels with optional hrefs.",
      },
      {
        name: "themeSlot",
        type: "ComponentChildren",
        description: "Replace the default ThemeToggle.",
      },
      {
        name: "notificationsSlot",
        type: "ComponentChildren",
        description: "Replace the default notifications popover.",
      },
      {
        name: "profileSlot",
        type: "ComponentChildren",
        description: "Replace the default profile menu.",
      },
      {
        name: "open",
        type: "boolean",
        description: "Controlled sidebar collapse. Cookie persist is Core SidebarProvider.",
      },
    ],
    usage: `import { DashboardLayout } from "@kamod-ch/blocks/dashboard/dashboard-layout";

export const Example = () => (
  <DashboardLayout breadcrumbs={[{ label: "Workspace", href: "/workspace" }, { label: "Overview" }]}>
    <p>Main canvas</p>
  </DashboardLayout>
);`,
  },
  {
    id: "event-calendar",
    title: "Event Calendar",
    description:
      "Controlled month grid with civil DateKeys (not UTC instants), Shift-range selection, upcoming list, and context actions. Keyboard: arrows, Home/End, PageUp/PageDown, Enter/Space. Pointer drag does not replace keyboard or touch. Empty, loading, error, and read-only states included.",
    category: "dashboard",
    catalogUrl: catalog("event-calendar"),
    files: [
      componentFile("event-calendar", "event-calendar.tsx"),
      support("src/dashboard/event-calendar/types.ts", "components/types.ts"),
      support("src/dashboard/event-calendar/date.ts", "components/date.ts"),
      support(
        "src/dashboard/event-calendar/use-event-calendar.ts",
        "components/use-event-calendar.ts",
      ),
    ],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Button", "ContextMenu", "Empty", "Skeleton"],
    tags: ["dashboard", "calendar", "events"],
    features: [
      "controlled-events",
      "civil-date-keys",
      "grid-keyboard",
      "shift-range",
      "empty-loading-error",
    ],
    preview: { height: 720, fullWidth: true },
    props: [
      {
        name: "events",
        type: "CalendarEvent[]",
        description: "Source of truth. startsAt/endsAt are instants; grid cells are DateKeys.",
      },
      {
        name: "onEventsChange",
        type: "(events: CalendarEvent[]) => void",
        description: "Emitted after delete/duplicate. Consumer persists.",
      },
      {
        name: "selectedRange",
        type: "CalendarDateRange | null",
        description: "Optional controlled civil-date selection.",
      },
      {
        name: "weekStartsOn",
        type: "0-6",
        description: "0 = Sunday. Default 0. Combined with locale weekday labels.",
      },
      {
        name: "timeZone",
        type: "string",
        description: "IANA zone for instant → DateKey. Avoids UTC midnight shifts.",
      },
      {
        name: "status",
        type: '"ready" | "loading" | "error"',
        description: "Loading skeleton or error alert. Ready shows the grid.",
      },
      { name: "readOnly", type: "boolean", description: "Keeps selection; hides mutations." },
    ],
    usage: `import { EventCalendar } from "@kamod-ch/blocks/dashboard/event-calendar";
import { useState } from "preact/hooks";

export const Example = () => {
  const [events, setEvents] = useState([
    { id: "1", title: "Standup", startsAt: "2026-08-14T13:00:00.000Z", type: "meet" },
  ]);
  return (
    <EventCalendar
      events={events}
      onEventsChange={setEvents}
      eventTypes={[{ id: "meet", label: "Meeting" }]}
      timeZone="UTC"
      weekStartsOn={1}
      locale="en"
    />
  );
};`,
  },
  {
    id: "event-list",
    title: "Event List",
    description: "Compact upcoming events with status badges and locale-aware times.",
    category: "dashboard",
    catalogUrl: catalog("event-list"),
    files: [componentFile("event-list", "event-list.tsx"), sectionCard],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Badge", "Card", "Empty"],
    tags: ["dashboard", "events"],
    features: ["empty-state", "locale-timezone", "status-badges"],
    preview: { height: 560, fullWidth: true },
    props: [
      {
        name: "events",
        type: "EventListItem[]",
        description: "Typed events with status and start time.",
      },
      { name: "locale", type: "string", description: "Intl locale for day and time labels." },
      { name: "timeZone", type: "string", description: "IANA time zone for formatting." },
    ],
    usage: usage("event-list", "EventList"),
  },
  {
    id: "kanban-board",
    title: "Kanban Board",
    description:
      "Controlled columns with a pure reducer for move, reorder, add, update, and filter. Board/list toggle, search, priority/assignee filters, collapsible columns, task sheet, and add-task dialog. Custom pointer/touch plus equivalent keyboard DnD (Space/Enter lift, arrows move, Escape cancel). A live region announces moves. No database or API in the block.",
    category: "dashboard",
    catalogUrl: catalog("kanban-board"),
    files: [
      componentFile("kanban-board", "kanban-board.tsx"),
      support("src/dashboard/kanban-board/types.ts", "components/types.ts"),
      support("src/dashboard/kanban-board/kanban-machine.ts", "components/kanban-machine.ts"),
      support("src/dashboard/kanban-board/use-kanban.ts", "components/use-kanban.ts"),
    ],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Button", "Dialog", "Empty", "Input", "Sheet", "ToggleGroup"],
    tags: ["dashboard", "kanban", "dnd"],
    features: [
      "controlled-columns",
      "pure-reducer",
      "keyboard-dnd",
      "live-region",
      "empty-loading-error",
    ],
    preview: { height: 720, fullWidth: true },
    props: [
      {
        name: "columns",
        type: "Column[]",
        description: "Source of truth. Each column holds Task[]. No product defaults.",
      },
      {
        name: "onColumnsChange",
        type: "(columns: Column[]) => void",
        description: "Emitted after every reducer action. Consumer persists.",
      },
      {
        name: "assignees",
        type: "Assignee[]",
        description: "Lookup for assigneeId on tasks.",
      },
      {
        name: "view",
        type: '"board" | "list"',
        description: "Optional controlled view mode.",
      },
      {
        name: "filter",
        type: "KanbanFilter",
        description: "Optional controlled query, priority, and assignee filters.",
      },
      { name: "readOnly", type: "boolean", description: "Disables drag, add, and edits." },
      {
        name: "status",
        type: '"ready" | "loading" | "error"',
        description: "Loading skeleton or error alert.",
      },
    ],
    usage: `import { KanbanBoard, kanbanReducer } from "@kamod-ch/blocks/dashboard/kanban-board";
import { useState } from "preact/hooks";

export const Example = () => {
  const [columns, setColumns] = useState([
    { id: "todo", title: "To do", tasks: [{ id: "t1", title: "Draft API", priority: "high" }] },
    { id: "done", title: "Done", tasks: [] },
  ]);
  return (
    <KanbanBoard
      columns={columns}
      onColumnsChange={setColumns}
      assignees={[{ id: "ada", name: "Ada Lovelace" }]}
    />
  );
};

// Headless: setColumns(kanbanReducer(columns, { type: "move-task", taskId: "t1", toColumnId: "done", toIndex: 0 }));
`,
  },
  {
    id: "metrics-grid",
    title: "Metrics Grid",
    description:
      "KPI tiles with pie or bar spark charts. The grid stays a single column from 320px and each tile includes a hidden data table.",
    category: "dashboard",
    catalogUrl: catalog("metrics-grid"),
    files: [componentFile("metrics-grid", "metrics-grid.tsx"), chartMath, chartSvg],
    dependencies: ["@kamod-ch/ui", "preact"],
    uiComponents: ["Card"],
    tags: ["dashboard", "charts", "kpi"],
    features: ["readable-320", "keyboard-tooltips", "ssr-svg", "data-table"],
    preview: { height: 720, fullWidth: true },
    props: [
      {
        name: "metrics",
        type: "MetricCard[]",
        description: "Headline value plus pie or bar slices.",
      },
      { name: "locale", type: "string", description: "Intl locale for counts and percents." },
    ],
    usage: `import { MetricsGrid } from "@kamod-ch/blocks/dashboard/metrics-grid";

export const Example = () => (
  <MetricsGrid
    metrics={[
      {
        id: "uptime",
        label: "Uptime",
        value: 0.998,
        unit: "percent",
        chart: "pie",
        slices: [
          { id: "ok", label: "Healthy", value: 99.8 },
          { id: "degraded", label: "Degraded", value: 0.2 },
        ],
      },
    ]}
  />
);`,
  },
  {
    id: "notifications-popover",
    title: "Notifications Popover",
    description:
      "Bell trigger with All/Unread filters, dismiss, and mark-all-read. Items stay owned by the consumer.",
    category: "dashboard",
    catalogUrl: catalog("notifications-popover"),
    files: [componentFile("notifications-popover", "notifications-popover.tsx")],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Badge", "Button", "Empty", "Popover", "Tabs"],
    tags: ["dashboard", "notifications"],
    features: ["controlled-items", "unread-filter", "trigger-slot", "mobile-width"],
    preview: { height: 420, fullWidth: true },
    props: [
      { name: "items", type: "NotificationItem[]", description: "Controlled notification list." },
      { name: "onDismiss", type: "(id: string) => void", description: "Dismiss callback." },
      { name: "onMarkAllRead", type: "() => void", description: "Mark-all-read callback." },
      {
        name: "trigger",
        type: "ComponentChildren | render prop",
        description: "Custom trigger or render function.",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Open-change callback.",
      },
    ],
    usage: usage("notifications-popover", "NotificationsPopover"),
  },
  {
    id: "profile-menu",
    title: "Profile Menu",
    description:
      "Account dropdown with typed item keys. Logout is a callback, never executed internally.",
    category: "dashboard",
    catalogUrl: catalog("profile-menu"),
    files: [componentFile("profile-menu", "profile-menu.tsx")],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Avatar", "Dropdown"],
    tags: ["dashboard", "profile"],
    features: ["typed-keys", "trigger-slot", "no-internal-logout"],
    preview: { height: 360, fullWidth: true },
    props: [
      { name: "user", type: "ProfileMenuUser", description: "Name, email, and optional avatar." },
      {
        name: "items",
        type: "ProfileMenuItem[]",
        description: "Menu rows with keys passed to onSelect.",
      },
      {
        name: "onSelect",
        type: "(key: string) => void",
        description: "Item activation, including logout.",
      },
      {
        name: "trigger",
        type: "ComponentChildren",
        description: "Replace the default avatar trigger.",
      },
    ],
    usage: usage("profile-menu", "ProfileMenu"),
  },
  {
    id: "progress-breakdown",
    title: "Progress Breakdown",
    description: "Labeled progress bars with clamped values and progressbar ARIA.",
    category: "dashboard",
    catalogUrl: catalog("progress-breakdown"),
    files: [componentFile("progress-breakdown", "progress-breakdown.tsx"), sectionCard],
    dependencies: ["@kamod-ch/ui", "preact"],
    uiComponents: ["Card", "Progress"],
    tags: ["dashboard", "progress"],
    features: ["clamped-values", "visible-labels", "progressbar-aria"],
    preview: { height: 520, fullWidth: true },
    props: [
      {
        name: "items",
        type: "ProgressBreakdownItem[]",
        description: "Label, value, optional max and hint.",
      },
    ],
    usage: usage("progress-breakdown", "ProgressBreakdown"),
  },
  {
    id: "quick-actions",
    title: "Quick Actions",
    description: "Vertical shortcuts with router-neutral links, buttons, and disabled states.",
    category: "dashboard",
    catalogUrl: catalog("quick-actions"),
    files: [componentFile("quick-actions", "quick-actions.tsx"), sectionCard],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Card", "Item"],
    tags: ["dashboard", "actions"],
    features: ["link-adapter", "disabled-state", "icon-semantics"],
    preview: { height: 560, fullWidth: true },
    props: [
      { name: "actions", type: "QuickAction[]", description: "Href or onSelect shortcuts." },
      {
        name: "linkComponent",
        type: "BlockLinkComponent",
        description: "Router-neutral link adapter.",
      },
    ],
    usage: usage("quick-actions", "QuickActions"),
  },
  {
    id: "theme-customize",
    title: "Theme Customize",
    description:
      "Popover for scheme, Kamod preset, and radius. Uses the Kamod theme API (no next-themes). Changes apply to a local scope by default; persistence and clipboard copy run only after user action.",
    category: "dashboard",
    catalogUrl: catalog("theme-customize"),
    files: [componentFile("theme-customize", "theme-customize.tsx")],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/themes", "@kamod-ch/icons", "preact"],
    uiComponents: ["Button", "Label", "Popover", "Slider", "ToggleGroup"],
    tags: ["dashboard", "theme"],
    features: ["controlled-scheme", "optional-persist", "system-listener", "clipboard-on-action"],
    preview: { height: 360, fullWidth: true },
    props: [
      { name: "scheme", type: "ColorScheme", description: "Controlled light/dark/system." },
      { name: "preset", type: "ThemePresetId", description: "Controlled Kamod brand preset." },
      { name: "radius", type: "number", description: "Controlled --radius in rem." },
      {
        name: "persist",
        type: "boolean",
        description: "Write scheme, preset, and radius to storage. Defaults to false.",
      },
      {
        name: "target",
        type: "HTMLElement | string",
        description: "Scope for tokens. Defaults to this block's root.",
      },
    ],
    usage: `import { ThemeCustomize } from "@kamod-ch/blocks/dashboard/theme-customize";

export const Example = () => (
  <ThemeCustomize persist defaultScheme="system" defaultPreset="kamod" />
);`,
  },
  {
    id: "toggle-setting-list",
    title: "Toggle Setting List",
    description: "Boolean settings with unique labels, descriptions, and a Record value contract.",
    category: "dashboard",
    catalogUrl: catalog("toggle-setting-list"),
    files: [componentFile("toggle-setting-list", "toggle-setting-list.tsx"), sectionCard],
    dependencies: ["@kamod-ch/ui", "preact"],
    uiComponents: ["Card", "Label", "Switch"],
    tags: ["dashboard", "settings"],
    features: ["controlled-value", "unique-labels", "descriptions"],
    preview: { height: 560, fullWidth: true },
    props: [
      {
        name: "settings",
        type: "ToggleSetting[]",
        description: "Labeled switches with optional descriptions.",
      },
      {
        name: "value",
        type: "Record<string, boolean>",
        description: "Controlled map of setting id to checked.",
      },
      {
        name: "onValueChange",
        type: "(value: Record<string, boolean>) => void",
        description: "Emits the full map after each toggle.",
      },
    ],
    usage: usage("toggle-setting-list", "ToggleSettingList"),
  },
];

export const dashboardBlocks: DashboardBlockDefinition[] = definitions.map((block) => ({
  ...block,
  source: "uipkge",
  component: components[block.id],
  installCommand: `@kamod-ch/blocks/dashboard/${block.id}`,
}));

export const dashboardBlocksById = dashboardBlocks.reduce(
  (acc, block) => {
    acc[block.id] = block;
    return acc;
  },
  {} as Record<DashboardBlockId, DashboardBlockDefinition>,
);
