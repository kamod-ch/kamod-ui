import { StarIcon } from "@kamod-ch/icons/lucide";
import {
  Avatar,
  AvatarFallback,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@kamod-ch/ui";
import { useEffect } from "preact/hooks";
import { canUseDOM, isEditableTarget, useControllableState } from "../../shared";
import { AppBrandMark } from "../shared/brand-mark";
import { defaultProjects, defaultTeams, defaultUser, defaultWorkspace } from "../shared/data";
import { AppNavUser } from "../shared/nav-user";
import { AppSearchField } from "../shared/search-field";
import type {
  AppProject,
  AppSidebarLinkProps,
  AppTeam,
  AppUser,
  AppWorkspace,
} from "../shared/types";

export type AppSidebar06Props = AppSidebarLinkProps & {
  workspace?: AppWorkspace;
  projects?: AppProject[];
  teams?: AppTeam[];
  user?: AppUser;
  favoriteIds?: string[];
  defaultFavoriteIds?: string[];
  onFavoriteChange?: (ids: string[]) => void;
  searchShortcut?: boolean;
  onUserSelect?: (key: string) => void;
  collapsible?: "offcanvas" | "icon" | "none";
};

export const AppSidebar06 = ({
  workspace = defaultWorkspace,
  projects = defaultProjects,
  teams = defaultTeams,
  user = defaultUser,
  favoriteIds,
  defaultFavoriteIds,
  onFavoriteChange,
  searchShortcut = true,
  onUserSelect,
  collapsible = "offcanvas",
  ...link
}: AppSidebar06Props) => {
  const searchId = "app-sidebar-06-search";
  const [favorites, setFavorites] = useControllableState({
    value: favoriteIds,
    defaultValue:
      defaultFavoriteIds ?? projects.filter((project) => project.favorite).map((p) => p.id),
    onChange: onFavoriteChange,
  });

  useEffect(() => {
    if (!searchShortcut || !canUseDOM()) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "f") return;
      if (isEditableTarget(event.target)) return;
      event.preventDefault();
      document.getElementById(searchId)?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [searchShortcut]);

  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id)
      ? favorites.filter((item) => item !== id)
      : [...favorites, id];
    setFavorites(next);
  };

  return (
    <Sidebar collapsible={collapsible} data-slot="block-app-sidebar-06">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip={workspace.name}>
              <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <AppBrandMark />
              </div>
              <span class="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span class="truncate font-bold">{workspace.name}</span>
                <span class="truncate text-muted-foreground text-xs">Workspace</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <AppSearchField id={searchId} shortcutHint="⌘F" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((project) => {
                const isFavorite = favorites.includes(project.id);
                return (
                  <SidebarMenuItem key={project.id}>
                    <SidebarMenuButton
                      tooltip={project.name}
                      isActive={link.activeHref === project.href}
                      onClick={() =>
                        link.onNavigate?.({
                          id: project.id,
                          label: project.name,
                          href: project.href,
                        })
                      }
                    >
                      <span
                        class={`flex size-5 shrink-0 items-center justify-center rounded-md text-white ${project.colorClass ?? "bg-chart-1"}`}
                      >
                        <span class="text-[10px] font-semibold">{project.name.slice(0, 1)}</span>
                      </span>
                      <span>{project.name}</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction
                      showOnHover
                      aria-label={
                        isFavorite ? `Unfavorite ${project.name}` : `Favorite ${project.name}`
                      }
                      aria-pressed={isFavorite}
                      onClick={() => toggleFavorite(project.id)}
                    >
                      <StarIcon
                        class={isFavorite ? "fill-current text-warning" : "text-muted-foreground"}
                        aria-hidden="true"
                      />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Teams</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {teams.map((team) => (
                <SidebarMenuItem key={team.id}>
                  <SidebarMenuButton tooltip={team.name}>
                    <Avatar class="size-5">
                      <AvatarFallback class="text-[10px]">{team.initials}</AvatarFallback>
                    </Avatar>
                    <span>{team.name}</span>
                    <span
                      class="relative ml-auto size-2 rounded-full bg-emerald-500"
                      aria-label="Online"
                    >
                      <span class="sr-only">Online</span>
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <AppNavUser user={user} onSelect={onUserSelect} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
