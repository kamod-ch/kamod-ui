import type { NavigationLink } from "./navigation";
import type { iconMap } from "./navigation-icons";

/** A navigation entry with an icon and optional one-level submenu. */
export type NavigationItem = NavigationLink & {
  icon: keyof typeof iconMap;
  items?: NavigationLink[];
};
