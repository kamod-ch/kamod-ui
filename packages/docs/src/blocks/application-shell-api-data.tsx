/** @file Reading guides for the source-backed Application Shell API reference. */
import type { ApplicationShell1Props } from "@kamod-ch/blocks/application-shell";
import type { ComponentChildren } from "preact";
import type { ApplicationShellTypeName } from "./application-shell-type-source";

/** Human-facing behavior notes; TypeScript requires an entry for every public prop. */
export const propDescriptions = {
  brand: "Sidebar identity, an optional logo and an optional home or workspace link.",
  navigationGroups: "Ordered groups of destinations, with at most one level of child links.",
  user: "Account name and email, with an optional avatar or custom initials. No session is inferred.",
  breadcrumbs:
    "An independent, ordered trail. The last entry is never a link; earlier entries hide below 768px. An empty array omits the trail and its separator.",
  children:
    "Page content inside the existing main landmark and padded content area. No placeholder content is inserted.",
  currentPath:
    "Exact URL used to match item href values. An item's explicit active value takes precedence; no router or path normalization is applied.",
  onNavigate:
    "Handles linked brand, breadcrumb and navigation activation, or a leaf action button. Native links still work without it.",
  onUserAction:
    "Receives an account menu selection. Your app implements the resulting navigation or account operation.",
  open: "Controls desktop expansion: true expands, false collapses to icons. Update this value in onOpenChange to respond to the toggle.",
  defaultOpen:
    "Initial uncontrolled desktop state. Ignored when open is supplied; changing it after mount does not reset the sidebar.",
  onOpenChange:
    "Reports requested desktop expansion in either state mode. Mobile visibility does not call this callback.",
  class: "Additional classes merged onto the outer SidebarProvider wrapper.",
  className: "Alias for class, merged after it when both are supplied.",
} satisfies Record<keyof ApplicationShell1Props, string>;

/** A short reading guide beside a source-derived type definition. */
export type TypeReference = {
  name: ApplicationShellTypeName;
  title: string;
  description: string;
  note?: ComponentChildren;
};

export const dataTypes: readonly TypeReference[] = [
  {
    name: "ApplicationShellBrand",
    title: "Brand and logo",
    description: "The identity shown at the top of the sidebar, including in icon mode.",
    note: (
      <>
        Without <code>logo</code>, the first character of <code>name</code> is used. Without{" "}
        <code>href</code>, the brand is display-only. Pass JSX for a custom logo; it is decorative,
        while the name supplies the accessible label.
      </>
    ),
  },
  {
    name: "ApplicationShellUser",
    title: "Account identity",
    description: "Display data for the sidebar footer and account menu.",
    note: (
      <>
        An unavailable avatar falls back to explicit <code>initials</code>, or uppercase initials
        from the first two words of <code>name</code>. An empty result displays <code>?</code>. The
        email is display text, not a mail action.
      </>
    ),
  },
  {
    name: "ApplicationShellNavigationGroup",
    title: "Navigation groups",
    description: "The outer level of your navigation: an ID, optional heading and ordered items.",
    note: (
      <>
        Keep group IDs unique and item IDs unique among siblings. Omitting a group label leaves no
        empty heading. Readonly arrays work directly; the shell preserves your order.
      </>
    ),
  },
  {
    name: "ApplicationShellNavigationItem",
    title: "Top-level items and branches",
    description: "A navigation link that can also contain one level of child links.",
    note: (
      <>
        Inherits all fields from <code>ApplicationShellNavigationLink</code>. Empty or omitted{" "}
        <code>items</code> creates a leaf. A branch with an <code>href</code> has separate
        navigation and disclosure controls; without one, its label only opens the submenu.
      </>
    ),
  },
  {
    name: "ApplicationShellNavigationLink",
    title: "Leaf and child destinations",
    description: "A destination plus its stable ID, optional icon and interaction state.",
    note: (
      <>
        Inherits <code>label</code> and <code>href</code> from{" "}
        <code>ApplicationShellDestination</code>. Explicit <code>active: false</code> suppresses
        this destination's path match. A disabled branch also disables its children.
      </>
    ),
  },
  {
    name: "ApplicationShellDestination",
    title: "Breadcrumbs and callback destinations",
    description: "The shared label and optional URL used by breadcrumbs and navigation callbacks.",
    note: (
      <>
        The final breadcrumb always marks the current page, even if it has an <code>href</code>.
        Earlier entries without a URL are plain text. Callbacks guarantee only these two fields, not
        a navigation item's <code>id</code>.
      </>
    ),
  },
  {
    name: "ApplicationShellIcon",
    title: "Navigation icons",
    description: "A Preact component that accepts the shell's SVG styling and accessibility props.",
    note: (
      <>
        Pass a component reference such as <code>icon: FolderIcon</code>, not an element. Top-level
        items without an icon use a circle; child links have no fallback icon. Navigation supplies
        stroke width 2, rounded strokes and decorative semantics.
      </>
    ),
  },
];
