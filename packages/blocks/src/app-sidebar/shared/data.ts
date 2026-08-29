import {
  BookOpenIcon,
  BotIcon,
  BriefcaseIcon,
  ChartPieIcon,
  FileTextIcon,
  FolderIcon,
  FrameIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  MapIcon,
  SendIcon,
  Settings2Icon,
  SquareTerminalIcon,
  TableIcon,
} from "@kamod-ch/icons/lucide";
import type { AppNavGroup, AppNavItem, AppProject, AppTeam, AppUser, AppWorkspace } from "./types";

export const defaultUser: AppUser = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  initials: "AL",
};

export const defaultWorkspace: AppWorkspace = {
  name: "Kamod",
  hint: "kamod.ch",
};

export const defaultTeams: AppTeam[] = [
  { id: "kamod", name: "Kamod GmbH", plan: "Enterprise", initials: "K" },
  { id: "acme", name: "Acme Corp.", plan: "Startup", initials: "A" },
  { id: "studio", name: "Studio North", plan: "Free", initials: "S" },
];

export const workspaceGroups: AppNavGroup[] = [
  {
    id: "workspace",
    label: "Workspace",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboardIcon,
        isActive: true,
      },
      { id: "tables", label: "Data tables", href: "/tables", icon: TableIcon },
      { id: "forms", label: "Forms", href: "/forms", icon: FileTextIcon },
      { id: "pages", label: "Pages", href: "/pages", icon: FileTextIcon },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    items: [
      { id: "docs", label: "Docs", href: "/docs", icon: BookOpenIcon },
      { id: "changelog", label: "Changelog", href: "/changelog", icon: FileTextIcon },
    ],
  },
];

export const platformNav: AppNavItem[] = [
  {
    id: "playground",
    label: "Playground",
    href: "/playground",
    icon: SquareTerminalIcon,
    isActive: true,
    items: [
      { id: "history", label: "History", href: "/playground/history" },
      { id: "starred", label: "Starred", href: "/playground/starred" },
      { id: "settings", label: "Settings", href: "/playground/settings" },
    ],
  },
  {
    id: "models",
    label: "Models",
    href: "/models",
    icon: BotIcon,
    items: [
      { id: "genesis", label: "Genesis", href: "/models/genesis" },
      { id: "explorer", label: "Explorer", href: "/models/explorer" },
    ],
  },
  {
    id: "docs",
    label: "Documentation",
    href: "/documentation",
    icon: BookOpenIcon,
    items: [
      { id: "introduction", label: "Introduction", href: "/documentation/intro" },
      { id: "get-started", label: "Get Started", href: "/documentation/start" },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: Settings2Icon,
    items: [
      { id: "general", label: "General", href: "/settings/general" },
      { id: "team", label: "Team", href: "/settings/team" },
    ],
  },
];

export const secondaryNav: AppNavItem[] = [
  { id: "support", label: "Support", href: "/support", icon: LifeBuoyIcon },
  { id: "feedback", label: "Feedback", href: "/feedback", icon: SendIcon },
];

export const defaultProjects: AppProject[] = [
  {
    id: "design",
    name: "Design Engineering",
    href: "/projects/design",
    colorClass: "bg-chart-1",
    favorite: true,
  },
  {
    id: "sales",
    name: "Sales & Marketing",
    href: "/projects/sales",
    colorClass: "bg-chart-2",
    favorite: true,
  },
  { id: "travel", name: "Travel", href: "/projects/travel", colorClass: "bg-chart-3" },
  { id: "support", name: "Support", href: "/projects/support", colorClass: "bg-chart-4" },
];

export const docsNavGroups: AppNavGroup[] = [
  {
    id: "getting-started",
    label: "Getting Started",
    items: [
      { id: "installation", label: "Installation", href: "/docs/installation" },
      { id: "structure", label: "Project Structure", href: "/docs/structure" },
    ],
  },
  {
    id: "build",
    label: "Build Your Application",
    items: [
      { id: "routing", label: "Routing", href: "/docs/routing" },
      { id: "data", label: "Data Fetching", href: "/docs/data", isActive: true },
      { id: "rendering", label: "Rendering", href: "/docs/rendering" },
      { id: "styling", label: "Styling", href: "/docs/styling" },
    ],
  },
  {
    id: "api",
    label: "API Reference",
    items: [
      { id: "components", label: "Components", href: "/docs/components" },
      { id: "cli", label: "CLI", href: "/docs/cli" },
    ],
  },
];

export const docsVersions = ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"];

export const floatingNav: AppNavItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/app",
    icon: FrameIcon,
    isActive: true,
    items: [
      { id: "overview", label: "Overview", href: "/app/overview" },
      { id: "activity", label: "Activity", href: "/app/activity" },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    href: "/app/projects",
    icon: MapIcon,
    items: [
      { id: "all", label: "All projects", href: "/app/projects/all" },
      { id: "archived", label: "Archived", href: "/app/projects/archived" },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    href: "/app/analytics",
    icon: ChartPieIcon,
    items: [
      { id: "reports", label: "Reports", href: "/app/analytics/reports" },
      { id: "live", label: "Live", href: "/app/analytics/live" },
    ],
  },
];

export const groupedNav: AppNavGroup[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    items: [
      {
        id: "overview",
        label: "Overview",
        href: "/overview",
        icon: LayoutDashboardIcon,
        isActive: true,
        badge: "12",
      },
      { id: "clients", label: "Clients", href: "/clients", icon: BriefcaseIcon },
      { id: "files", label: "Files", href: "/files", icon: FolderIcon },
    ],
  },
  {
    id: "management",
    label: "Management",
    items: [
      { id: "team", label: "Team", href: "/team", icon: BotIcon, badge: "3" },
      { id: "settings", label: "Settings", href: "/settings", icon: Settings2Icon },
    ],
  },
  {
    id: "content",
    label: "Content",
    items: [
      { id: "docs", label: "Docs", href: "/content/docs", icon: BookOpenIcon },
      { id: "pages", label: "Pages", href: "/content/pages", icon: FileTextIcon },
    ],
  },
];
