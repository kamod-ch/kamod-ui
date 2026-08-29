import type { CatalogBlockDefinition, CatalogBlockFile } from "../shared";
import { AppSidebar01Preview } from "./sidebar-01";
import { AppSidebar02Preview } from "./sidebar-02";
import { AppSidebar03Preview } from "./sidebar-03";
import { AppSidebar04Preview } from "./sidebar-04";
import { AppSidebar05Preview } from "./sidebar-05";
import { AppSidebar06Preview } from "./sidebar-06";
import { AppSidebar07Preview } from "./sidebar-07";

export type AppSidebarBlockId =
  | "sidebar-01"
  | "sidebar-02"
  | "sidebar-03"
  | "sidebar-04"
  | "sidebar-05"
  | "sidebar-06"
  | "sidebar-07";

export type AppSidebarBlockDefinition = CatalogBlockDefinition<AppSidebarBlockId> & {
  props: { name: string; type: string; description: string }[];
  usage: string;
};

const catalog = (id: AppSidebarBlockId) => `https://uipkge.dev/react/blocks/${id}`;

const componentFile = (id: AppSidebarBlockId, fileName: string): CatalogBlockFile => ({
  path: `src/app-sidebar/${id}/${fileName}`,
  label: `components/${fileName}`,
  kind: "component",
});

const support = (path: string, label: string): CatalogBlockFile => ({
  path,
  label,
  kind: "support",
});

const usage = (id: AppSidebarBlockId, name: string) =>
  `import { ${name} } from "@kamod-ch/blocks/app-sidebar/${id}";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@kamod-ch/ui";

export const Example = () => (
  <SidebarProvider>
    <${name} />
    <SidebarInset>
      <header class="flex h-14 items-center px-4">
        <SidebarTrigger />
      </header>
    </SidebarInset>
  </SidebarProvider>
);`;

const sharedFiles = [
  support("src/app-sidebar/shared/types.ts", "components/types.ts"),
  support("src/app-sidebar/shared/nav-user.tsx", "components/nav-user.tsx"),
];

const components = {
  "sidebar-01": AppSidebar01Preview,
  "sidebar-02": AppSidebar02Preview,
  "sidebar-03": AppSidebar03Preview,
  "sidebar-04": AppSidebar04Preview,
  "sidebar-05": AppSidebar05Preview,
  "sidebar-06": AppSidebar06Preview,
  "sidebar-07": AppSidebar07Preview,
} satisfies Record<AppSidebarBlockId, AppSidebarBlockDefinition["component"]>;

