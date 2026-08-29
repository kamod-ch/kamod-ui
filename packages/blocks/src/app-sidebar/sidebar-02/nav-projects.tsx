import { FolderIcon } from "@kamod-ch/icons/lucide";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem } from "@kamod-ch/ui";
import { AppNavButton } from "../shared/nav-button";
import type { AppProject, AppSidebarLinkProps } from "../shared/types";

export const NavProjects = ({
  projects,
  link,
}: {
  projects: AppProject[];
  link: AppSidebarLinkProps;
}) => (
  <SidebarGroup>
    <SidebarGroupLabel>Projects</SidebarGroupLabel>
    <SidebarMenu>
      {projects.map((project) => (
        <SidebarMenuItem key={project.id}>
          <AppNavButton
            item={{
              id: project.id,
              label: project.name,
              href: project.href,
              icon: FolderIcon,
            }}
            link={link}
          />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  </SidebarGroup>
);
