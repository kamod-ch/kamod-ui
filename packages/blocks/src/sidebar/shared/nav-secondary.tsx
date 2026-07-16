import { LifeBuoyIcon, SendIcon } from "@kamod-ch/icons/lucide";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@kamod-ch/ui";
import { stopNavigation } from "./sample-data";

const secondaryItems = [
  { title: "Support", url: "#", icon: LifeBuoyIcon },
  { title: "Feedback", url: "#", icon: SendIcon },
];

export const NavSecondary = () => (
  <SidebarGroup class="mt-auto">
    <SidebarGroupContent>
      <SidebarMenu>
        {secondaryItems.map((item) => (
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
