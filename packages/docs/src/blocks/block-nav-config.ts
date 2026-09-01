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

export const visibleBlockNavItems = BLOCK_NAV_ITEMS.filter(
  (item) => !HIDDEN_BLOCK_NAV_KEYS.has(item.key),
);
