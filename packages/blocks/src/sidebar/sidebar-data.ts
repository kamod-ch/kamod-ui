import type { ComponentType } from "preact";

export type SidebarBlockFeature =
  | "collapsible"
  | "submenus"
  | "floating"
  | "dropdowns"
  | "icon-mode"
  | "inset"
  | "nested"
  | "popover"
  | "file-tree"
  | "calendar"
  | "dialog"
  | "right"
  | "dual"
  | "sticky-header"
  | "mobile";

export type SidebarBlockId =
  | "sidebar-01"
  | "sidebar-02"
  | "sidebar-03"
  | "sidebar-04"
  | "sidebar-05"
  | "sidebar-06"
  | "sidebar-07"
  | "sidebar-08"
  | "sidebar-09"
  | "sidebar-10"
  | "sidebar-11"
  | "sidebar-12"
  | "sidebar-13"
  | "sidebar-14"
  | "sidebar-15"
  | "sidebar-16";

export type BlockFile = {
  path: string;
  label: string;
  kind: "component" | "support" | "registry" | "page";
};

export type BlockDefinition = {
  id: SidebarBlockId;
  title: string;
  description: string;
  category: "sidebar";
  component: ComponentType;
  files: BlockFile[];
  dependencies: string[];
  uiComponents: string[];
  tags: string[];
  features: SidebarBlockFeature[];
  preview: { height: number; fullWidth: boolean };
  installCommand: string;
};

export type SidebarBlockVariant = {
  id: SidebarBlockId;
  title: string;
  description: string;
  eyebrow: string;
  features: SidebarBlockFeature[];
  floating?: boolean;
  dropdowns?: boolean;
  iconMode?: boolean;
  inset?: boolean;
  nested?: boolean;
  popover?: boolean;
  fileTree?: boolean;
  calendar?: boolean;
  dialog?: boolean;
  right?: boolean;
  dual?: boolean;
  stickyHeader?: boolean;
  collapsible?: boolean;
  submenus?: boolean;
};

export const sidebarVariants: SidebarBlockVariant[] = [
  {
    id: "sidebar-01",
    title: "sidebar-01",
    eyebrow: "A simple sidebar with navigation grouped by section",
    description: "A simple sidebar with navigation grouped by section.",
    features: ["mobile"],
  },
  {
    id: "sidebar-02",
    title: "sidebar-02",
    eyebrow: "A sidebar with collapsible sections",
    description: "A sidebar with collapsible sections.",
    features: ["collapsible", "mobile"],
    collapsible: true,
  },
  {
    id: "sidebar-03",
    title: "sidebar-03",
    eyebrow: "A sidebar with submenus",
    description: "A sidebar with submenus.",
    features: ["submenus", "mobile"],
    submenus: true,
  },
  {
    id: "sidebar-04",
    title: "sidebar-04",
    eyebrow: "A floating sidebar with submenus",
    description: "A floating sidebar with submenus.",
    features: ["floating", "submenus", "mobile"],
    floating: true,
    submenus: true,
  },
  {
    id: "sidebar-05",
    title: "sidebar-05",
    eyebrow: "A sidebar with collapsible submenus",
    description: "A sidebar with collapsible submenus.",
    features: ["collapsible", "submenus", "mobile"],
    collapsible: true,
    submenus: true,
  },
  {
    id: "sidebar-06",
    title: "sidebar-06",
    eyebrow: "A sidebar with submenus as dropdowns",
    description: "A sidebar with submenus as dropdowns.",
    features: ["dropdowns", "mobile"],
    dropdowns: true,
  },
  {
    id: "sidebar-07",
    title: "sidebar-07",
    eyebrow: "A sidebar that collapses to icons",
    description: "A sidebar that collapses to icons.",
    features: ["icon-mode", "mobile"],
    iconMode: true,
  },
  {
    id: "sidebar-08",
    title: "sidebar-08",
    eyebrow: "An inset sidebar with secondary navigation",
    description: "An inset sidebar with secondary navigation.",
    features: ["inset", "mobile"],
    inset: true,
  },
  {
    id: "sidebar-09",
    title: "sidebar-09",
    eyebrow: "Collapsible nested sidebars",
    description: "Collapsible nested sidebars.",
    features: ["nested", "collapsible", "mobile"],
    nested: true,
    collapsible: true,
  },
  {
    id: "sidebar-10",
    title: "sidebar-10",
    eyebrow: "A sidebar in a popover",
    description: "A sidebar in a popover.",
    features: ["popover", "mobile"],
    popover: true,
  },
  {
    id: "sidebar-11",
    title: "sidebar-11",
    eyebrow: "A sidebar with a collapsible file tree",
    description: "A sidebar with a collapsible file tree.",
    features: ["file-tree", "collapsible", "mobile"],
    fileTree: true,
    collapsible: true,
  },
  {
    id: "sidebar-12",
    title: "sidebar-12",
    eyebrow: "A sidebar with a calendar",
    description: "A sidebar with a calendar.",
    features: ["calendar", "mobile"],
    calendar: true,
  },
  {
    id: "sidebar-13",
    title: "sidebar-13",
    eyebrow: "A sidebar in a dialog",
    description: "A sidebar in a dialog.",
    features: ["dialog", "mobile"],
    dialog: true,
  },
  {
    id: "sidebar-14",
    title: "sidebar-14",
    eyebrow: "A sidebar on the right",
    description: "A sidebar on the right.",
    features: ["right", "mobile"],
    right: true,
  },
  {
    id: "sidebar-15",
    title: "sidebar-15",
    eyebrow: "A left and right sidebar",
    description: "A left and right sidebar.",
    features: ["dual", "right", "mobile"],
    dual: true,
  },
  {
    id: "sidebar-16",
    title: "sidebar-16",
    eyebrow: "A sidebar with a sticky site header",
    description: "A sidebar with a sticky site header.",
    features: ["sticky-header", "mobile"],
    stickyHeader: true,
  },
];
