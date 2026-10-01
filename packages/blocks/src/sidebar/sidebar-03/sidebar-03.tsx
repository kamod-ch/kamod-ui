import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarRail } from "@kamod-ch/ui";
import { navigationItems } from "../data/navigation-data";
import { teams } from "../data/teams-data";
import { DashboardShell } from "../shared/dashboard-shell";
import { NavMain } from "../shared/nav-main";
import { TeamSwitcher } from "../shared/team-switcher";

/** Self-contained page composition; replace its demo data and placeholder content locally. */
export const Sidebar03 = () => (
  <SidebarProvider>
    <Sidebar>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationItems} collapsible={false} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
    <DashboardShell
      headerClass="flex h-16 shrink-0 items-center gap-2 border-b"
      headerInner
      triggerClass=""
    />
  </SidebarProvider>
);
