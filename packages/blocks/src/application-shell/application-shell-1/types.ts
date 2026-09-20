/**
 * @file Public data and callback contracts for Application Shell 1.
 * Navigation, account actions and page content are supplied by the consuming app.
 */
import type { ComponentChildren, ComponentType, JSX } from "preact";

/**
 * Preact icon component compatible with the shell's Lucide-style SVG props.
 * Pass a component reference, such as `TerminalIcon`, rather than a JSX element.
 */
export type ApplicationShellIcon = ComponentType<{
  /** Classes used to size or style the rendered SVG. */
  class?: string;
  /** SVG width and height in pixels. */
  size?: number;
  /** Stroke thickness in SVG units; navigation icons receive `2`. */
  strokeWidth?: number;
  /** Rounded line endings used by the shell's navigation icons. */
  strokeLinecap?: "round";
  /** Rounded corners used by the shell's navigation icons. */
  strokeLinejoin?: "round";
  /** Hides decorative icons from assistive technology. */
  "aria-hidden"?: boolean | "true" | "false";
}>;

/** Shared destination data for navigation callbacks and breadcrumb entries. */
export type ApplicationShellDestination = {
  /** Visible link or breadcrumb text; also names icon-only navigation controls. */
  label: string;
  /** Native link URL. Omit for an action button or a non-link breadcrumb. */
  href?: string;
};

/** A leaf destination, usable at the top level or inside one navigation branch. */
export type ApplicationShellNavigationLink = ApplicationShellDestination & {
  /** Stable key, unique among sibling items. */
  id: string;
  /** Optional decorative icon; top-level items fall back to a circle. */
  icon?: ApplicationShellIcon;
  /** Overrides exact `currentPath` matching, including an explicit `false`. */
  active?: boolean;
  /** Prevents activation and removes the link from keyboard navigation. */
  disabled?: boolean;
};

/**
 * Top-level destination with an optional, single level of child links.
 * A branch with an `href` retains a separate link and disclosure toggle.
 */
export type ApplicationShellNavigationItem = ApplicationShellNavigationLink & {
  /** Non-empty children create a collapsible branch or an icon-mode dropdown. */
  items?: readonly ApplicationShellNavigationLink[];
};

/** Ordered navigation section; its optional label appears above its items. */
export type ApplicationShellNavigationGroup = {
  /** Stable key, unique among groups. */
  id: string;
  /** Section heading; omitted headings do not leave an empty label. */
  label?: string;
  /** Destinations displayed in the supplied order. */
  items: readonly ApplicationShellNavigationItem[];
};

/** Brand shown at the top of the sidebar in both expanded and icon modes. */
export type ApplicationShellBrand = {
  /** Visible name and accessible label; also supplies the fallback logo letter. */
  name: string;
  /** Optional second line, such as a workspace name or subscription tier. */
  description?: string;
  /** Makes the brand a navigable link; omit for a display-only brand. */
  href?: string;
  /** Decorative Preact content; defaults to the first character of `name`. */
  logo?: ComponentChildren;
};

/** Display data for the account menu; authentication remains the app's responsibility. */
export type ApplicationShellUser = {
  /** Name displayed in the footer and account menu. */
  name: string;
  /** Address displayed beneath the name; no email action is performed. */
  email: string;
  /** Optional image URL; initials are shown while unavailable or after an error. */
  avatarSrc?: string;
  /** Overrides initials derived from the first two words of `name`. */
  initials?: string;
};

/** Account menu selections passed to the app without built-in side effects. */
export type ApplicationShellUserAction = "account" | "billing" | "notifications" | "logout";

/**
 * Handles brand, breadcrumb and navigation activation without prescribing a router.
 * Native links still navigate unless the callback calls `event.preventDefault()`.
 * Router handlers should leave modified clicks untouched to preserve browser behavior.
 *
 * @param destination - The selected label and optional URL.
 * @param event - Preact click event from an anchor or an action-only button.
 */
export type ApplicationShellNavigate = (
  destination: ApplicationShellDestination,
  event: JSX.TargetedMouseEvent<HTMLAnchorElement | HTMLButtonElement>,
) => void;

/**
 * Configuration for ApplicationShell1 and its composed sidebar parts.
 * Desktop state can be controlled; the responsive mobile sheet has independent state.
 */
export type ApplicationShell1Props = {
  /** Sidebar identity, optional logo and optional home/workspace link. */
  brand: ApplicationShellBrand;
  /** Ordered groups containing links and at most one level of child links. */
  navigationGroups: readonly ApplicationShellNavigationGroup[];
  /** Footer account identity; no session or authentication state is inferred. */
  user: ApplicationShellUser;
  /** Ordered trail. The last entry is the current page, never a link; earlier entries hide on mobile. */
  breadcrumbs: readonly ApplicationShellDestination[];
  /** Page content rendered inside the shell's existing `main` landmark. */
  children?: ComponentChildren;
  /** Exact URL to match against item `href` values; explicit `active` takes precedence. */
  currentPath?: string;
  /** Optional router/action hook; see {@link ApplicationShellNavigate} for click handling. */
  onNavigate?: ApplicationShellNavigate;
  /** Handles account, billing, notifications or logout after a menu selection. */
  onUserAction?: (action: ApplicationShellUserAction) => void;
  /** Controlled desktop state: `true` expands, `false` collapses to icons. */
  open?: boolean;
  /** Initial uncontrolled desktop state; defaults to `true`. Ignored when `open` is supplied. */
  defaultOpen?: boolean;
  /** Reports requested desktop state. Update `open` when controlled; may also observe uncontrolled changes. */
  onOpenChange?: (open: boolean) => void;
  /** Additional classes merged onto the outer SidebarProvider wrapper. */
  class?: string;
  /** Alias for `class`; merged after it when both are supplied. */
  className?: string;
};
