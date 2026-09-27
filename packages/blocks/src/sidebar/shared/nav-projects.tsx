import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@kamod-ch/ui";
import { stopNavigation } from "./navigation";
import { iconMap } from "./navigation-icons";

export const NavProjects = ({ projects }: NavProjectsProps) => (
  <SidebarGroup class="group-data-[collapsible=icon]:hidden">
    <SidebarGroupLabel>Projects</SidebarGroupLabel>
    <SidebarMenu>
      {projects.map((project) => {
        const Icon = iconMap[project.icon];
        return (
          <SidebarMenuItem key={project.name}>
            <SidebarMenuButton asChild>
              <a href={project.url} onClick={stopNavigation}>
                <Icon />
                <span>{project.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  </SidebarGroup>
);

export type Project = {
  name: string;
  url: string;
  icon: keyof typeof iconMap;
};

/** Inputs supplied by the containing page; demo fixtures are kept separately. */
export type NavProjectsProps = {
  projects: Project[];
};
