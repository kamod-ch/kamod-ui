import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarRail,
} from "@kamod-ch/ui";
import { navigationItems } from "../data/navigation-data";
import { projects } from "../data/projects-data";
import { teams } from "../data/teams-data";
import { user } from "../data/user-data";
import { DashboardShell } from "../shared/dashboard-shell";
import { NavMain } from "../shared/nav-main";
import { NavProjects } from "../shared/nav-projects";
import { NavUser } from "../shared/nav-user";
import { TeamSwitcher } from "../shared/team-switcher";

/** Self-contained page composition; replace its demo data and placeholder content locally. */
export const Sidebar07 = () => (
  <SidebarProvider>
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationItems} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    <DashboardShell
      headerClass="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
      headerInner
      headerInnerClass="px-4"
      contentPaddingTop={false}
    />
  </SidebarProvider>
);
