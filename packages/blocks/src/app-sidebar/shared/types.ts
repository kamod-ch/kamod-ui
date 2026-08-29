import type { ComponentType } from "preact";
import type { BlockLinkComponent } from "../../shared";

export type AppSidebarIcon = ComponentType<{
  size?: number;
  class?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

export type AppNavItem = {
  id: string;
  label: string;
  href: string;
  icon?: AppSidebarIcon;
  badge?: string;
  isActive?: boolean;
  items?: AppNavItem[];
};

export type AppNavGroup = {
  id: string;
  label?: string;
  items: AppNavItem[];
};

export type AppTeam = {
  id: string;
  name: string;
  plan?: string;
  initials: string;
};

export type AppProject = {
  id: string;
  name: string;
  href: string;
  colorClass?: string;
  favorite?: boolean;
};

export type AppUser = {
  name: string;
  email: string;
  initials: string;
  avatarSrc?: string;
};

export type AppWorkspace = {
  name: string;
  hint?: string;
};

export type AppSidebarLinkProps = {
  activeHref?: string;
  isItemActive?: (item: AppNavItem) => boolean;
  onNavigate?: (item: AppNavItem) => void;
  linkComponent?: BlockLinkComponent;
};

export type AppSidebarCollapseProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export type AppSidebarPreviewMode = "desktop" | "collapsed" | "mobile";

/** CSS custom properties for SidebarProvider. Not React.CSSProperties. */
export type SidebarWidthVars = {
  "--sidebar-width": string;
  "--sidebar-width-icon": string;
};
