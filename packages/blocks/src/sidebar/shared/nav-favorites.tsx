import { StarIcon } from "@kamod-ch/icons/lucide";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@kamod-ch/ui";
import type { NavigationLink } from "./navigation";
import { stopNavigation } from "./navigation";

export const NavFavorites = ({ items }: NavFavoritesProps) => (
  <SidebarGroup>
    <SidebarGroupLabel>Favorites</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <a href={item.url} onClick={stopNavigation}>
                <StarIcon />
                <span class="truncate">{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
);

/** Inputs supplied by the containing page; demo fixtures are kept separately. */
export type NavFavoritesProps = {
  items: NavigationLink[];
};
