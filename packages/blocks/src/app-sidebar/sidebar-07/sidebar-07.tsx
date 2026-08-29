import {
  BellIcon,
  CircleQuestionMarkIcon,
  CommandIcon,
  LogOutIcon,
  SearchIcon,
  SettingsIcon,
} from "@kamod-ch/icons/lucide";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { useEffect } from "preact/hooks";
import { canUseDOM, isEditableTarget } from "../../shared";
import { AppBrandMark } from "../shared/brand-mark";
import { defaultUser, defaultWorkspace, groupedNav } from "../shared/data";
import { AppNavButton } from "../shared/nav-button";
import { AppNavUser } from "../shared/nav-user";
import type { AppNavGroup, AppSidebarLinkProps, AppUser, AppWorkspace } from "../shared/types";

export type AppSidebar07Action = "settings" | "help" | "notifications" | "command" | "logout";

export type AppSidebar07Props = AppSidebarLinkProps & {
  workspace?: AppWorkspace;
  groups?: AppNavGroup[];
  user?: AppUser;
  onUserSelect?: (key: string) => void;
  onAction?: (action: AppSidebar07Action) => void;
  commandShortcut?: boolean;
  collapsible?: "offcanvas" | "icon" | "none";
};

const ToolbarButton = ({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: ComponentChildren;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        type="button"
        aria-label={label}
        class="flex size-8 items-center justify-center rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        onClick={onClick}
      >
        {children}
      </button>
    </TooltipTrigger>
    <TooltipContent side="top">{label}</TooltipContent>
  </Tooltip>
);

export const AppSidebar07 = ({
  workspace = defaultWorkspace,
  groups = groupedNav,
  user = defaultUser,
  onUserSelect,
  onAction,
  commandShortcut = true,
  collapsible = "icon",
  ...link
}: AppSidebar07Props) => {
  useEffect(() => {
    if (!commandShortcut || !canUseDOM()) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") return;
      if (isEditableTarget(event.target)) return;
      event.preventDefault();
      onAction?.("command");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [commandShortcut, onAction]);

  return (
    <Sidebar collapsible={collapsible} data-slot="block-app-sidebar-07">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip={workspace.name}>
              <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <AppBrandMark />
              </div>
              <span class="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span class="truncate font-bold">{workspace.name}</span>
                <span class="truncate text-muted-foreground text-xs">{workspace.hint}</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Search"
              onClick={() => onAction?.("command")}
              aria-label="Open search"
            >
              <SearchIcon aria-hidden="true" />
              <span>Search</span>
              <span class="ml-auto text-muted-foreground text-[10px] group-data-[collapsible=icon]:hidden">
                ⌘K
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.id}>
            {group.label ? <SidebarGroupLabel>{group.label}</SidebarGroupLabel> : null}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <AppNavButton item={{ ...item, badge: undefined }} link={link} />
                    {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <AppNavUser user={user} onSelect={onUserSelect} />
        <div class="flex items-center justify-between gap-1 px-1 pb-1 group-data-[collapsible=icon]:flex-col">
          <ToolbarButton label="Settings" onClick={() => onAction?.("settings")}>
            <SettingsIcon size={16} aria-hidden="true" />
          </ToolbarButton>
          <ToolbarButton label="Help" onClick={() => onAction?.("help")}>
            <CircleQuestionMarkIcon size={16} aria-hidden="true" />
          </ToolbarButton>
          <ToolbarButton label="Notifications" onClick={() => onAction?.("notifications")}>
            <BellIcon size={16} aria-hidden="true" />
          </ToolbarButton>
          <ToolbarButton label="Command palette" onClick={() => onAction?.("command")}>
            <CommandIcon size={16} aria-hidden="true" />
          </ToolbarButton>
          <ToolbarButton label="Log out" onClick={() => onAction?.("logout")}>
            <LogOutIcon size={16} aria-hidden="true" />
          </ToolbarButton>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
