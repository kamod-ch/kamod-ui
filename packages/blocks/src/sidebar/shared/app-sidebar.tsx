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
  type SidebarProps,
  SidebarRail,
} from "@kamod-ch/ui";
import { NavMain, NavProjects, NavUser, TeamSwitcher } from "./nav";
import { docsNavData, stopNavigation } from "./sample-data";
import { SearchForm } from "./search-form";
import { VersionSwitcher } from "./version-switcher";

export type AppSidebarProps = SidebarProps & {
  mode?: "docs" | "app" | "submenus" | "dropdowns";
};

export const AppSidebar = ({
  mode = "docs",
  collapsible = "offcanvas",
  ...props
}: AppSidebarProps) => {
  if (mode === "app") {
    return (
      <Sidebar collapsible={collapsible} {...props}>
        <SidebarHeader>
          <TeamSwitcher />
        </SidebarHeader>
        <SidebarContent>
          <NavMain />
          <NavProjects />
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }

  if (mode === "submenus") {
    return (
      <Sidebar collapsible={collapsible} {...props}>
        <SidebarHeader>
          <TeamSwitcher />
        </SidebarHeader>
        <SidebarContent>
          <NavMain collapsible />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible={collapsible} {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={docsNavData.versions}
          defaultVersion={docsNavData.versions[0]!}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {docsNavData.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={"isActive" in item && Boolean(item.isActive)}
                    >
                      <a href={item.url} onClick={stopNavigation}>
                        {item.title}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};
