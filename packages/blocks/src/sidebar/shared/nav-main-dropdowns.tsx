import { ChevronRightIcon } from "@kamod-ch/icons/lucide";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@kamod-ch/ui";
import { stopNavigation } from "./navigation";
import { iconMap } from "./navigation-icons";
import type { NavigationItem } from "./navigation-types";

export const NavMainDropdowns = ({ items }: NavMainDropdownsProps) => (
  <SidebarGroup>
    <SidebarGroupLabel>Platform</SidebarGroupLabel>
    <SidebarMenu>
      {items.map((item) => {
        const Icon = iconMap[item.icon];
        if (!item.items?.length)
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title} isActive={item.isActive}>
                <a
                  href={item.url}
                  onClick={stopNavigation}
                  aria-current={item.isActive ? "page" : undefined}
                >
                  <Icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        return (
          <SidebarMenuItem key={item.title}>
            <Dropdown>
              <DropdownTrigger asChild>
                <SidebarMenuButton tooltip={item.title} isActive={item.isActive}>
                  <Icon />
                  <span>{item.title}</span>
                  <ChevronRightIcon class="ml-auto" />
                </SidebarMenuButton>
              </DropdownTrigger>
              <DropdownContent side="right" align="start" class="w-48">
                {item.items?.map((sub) => (
                  <DropdownItem key={sub.title} href={sub.url} onClick={stopNavigation}>
                    {sub.title}
                  </DropdownItem>
                ))}
              </DropdownContent>
            </Dropdown>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  </SidebarGroup>
);

/** Inputs supplied by the containing page; demo fixtures are kept separately. */
export type NavMainDropdownsProps = {
  items: NavigationItem[];
};
