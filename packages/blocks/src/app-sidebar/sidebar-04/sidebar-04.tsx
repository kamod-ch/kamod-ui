import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@kamod-ch/ui";
import { renderBlockLink } from "../../shared";
import { isNavItemActive, stopDemoNavigation } from "../shared/active";
import { AppBrandMark } from "../shared/brand-mark";
import { defaultWorkspace, floatingNav } from "../shared/data";
import type { AppNavItem, AppSidebarLinkProps, AppWorkspace } from "../shared/types";

export type AppSidebar04Props = AppSidebarLinkProps & {
  workspace?: AppWorkspace;
  nav?: AppNavItem[];
  collapsible?: "offcanvas" | "icon" | "none";
};

export const AppSidebar04 = ({
  workspace = defaultWorkspace,
  nav = floatingNav,
  collapsible = "offcanvas",
  ...link
}: AppSidebar04Props) => (
  <Sidebar variant="floating" collapsible={collapsible} data-slot="block-app-sidebar-04">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" tooltip={workspace.name}>
            <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <AppBrandMark />
            </div>
            <span class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-bold">{workspace.name}</span>
              <span class="truncate text-muted-foreground text-xs">{workspace.hint}</span>
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigate</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {nav.map((item) => {
              const Icon = item.icon;
              const isActive = isNavItemActive(item, link);
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton isActive={isActive} tooltip={item.label}>
                    {Icon ? <Icon aria-hidden="true" /> : null}
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <SidebarMenuSub>
                      {item.items.map((sub) => {
                        const subActive = isNavItemActive(sub, link);
                        return (
                          <SidebarMenuSubItem key={sub.id}>
                            <SidebarMenuSubButton asChild isActive={subActive}>
                              {renderBlockLink(link.linkComponent, {
                                href: sub.href,
                                "aria-current": subActive ? "page" : undefined,
                                onClick: (event) => {
                                  stopDemoNavigation(event, sub.href);
                                  link.onNavigate?.(sub);
                                },
                                children: <span>{sub.label}</span>,
                              })}
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarRail />
  </Sidebar>
);
