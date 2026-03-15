import { NavigationMenu } from "./NavigationMenu";
import { NavigationMenuContent } from "./NavigationMenuContent";
import { NavigationMenuItem } from "./NavigationMenuItem";
import { NavigationMenuLink } from "./NavigationMenuLink";
import { NavigationMenuList } from "./NavigationMenuList";
import { NavigationMenuTrigger } from "./NavigationMenuTrigger";
import { navigationMenuTriggerStyle } from "./navigationMenuTriggerStyle";

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
};

export type { NavigationMenuProps } from "./NavigationMenu";
export type { NavigationMenuContentProps } from "./NavigationMenuContent";
export type { NavigationMenuItemProps } from "./NavigationMenuItem";
export type { NavigationMenuLinkProps } from "./NavigationMenuLink";
export type { NavigationMenuListProps } from "./NavigationMenuList";
export type { NavigationMenuTriggerProps } from "./NavigationMenuTrigger";

export default {
  Root: NavigationMenu,
  List: NavigationMenuList,
  Item: NavigationMenuItem,
  Link: NavigationMenuLink,
  Trigger: NavigationMenuTrigger,
  Content: NavigationMenuContent
};
