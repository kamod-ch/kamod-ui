import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarRail } from "@kamod-ch/ui";
import { navigationItems } from "../data/navigation-data";
import { teams } from "../data/teams-data";
import { DashboardShell } from "../shared/dashboard-shell";
import { NavMainDropdowns } from "../shared/nav-main-dropdowns";
import { SidebarOptInForm } from "../shared/sidebar-opt-in-form";
import { TeamSwitcher } from "../shared/team-switcher";

/** Self-contained page composition; replace its demo data and placeholder content locally. */
export const Sidebar06 = () => (
  <SidebarProvider>
    <Sidebar>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMainDropdowns items={navigationItems} />
        <SidebarOptInForm />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
    <DashboardShell />
  </SidebarProvider>
);
