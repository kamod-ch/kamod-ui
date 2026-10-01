import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@kamod-ch/ui";
import { navigationItems } from "../data/navigation-data";
import { projects } from "../data/projects-data";
import { teams } from "../data/teams-data";
import { user } from "../data/user-data";
import { NavMain } from "../shared/nav-main";
import { NavProjects } from "../shared/nav-projects";
import { NavUser } from "../shared/nav-user";
import { SiteHeader } from "../shared/site-header";
import { TeamSwitcher } from "../shared/team-switcher";

/** Self-contained page composition; replace its demo data and placeholder content locally. */
export const Sidebar16 = () => (
  <div class="[--header-height:calc(--spacing(14))]">
    <SidebarProvider class="flex flex-col">
      <SiteHeader />
      <div class="flex flex-1">
        <Sidebar class="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
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
        <SidebarInset>
          <div class="flex flex-1 flex-col gap-4 p-4">
            <div class="grid auto-rows-min gap-4 md:grid-cols-3">
              <div class="aspect-video rounded-xl bg-muted/50" />
              <div class="aspect-video rounded-xl bg-muted/50" />
              <div class="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  </div>
);
