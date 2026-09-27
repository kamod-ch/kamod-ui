import type { ComponentType } from "preact";
export type SecondaryItem = {
  title: string;
  url: string;
  icon: ComponentType;
};

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@kamod-ch/ui";
import { stopNavigation } from "./navigation";

export const NavSecondary = ({ items }: NavSecondaryProps) => (
  <SidebarGroup class="mt-auto">
    <SidebarGroupContent>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild size="sm">
              <a href={item.url} onClick={stopNavigation}>
                <item.icon />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
);

/** Inputs supplied by the containing page; demo fixtures are kept separately. */
export type NavSecondaryProps = {
  items: SecondaryItem[];
};
