import { ChevronRightIcon } from "@kamod-ch/icons/lucide";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
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
import { NavMain, NavMainDropdowns, NavProjects, NavUser, TeamSwitcher } from "./nav";
import { NavSecondary } from "./nav-secondary";
import { docsNavData, stopNavigation } from "./sample-data";
import { SearchForm } from "./search-form";
import { SidebarOptInForm } from "./sidebar-opt-in-form";
import { VersionSwitcher } from "./version-switcher";

export type AppSidebarProps = SidebarProps & {
  mode?: "docs" | "app" | "submenus" | "dropdowns";
  collapsibleSections?: boolean;
  collapsibleSubmenus?: boolean;
  showSearchForm?: boolean;
  showOptInForm?: boolean;
  showSecondaryNav?: boolean;
};

export const AppSidebar = ({
  mode = "docs",
  collapsible = "offcanvas",
  collapsibleSections = false,
  collapsibleSubmenus = false,
  showSearchForm = false,
  showOptInForm = false,
  showSecondaryNav = false,
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
          {showSecondaryNav ? <NavSecondary /> : null}
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
          {showSearchForm ? <SearchForm /> : null}
        </SidebarHeader>
        <SidebarContent>
          <NavMain collapsible={collapsibleSubmenus} />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    );
  }

  if (mode === "dropdowns") {
    return (
      <Sidebar collapsible={collapsible} {...props}>
        <SidebarHeader>
          <TeamSwitcher />
        </SidebarHeader>
        <SidebarContent>
          <NavMainDropdowns />
          {showOptInForm ? <SidebarOptInForm /> : null}
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
        {docsNavData.navMain.map((group) => {
          const hasActiveItem = group.items.some((item) => "isActive" in item && item.isActive);

          if (!collapsibleSections) {
            return (
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
            );
          }

          return (
            <Collapsible key={group.title} defaultOpen={hasActiveItem} class="group/collapsible">
              <SidebarGroup>
                <SidebarGroupLabel
                  asChild
                  class="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <CollapsibleTrigger>
                    {group.title}
                    <ChevronRightIcon class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
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
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};
