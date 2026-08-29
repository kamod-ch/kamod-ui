import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@kamod-ch/ui";
import { AppBrandMark } from "../shared/brand-mark";
import { defaultUser, defaultWorkspace, workspaceGroups } from "../shared/data";
import { AppNavButton } from "../shared/nav-button";
import { AppNavUser } from "../shared/nav-user";
import type { AppNavGroup, AppSidebarLinkProps, AppUser, AppWorkspace } from "../shared/types";

export type AppSidebar01Props = AppSidebarLinkProps & {
  workspace?: AppWorkspace;
  groups?: AppNavGroup[];
  user?: AppUser;
  onUserSelect?: (key: string) => void;
  collapsible?: "offcanvas" | "icon" | "none";
};

export const AppSidebar01 = ({
  workspace = defaultWorkspace,
  groups = workspaceGroups,
  user = defaultUser,
  onUserSelect,
  collapsible = "icon",
  ...link
}: AppSidebar01Props) => (
  <Sidebar collapsible={collapsible} data-slot="block-app-sidebar-01">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            tooltip={workspace.name}
            class="group-data-[collapsible=icon]:justify-center!"
          >
            <div class="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground group-data-[collapsible=icon]:size-6">
              <AppBrandMark />
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span class="truncate font-bold">{workspace.name}</span>
              <span class="truncate text-muted-foreground text-xs">{workspace.hint}</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      {groups.map((group) => (
        <SidebarGroup key={group.id}>
          {group.label ? <SidebarGroupLabel>{group.label}</SidebarGroupLabel> : null}
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <AppNavButton item={item} link={link} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </SidebarContent>
    <SidebarFooter>
      <AppNavUser user={user} onSelect={onUserSelect} />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
);
