export type MotionComponentEntry = {
  slug: string;
  navLabel: string;
  title: string;
  coreSlug: string;
  coreTitle: string;
  packagePath: string;
  replaces: string;
  summary: string;
};

export const motionComponentEntries: MotionComponentEntry[] = [
  {
    slug: "motion-dialog",
    navLabel: "Dialog",
    title: "Motion Dialog",
    coreSlug: "dialog",
    coreTitle: "Dialog",
    packagePath: "@kamod-ch/ui-motion/dialog",
    replaces: "DialogContent",
    summary: "Portal, overlay, and content with Presence-managed enter/exit.",
  },
  {
    slug: "motion-sheet",
    navLabel: "Sheet",
    title: "Motion Sheet",
    coreSlug: "sheet",
    coreTitle: "Sheet",
    packagePath: "@kamod-ch/ui-motion/sheet",
    replaces: "SheetContent",
    summary: "Edge panel and overlay animate together from any side.",
  },
  {
    slug: "motion-alert-dialog",
    navLabel: "Alert Dialog",
    title: "Motion Alert Dialog",
    coreSlug: "alert-dialog",
    coreTitle: "Alert Dialog",
    packagePath: "@kamod-ch/ui-motion/alert-dialog",
    replaces: "AlertDialogContent",
    summary: "Centered viewport with scale enter/exit on the panel.",
  },
  {
    slug: "motion-accordion",
    navLabel: "Accordion",
    title: "Motion Accordion",
    coreSlug: "accordion",
    coreTitle: "Accordion",
    packagePath: "@kamod-ch/ui-motion/accordion",
    replaces: "AccordionContent",
    summary: "Slide-up motion instead of CSS height transitions.",
  },
  {
    slug: "motion-collapsible",
    navLabel: "Collapsible",
    title: "Motion Collapsible",
    coreSlug: "collapsible",
    coreTitle: "Collapsible",
    packagePath: "@kamod-ch/ui-motion/collapsible",
    replaces: "CollapsibleContent",
    summary: "Expandable regions with motion presets on open and close.",
  },
  {
    slug: "motion-tabs",
    navLabel: "Tabs",
    title: "Motion Tabs",
    coreSlug: "tabs",
    coreTitle: "Tabs",
    packagePath: "@kamod-ch/ui-motion/tabs",
    replaces: "— (adds MotionTabsIndicator)",
    summary: "Optional sliding highlight for the active tab trigger.",
  },
];

export const motionComponentBySlug = Object.fromEntries(
  motionComponentEntries.map((entry) => [entry.slug, entry]),
) as Record<string, MotionComponentEntry>;
