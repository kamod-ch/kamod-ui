/** Block categories hidden from docs navigation (routes remain reachable by URL). */
export const HIDDEN_BLOCK_NAV_KEYS = new Set([
  "app-sidebar",
  "auth",
  "marketing",
  "dashboard",
  "communication",
  "commerce",
]);

export const BLOCK_NAV_ITEMS = [
  { key: "sidebar", label: "Sidebar", href: "/blocks/sidebar" },
  { key: "application-shell", label: "Application Shell", href: "/blocks/application-shell" },
  { key: "app-sidebar", label: "App Sidebar", href: "/blocks/app-sidebar" },
  { key: "login", label: "Login", href: "/blocks/login" },
  { key: "signup", label: "Signup", href: "/blocks/signup" },
  { key: "auth", label: "Auth", href: "/blocks/auth" },
  { key: "marketing", label: "Marketing", href: "/blocks/marketing" },
  { key: "dashboard", label: "Dashboard", href: "/blocks/dashboard" },
  { key: "communication", label: "Communication", href: "/blocks/communication" },
  { key: "commerce", label: "Commerce", href: "/blocks/commerce" },
] as const;

export type BlockNavKey = (typeof BLOCK_NAV_ITEMS)[number]["key"];

/**
 * Require a new collection/variant or a significant public integration-contract change.
 * Documentation, styling, source manifests and routine fixes alone do not qualify.
 * Status never enables hidden categories; retire badges when release notes cover them.
 */
export const blockCategoryStatuses: Partial<Record<BlockNavKey, "added" | "updated">> = {
  // New contributor collection, including additional local shell variants.
  "application-shell": "added",
  // ec1e8af3: replace mode-based AppSidebar; require explicit navigation/team data props.
  sidebar: "updated",
};

export const visibleBlockNavItems = BLOCK_NAV_ITEMS.filter(
  (item) => !HIDDEN_BLOCK_NAV_KEYS.has(item.key),
);

/** Planned categories: navigation-only links to unimplemented pages, with no variants. */
export const PLACEHOLDER_BLOCK_CATEGORIES = [
  { key: "about", label: "About" },
  { key: "accept-invite", label: "Accept Invite" },
  { key: "address-book", label: "Address Book" },
  { key: "awards", label: "Awards" },
  { key: "background-pattern", label: "Background Pattern" },
  { key: "banner", label: "Banner" },
  { key: "bento", label: "Bento" },
  { key: "blog", label: "Blog" },
  { key: "blog-post", label: "Blog Post" },
  { key: "book-a-demo", label: "Book a Demo" },
  { key: "careers", label: "Careers" },
  { key: "case-studies", label: "Case Studies" },
  { key: "case-study", label: "Case Study" },
  { key: "changelog", label: "Changelog" },
  { key: "chart-card", label: "Chart Card" },
  { key: "chart-group", label: "Chart Group" },
  { key: "checkout", label: "Checkout" },
  { key: "code-example", label: "Code Example" },
  { key: "community", label: "Community" },
  { key: "contact", label: "Contact" },
] as const;
