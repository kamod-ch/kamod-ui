import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@kamod-ch/ui";
import {
  defaultProjects,
  defaultTeams,
  defaultUser,
  platformNav,
  secondaryNav,
} from "../shared/data";
import { AppNavUser } from "../shared/nav-user";
import type {
  AppNavItem,
  AppProject,
  AppSidebarLinkProps,
  AppTeam,
  AppUser,
} from "../shared/types";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavSecondary } from "./nav-secondary";
import { TeamSwitcher } from "./team-switcher";

export type AppSidebar02Props = AppSidebarLinkProps & {
  teams?: AppTeam[];
  teamId?: string;
  defaultTeamId?: string;
  onTeamChange?: (id: string) => void;
  nav?: AppNavItem[];
  projects?: AppProject[];
  secondary?: AppNavItem[];
  user?: AppUser;
  onUserSelect?: (key: string) => void;
  collapsible?: "offcanvas" | "icon" | "none";
};

export const AppSidebar02 = ({
  teams = defaultTeams,
  teamId,
  defaultTeamId,
  onTeamChange,
  nav = platformNav,
  projects = defaultProjects,
  secondary = secondaryNav,
  user = defaultUser,
  onUserSelect,
  collapsible = "icon",
  ...link
}: AppSidebar02Props) => (
  <Sidebar collapsible={collapsible} data-slot="block-app-sidebar-02">
    <SidebarHeader>
      <TeamSwitcher
        teams={teams}
        value={teamId}
        defaultValue={defaultTeamId}
        onValueChange={onTeamChange}
      />
    </SidebarHeader>
    <SidebarContent>
      <NavMain items={nav} link={link} />
      <NavProjects projects={projects} link={link} />
      <NavSecondary items={secondary} link={link} />
    </SidebarContent>
    <SidebarFooter>
      <AppNavUser user={user} onSelect={onUserSelect} />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
);
