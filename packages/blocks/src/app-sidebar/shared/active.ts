import type { AppNavItem, AppSidebarLinkProps } from "./types";

export const isNavItemActive = (item: AppNavItem, link: AppSidebarLinkProps): boolean => {
  if (link.isItemActive) return link.isItemActive(item);
  if (link.activeHref) return item.href === link.activeHref;
  return Boolean(item.isActive);
};

export const stopDemoNavigation = (event: Event, href: string) => {
  if (href.startsWith("http://") || href.startsWith("https://")) return;
  event.preventDefault();
};
