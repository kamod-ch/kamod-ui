import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarRail } from "@kamod-ch/ui";
import { navigationItems } from "../data/navigation-data";
import { teams } from "../data/teams-data";
import { DashboardShell } from "../shared/dashboard-shell";
import { NavMain } from "../shared/nav-main";
import { SearchForm } from "../shared/search-form";
import { TeamSwitcher } from "../shared/team-switcher";

/** Self-contained page composition; replace its demo data and placeholder content locally. */
export const Sidebar05 = () => (
  <SidebarProvider>
    <Sidebar>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationItems} collapsible={true} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
    <DashboardShell />
  </SidebarProvider>
);
