import { SidebarGroup, SidebarMenu, SidebarMenuItem } from "@kamod-ch/ui";
import { AppNavButton } from "../shared/nav-button";
import type { AppNavItem, AppSidebarLinkProps } from "../shared/types";

export const NavSecondary = ({
  items,
  link,
}: {
  items: AppNavItem[];
  link: AppSidebarLinkProps;
}) => (
  <SidebarGroup class="mt-auto">
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.id}>
          <AppNavButton item={item} link={link} />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  </SidebarGroup>
);
