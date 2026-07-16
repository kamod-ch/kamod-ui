import {
  BookOpenIcon,
  BotIcon,
  ChartPieIcon,
  CheckIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  FrameIcon,
  MapIcon,
  Settings2Icon,
  SquareTerminalIcon,
} from "@kamod-ch/icons/lucide";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { appNavData, stopNavigation } from "./sample-data";

const iconMap = {
  terminal: SquareTerminalIcon,
  bot: BotIcon,
  book: BookOpenIcon,
  settings: Settings2Icon,
  frame: FrameIcon,
  pie: ChartPieIcon,
  map: MapIcon,
} as const;

export const NavMain = ({
  items = appNavData.navMain,
  collapsible = true,
}: {
  items?: typeof appNavData.navMain;
  collapsible?: boolean;
}) => (
  <SidebarGroup>
    <SidebarGroupLabel>Platform</SidebarGroupLabel>
    <SidebarMenu>
      {items.map((item) => {
        const Icon = iconMap[item.icon];
        if (!collapsible && item.items?.length) {
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} isActive={item.isActive}>
                <Icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
              <SidebarMenuSub>
                {item.items.map((sub) => (
                  <SidebarMenuSubItem key={sub.title}>
                    <SidebarMenuSubButton href={sub.url} onClick={stopNavigation}>
                      <span>{sub.title}</span>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </SidebarMenuItem>
          );
        }
        if (!collapsible || !item.items?.length) {
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} isActive={item.isActive}>
                <Icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        }
        return (
          <Collapsible
            key={item.title}
            defaultOpen={Boolean(item.isActive)}
            class="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title} isActive={item.isActive}>
                  <Icon />
                  <span>{item.title}</span>
                  <ChevronRightIcon class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items.map((sub) => (
                    <SidebarMenuSubItem key={sub.title}>
                      <SidebarMenuSubButton href={sub.url} onClick={stopNavigation}>
                        <span>{sub.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        );
      })}
    </SidebarMenu>
  </SidebarGroup>
);

export const NavMainDropdowns = ({
  items = appNavData.navMain,
}: {
  items?: typeof appNavData.navMain;
}) => (
  <SidebarGroup>
    <SidebarGroupLabel>Platform</SidebarGroupLabel>
    <SidebarMenu>
      {items.map((item) => {
        const Icon = iconMap[item.icon];
        return (
          <SidebarMenuItem key={item.title}>
            <Dropdown>
              <DropdownTrigger asChild>
                <SidebarMenuButton tooltip={item.title} isActive={item.isActive}>
                  <Icon />
                  <span>{item.title}</span>
                  <ChevronRightIcon class="ml-auto" />
                </SidebarMenuButton>
              </DropdownTrigger>
              <DropdownContent side="right" align="start" class="w-48">
                {item.items?.map((sub) => (
                  <DropdownItem key={sub.title} onClick={stopNavigation}>
                    {sub.title}
                  </DropdownItem>
                ))}
              </DropdownContent>
            </Dropdown>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  </SidebarGroup>
);

export const NavProjects = ({
  projects = appNavData.projects,
}: {
  projects?: typeof appNavData.projects;
}) => (
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

export const TeamSwitcher = ({ teams = appNavData.teams }: { teams?: typeof appNavData.teams }) => {
  const [activeTeam, setActiveTeam] = useState(teams[0]);
  if (!activeTeam) return null;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dropdown>
          <DropdownTrigger asChild>
            <SidebarMenuButton
              size="lg"
              class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
                {activeTeam.logo}
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-medium">{activeTeam.name}</span>
                <span class="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDownIcon class="ml-auto" />
            </SidebarMenuButton>
          </DropdownTrigger>
          <DropdownContent class="w-(--radix-dropdown-menu-trigger-width) min-w-56" align="start">
            {teams.map((team) => (
              <DropdownItem key={team.name} onClick={() => setActiveTeam(team)}>
                <div class="flex size-6 items-center justify-center rounded-sm border">
                  {team.logo}
                </div>
                {team.name}
                {team.name === activeTeam.name ? <CheckIcon class="ml-auto size-4" /> : null}
              </DropdownItem>
            ))}
          </DropdownContent>
        </Dropdown>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export const NavUser = ({
  user = appNavData.user,
}: {
  user?: typeof appNavData.user;
}): ComponentChildren => (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton size="lg">
        <span class="grid size-8 place-items-center rounded-lg bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
          {user.avatar}
        </span>
        <div class="grid flex-1 text-left text-sm leading-tight">
          <span class="truncate font-medium">{user.name}</span>
          <span class="truncate text-xs">{user.email}</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
);
