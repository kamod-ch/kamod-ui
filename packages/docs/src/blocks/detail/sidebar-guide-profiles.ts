/** Variant-specific behavior belongs beside the shared guide, not in 16 duplicated pages. */
import type { SidebarBlockId } from "../../../../blocks/src/sidebar/sidebar-data";
export const sidebarGuideProfiles = {
  "sidebar-01": {
    title: "Grouped documentation navigation",
    text: "Documentation links are grouped under section labels, with a version selector and search field above. Update the documentation data in shared/sample-data.ts and connect search and version selection to real destinations. These controls currently demonstrate the layout rather than querying an index.",
    mobile:
      "The desktop sidebar moves off canvas when collapsed. Below 768px, the toggle opens a separate navigation sheet.",
  },
  "sidebar-02": {
    title: "Collapsible navigation groups",
    text: "Each documentation group has its own disclosure, so readers can hide sections they do not need. The page uses a sticky breadcrumb header and a list of placeholder rows. Change collapsibleSections and layout in sidebar-data.ts; group expansion is local UI state, not a saved preference.",
    mobile:
      "Group disclosures remain usable inside the mobile navigation sheet. Keep section labels short enough for the narrower panel.",
  },
  "sidebar-03": {
    title: "Always-visible submenus",
    text: "Application navigation exposes child links beneath their parents without an expansion step. Edit the sample app navigation to match your hierarchy and replace the inner bordered header's breadcrumb data with the current route.",
    mobile:
      "Submenus remain visible inside the mobile sheet. Long navigation lists scroll within the sidebar content area.",
  },
  "sidebar-04": {
    title: "Floating navigation surface",
    text: "A floating, wider sidebar separates navigation from the surrounding page with an inset edge. Its submenus are expanded. The composition still uses off-canvas collapse; floating changes the visual treatment, not the navigation model.",
    mobile:
      "The floating desktop treatment gives way to the core mobile sheet below 768px. Check long submenu labels in both presentations.",
  },
  "sidebar-05": {
    title: "Expandable submenu branches",
    text: "Disclosure triggers reveal child destinations without navigating away. Search sits above the application navigation. Connect leaf links separately from branch expansion and keep any destination attached to a parent clearly distinguishable from its disclosure control.",
    mobile:
      "The same submenu disclosures are available in the mobile sheet. Opening a branch is separate from opening or closing the sheet.",
  },
  "sidebar-06": {
    title: "Dropdown navigation and opt-in card",
    text: "Parent navigation items open dropdown menus rather than inline branches. The navigation area includes a sample newsletter opt-in card. Replace placeholder destinations and connect the form to your subscription service before presenting it as a working signup.",
    mobile:
      "Check menu placement within the mobile sheet and ensure every dropdown item remains reachable by keyboard and touch.",
  },
  "sidebar-07": {
    title: "Desktop icon collapse",
    text: "The sidebar collapses to an icon rail on desktop. Retain meaningful labels and tooltips when replacing the sample icons so destinations remain identifiable in the collapsed state. Expansion is managed by the core SidebarProvider.",
    mobile:
      "Icon collapse applies to desktop. On smaller screens the provider opens the full navigation in a sheet instead.",
  },
  "sidebar-08": {
    title: "Inset workspace and utility links",
    text: "The inset main surface visually separates workspace content from navigation. Secondary links sit beneath the primary application navigation. Replace both sets of sample URLs and render your pages inside DashboardShell instead of its placeholder grid.",
    mobile:
      "The desktop inset arrangement adapts to the sheet-based mobile navigation; keep page content fluid rather than assigning a fixed desktop width.",
  },
  "sidebar-09": {
    title: "Two-level navigation panes",
    text: "An icon rail selects Inbox, Drafts or Sent and updates the adjacent pane’s heading. Its sample message list does not change with that selection, and the message buttons have no actions yet. Connect NestedSidebar’s local selection to real data and message navigation when adapting it.",
    mobile:
      "The secondary pane is hidden below 768px. Add a mobile destination picker or another route to those links if they are essential to your app; the demo does not supply that replacement.",
  },
  "sidebar-10": {
    title: "Favorites and action menus",
    text: "Despite the registry's popover name, the current composition is an icon-collapsible sidebar with favorites and dropdown actions. It does not put the entire sidebar inside a Popover. Adapt NavFavorites and NavActions in the shared folder to connect their destinations and commands.",
    mobile:
      "The main sidebar uses the mobile sheet. Verify the nested action menus independently, especially their dismiss and focus-return behavior.",
  },
  "sidebar-11": {
    title: "Expandable file tree",
    text: "Folder expansion is held in FileTreeSidebar's local openFolders state. The sample app folder starts open. This is a navigation example, not a filesystem browser: supply your own tree, stable unique folder keys and file-selection behavior for real project data.",
    mobile:
      "The file tree appears inside the navigation sheet. Test deep paths and long filenames without widening the viewport.",
  },
  "sidebar-12": {
    title: "Calendar navigation",
    text: "CalendarSidebar keeps a selected Date locally and renders a single-date Calendar. The demo starts on 12 October 2024 and its month heading is static. Derive that heading from your displayed month and connect date selection to application data if you turn this into scheduling navigation.",
    mobile:
      "The calendar shares the sidebar's mobile sheet. Check date buttons with keyboard input and provide a clearly announced selected date in your actual workflow.",
  },
  "sidebar-13": {
    title: "Settings inside a dialog",
    text: "The Open settings trigger opens a core Dialog with a settings sidebar and content area. Keep its accessible DialogTitle even when visually hidden. Replace placeholder settings content and wire each destination to the relevant panel.",
    mobile:
      "The settings sidebar is hidden below 768px and does not become a sheet inside the dialog. Provide an alternative mobile settings selector before relying on those destinations.",
  },
  "sidebar-14": {
    title: "Right-side navigation",
    text: 'AppSidebar is placed on the right using side="right" while workspace content occupies the remaining area. The composition uses the same navigation and breadcrumb helpers as the standard layout; adjust your page\'s reading order and destinations when adapting it.',
    mobile:
      "The mobile sheet follows the right-side placement. Keep its open and close controls discoverable near the page header.",
  },
  "sidebar-15": {
    title: "Primary and utility sidebars",
    text: "The left application sidebar can collapse to icons; a second, static sidebar on the right contains calendar utilities. The right pane is not controlled by the left toggle. Keep primary navigation and optional contextual tools clearly separated.",
    mobile:
      "The right utility sidebar is hidden below 768px. Essential calendar tasks need another mobile entry point; the left navigation uses the normal sheet.",
  },
  "sidebar-16": {
    title: "Sticky site header",
    text: "SiteHeader spans the page above the navigation/content row, and SidebarProvider arranges them vertically. Keep the header height and sidebar offset coordinated if you add controls or change its spacing. Replace the sample search and destinations with your application's behavior.",
    mobile:
      "Test the site header and sheet together on a short viewport, including focus visibility and scrolling beneath the sticky header.",
  },
} satisfies Record<SidebarBlockId, { title: string; text: string; mobile: string }>;