const definitions: Omit<AppSidebarBlockDefinition, "component" | "installCommand" | "source">[] = [
  {
    id: "sidebar-01",
    title: "App Sidebar 01",
    description: "Collapsible icon-rail app sidebar with brand, grouped nav, and a user footer.",
    category: "app-sidebar",
    catalogUrl: catalog("sidebar-01"),
    files: [componentFile("sidebar-01", "sidebar-01.tsx"), ...sharedFiles],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Sidebar", "SidebarProvider", "Dropdown", "Avatar"],
    tags: ["sidebar", "app"],
    features: ["icon-rail", "user-footer", "router-neutral"],
    preview: { height: 720, fullWidth: true },
    props: [
      {
        name: "activeHref",
        type: "string",
        description: "Marks the matching nav href as current.",
      },
      {
        name: "onNavigate",
        type: "(item) => void",
        description: "Fired when a nav item is activated.",
      },
      {
        name: "onUserSelect",
        type: "(key: string) => void",
        description: "Account menu key, including logout.",
      },
    ],
    usage: usage("sidebar-01", "AppSidebar01"),
  },
  {
    id: "sidebar-02",
    title: "App Sidebar 02",
    description:
      "Team switcher, primary nav, projects, secondary nav, and user footer as sibling files.",
    category: "app-sidebar",
    catalogUrl: catalog("sidebar-02"),
    files: [
      componentFile("sidebar-02", "sidebar-02.tsx"),
      componentFile("sidebar-02", "team-switcher.tsx"),
      componentFile("sidebar-02", "nav-main.tsx"),
      componentFile("sidebar-02", "nav-projects.tsx"),
      componentFile("sidebar-02", "nav-secondary.tsx"),
      ...sharedFiles,
    ],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Sidebar", "Collapsible", "Dropdown"],
    tags: ["sidebar", "teams"],
    features: ["team-switcher", "collapsible-nav", "projects"],
    preview: { height: 720, fullWidth: true },
    props: [
      { name: "teams", type: "AppTeam[]", description: "Workspace teams for the header switcher." },
      {
        name: "onTeamChange",
        type: "(id: string) => void",
        description: "Team selection callback.",
      },
      { name: "activeHref", type: "string", description: "Active route without Next hooks." },
    ],
    usage: usage("sidebar-02", "AppSidebar02"),
  },
  {
    id: "sidebar-03",
    title: "App Sidebar 03",
    description: "Docs sidebar with version switcher, search, and collapsible groups.",
    category: "app-sidebar",
    catalogUrl: catalog("sidebar-03"),
    files: [componentFile("sidebar-03", "sidebar-03.tsx"), ...sharedFiles],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Sidebar", "Collapsible", "Dropdown", "SidebarInput"],
    tags: ["sidebar", "docs"],
    features: ["search", "collapsible-groups", "version-switcher"],
    preview: { height: 720, fullWidth: true },
    props: [
      { name: "groups", type: "AppNavGroup[]", description: "Collapsible documentation sections." },
      { name: "searchValue", type: "string", description: "Controlled search query." },
      { name: "activeHref", type: "string", description: "Active docs route." },
    ],
    usage: usage("sidebar-03", "AppSidebar03"),
  },
  {
    id: "sidebar-04",
    title: "App Sidebar 04",
    description: "Floating sidebar with rounded corners and nested SidebarMenuSub routes.",
    category: "app-sidebar",
    catalogUrl: catalog("sidebar-04"),
    files: [componentFile("sidebar-04", "sidebar-04.tsx"), ...sharedFiles],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Sidebar", "SidebarMenuSub"],
    tags: ["sidebar", "floating"],
    features: ["floating", "subnavigation"],
    preview: { height: 720, fullWidth: true },
    props: [
      {
        name: "nav",
        type: "AppNavItem[]",
        description: "Primary items with optional nested routes.",
      },
      { name: "activeHref", type: "string", description: "Active nested route." },
    ],
    usage: usage("sidebar-04", "AppSidebar04"),
  },
  {
    id: "sidebar-05",
    title: "App Sidebar 05",
    description:
      "Dual-rail sidebar. Collapse keeps the icon rail; mobile Sheet shows rail plus panel. Width vars go on SidebarProvider.",
    category: "app-sidebar",
    catalogUrl: catalog("sidebar-05"),
    files: [
      componentFile("sidebar-05", "sidebar-05.tsx"),
      support("src/app-sidebar/shared/width-style.ts", "components/width-style.ts"),
    ],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Sidebar", "Tooltip", "SidebarInput"],
    tags: ["sidebar", "dual-rail"],
    features: ["dual-rail", "css-vars", "mobile-full"],
    preview: { height: 720, fullWidth: true },
    props: [
      { name: "rail", type: "DualRailId", description: "Controlled active rail section." },
      {
        name: "onRailChange",
        type: "(id: DualRailId) => void",
        description: "Rail selection callback.",
      },
    ],
    usage: usage("sidebar-05", "AppSidebar05"),
  },
  {
    id: "sidebar-06",
    title: "App Sidebar 06",
    description:
      "Colorful project tiles, controlled favorites, team status, and a Cmd/Ctrl+F search shortcut.",
    category: "app-sidebar",
    catalogUrl: catalog("sidebar-06"),
    files: [componentFile("sidebar-06", "sidebar-06.tsx"), ...sharedFiles],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Sidebar", "Avatar", "SidebarInput"],
    tags: ["sidebar", "favorites"],
    features: ["controlled-favorites", "search-shortcut"],
    preview: { height: 720, fullWidth: true },
    props: [
      { name: "favoriteIds", type: "string[]", description: "Controlled favorite project ids." },
      {
        name: "onFavoriteChange",
        type: "(ids: string[]) => void",
        description: "Favorite map callback.",
      },
      {
        name: "searchShortcut",
        type: "boolean",
        description: "Register Cmd/Ctrl+F when no input is focused.",
      },
    ],
    usage: usage("sidebar-06", "AppSidebar06"),
  },
  {
    id: "sidebar-07",
    title: "App Sidebar 07",
    description: "Workspace pill, grouped nav with badges, and an accessible icon action toolbar.",
    category: "app-sidebar",
    catalogUrl: catalog("sidebar-07"),
    files: [componentFile("sidebar-07", "sidebar-07.tsx"), ...sharedFiles],
    dependencies: ["@kamod-ch/ui", "@kamod-ch/icons", "preact"],
    uiComponents: ["Sidebar", "SidebarMenuBadge", "Tooltip"],
    tags: ["sidebar", "toolbar"],
    features: ["action-toolbar", "badges", "command-shortcut"],
    preview: { height: 720, fullWidth: true },
    props: [
      {
        name: "onAction",
        type: "(action) => void",
        description: "Toolbar actions including logout and command.",
      },
      {
        name: "groups",
        type: "AppNavGroup[]",
        description: "Labeled nav sections with optional badges.",
      },
    ],
    usage: usage("sidebar-07", "AppSidebar07"),
  },
];

export const appSidebarBlocks: AppSidebarBlockDefinition[] = definitions.map((block) => ({
  ...block,
  source: "uipkge",
  component: components[block.id],
  installCommand: `@kamod-ch/blocks/app-sidebar/${block.id}`,
}));

export const appSidebarBlocksById = appSidebarBlocks.reduce(
  (acc, block) => {
    acc[block.id] = block;
    return acc;
  },
  {} as Record<AppSidebarBlockId, AppSidebarBlockDefinition>,
);
