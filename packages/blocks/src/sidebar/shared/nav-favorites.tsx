import { StarIcon } from "@kamod-ch/icons/lucide";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@kamod-ch/ui";
import { stopNavigation } from "./sample-data";

const favorites = [
  "Project Management & Task Tracking",
  "Family Recipe Collection",
  "Fitness Tracker",
];

export const NavFavorites = () => (
  <SidebarGroup>
    <SidebarGroupLabel>Favorites</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        {favorites.map((item) => (
          <SidebarMenuItem key={item}>
            <SidebarMenuButton asChild>
              <a href="#" onClick={stopNavigation}>
                <StarIcon />
                <span class="truncate">{item}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
);
