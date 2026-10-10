import type { SidebarBlockId } from "../../../../blocks/src/sidebar/sidebar-data";

/** Small source excerpts, not standalone components: names resolve in each variant's composition. */
export const sidebarAboutExamples = {
  "sidebar-01": {
    code: "<NavDocs groups={docsNavData.navMain} />",
    note: "Start with the grouped data: each visible section gives readers context without an extra disclosure step. Replace the fixture URLs and active flags together.",
  },
  "sidebar-02": {
    code: "<NavDocs groups={docsNavData.navMain} collapsibleSections />",
    note: "This one prop changes group presentation. It does not make disclosures exclusive or synchronize them with later route changes; that behavior belongs in the copied NavDocs helper.",
  },
  "sidebar-03": {
    code: "<NavMain items={navigationItems} collapsible={false} />",
    note: "Keep the full hierarchy visible when destinations fit comfortably. Supply concise parent labels and let the child links describe the actual pages.",
  },
  "sidebar-04": {
    code: '<SidebarProvider style={{ "--sidebar-width": "19rem" }}>\n  <Sidebar variant="floating">',
    note: "Opening tags from the composition: the provider sets desktop width, while floating changes the surface. Try your longest labels and narrowest useful content width before changing either.",
  },
  "sidebar-05": {
    code: "<NavMain items={navigationItems} collapsible={true} />",
    note: "Expansion and navigation are separate jobs. In this helper, a parent with children opens a branch; put a destination inside that branch if it also needs an overview page.",
  },
  "sidebar-06": {
    code: "<NavMainDropdowns items={navigationItems} />\n<SidebarOptInForm />",
    note: "These neighboring helpers have independent responsibilities. Connect the menu destinations first, then decide whether the optional preference card belongs in your product at all.",
  },
  "sidebar-07": {
    code: '<Sidebar collapsible="icon">',
    note: "The opening tag selects desktop icon collapse. Preserve names and tooltips, and check every nested destination from the compact rail before changing widths.",
  },
  "sidebar-08": {
    code: '<Sidebar variant="inset">',
    note: "This surface choice works with SidebarInset. Put real content in the existing workspace and check its gutters before adding another card or padded wrapper.",
  },
  "sidebar-09": {
    code: 'const [activeItem, setActiveItem] = useState("Inbox");',
    note: "The current state selects a category label, not a message. Add separate selected-record state when connecting the list to real content, and provide a mobile route to that list.",
  },
  "sidebar-10": {
    code: "<NavActions />",
    note: "The header calls this helper without a service callback. Edit the copied helper to connect commands to the current document; adding an unsupported onDelete prop to the page wrapper will not wire deletion.",
  },
  "sidebar-11": {
    code: "const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({ app: true });",
    note: "Expansion is keyed by folder name in this example. Switch to stable full-path IDs if your application allows identically named folders in different locations.",
  },
  "sidebar-12": {
    code: "onSelect={(next) => {\n  if (next instanceof Date) setDate(next);\n}}",
    note: "This Calendar prop accepts only actual dates into local selection state. Derive the workspace heading and query from that selection if the main page should follow it; the current month heading is a static fixture.",
  },
  "sidebar-13": {
    code: '<Sidebar collapsible="none" class="hidden md:flex">',
    note: "The settings list is hidden below the medium breakpoint. Add a reachable compact selector inside the dialog before relying on more than one settings area on mobile.",
  },
  "sidebar-14": {
    code: '<Sidebar side="right">',
    note: "The position changes, but the same navigation data and core mobile behavior remain. Keep the trigger discoverable near the right edge and test actual keyboard order.",
  },
  "sidebar-15": {
    code: '<Sidebar side="right" collapsible="none" class="sticky top-0 hidden h-svh border-l md:flex">',
    note: "This is a static utility pane, not a second panel opened by the navigation toggle. Give essential date-related tasks a mobile entry point in your page content.",
  },
  "sidebar-16": {
    code: '<Sidebar class="top-(--header-height) h-[calc(100svh-var(--header-height))]!">',
    note: "Both position and available height depend on the same header variable. Change that shared measurement when changing the site header; do not patch the two values independently.",
  },
} satisfies Record<SidebarBlockId, { code: string; note: string }>;
