import { HouseIcon, InboxIcon, UsersIcon } from "@kamod-ch/icons/lucide";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import { inboxItems } from "../data/inbox-data";
import { teams } from "../data/teams-data";
import { user } from "../data/user-data";
import { DashboardShell } from "../shared/dashboard-shell";
import { NavUser } from "../shared/nav-user";
import { TeamSwitcher } from "../shared/team-switcher";

/** Self-contained page composition; replace its demo data and placeholder content locally. */
export const Sidebar09 = () => {
  const [activeItem, setActiveItem] = useState("Inbox");

  return (
    <SidebarProvider style={{ ["--sidebar-width" as string]: "350px" }}>
      <Sidebar collapsible="icon" class="overflow-hidden *:data-[sidebar=sidebar]:flex-row">
        <Sidebar collapsible="none" class="w-[calc(var(--sidebar-width-icon)+1px)]! border-r">
          <SidebarHeader>
            <TeamSwitcher teams={teams} />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {[
                    { title: "Inbox", icon: <InboxIcon /> },
                    { title: "Drafts", icon: <HouseIcon /> },
                    { title: "Sent", icon: <UsersIcon /> },
                  ].map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={item.title === activeItem}
                        onClick={() => setActiveItem(item.title)}
                      >
                        {item.icon}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <NavUser user={user} />
          </SidebarFooter>
        </Sidebar>
        <Sidebar collapsible="none" class="hidden flex-1 md:flex">
          <SidebarHeader class="border-b p-4">
            <strong class="text-sm font-medium">{activeItem}</strong>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {inboxItems.map((item) => (
                    <SidebarMenuItem key={item}>
                      <SidebarMenuButton>{item}</SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarRail />
      </Sidebar>
      <DashboardShell
        breadcrumbParent="All Inboxes"
        breadcrumbPage="Inbox"
        stickyHeader
        headerClass="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4"
        placeholder="list"
      />
    </SidebarProvider>
  );
};
