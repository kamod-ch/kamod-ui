import { BadgeCheckIcon, LogOutIcon, SettingsIcon, UserIcon } from "@kamod-ch/icons/lucide";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownTrigger,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@kamod-ch/ui";
import type { AppUser } from "./types";

export type AppNavUserProps = {
  user: AppUser;
  onSelect?: (key: string) => void;
};

export const AppNavUser = ({ user, onSelect }: AppNavUserProps) => {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dropdown>
          <DropdownTrigger
            class="h-auto w-full justify-start gap-2 px-2 py-1.5"
            aria-label="Open account menu"
          >
            <Avatar class="size-8 rounded-lg group-data-[collapsible=icon]:size-6">
              {user.avatarSrc ? <AvatarImage src={user.avatarSrc} alt="" /> : null}
              <AvatarFallback class="rounded-lg text-xs">{user.initials}</AvatarFallback>
            </Avatar>
            <span class="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span class="truncate font-medium">{user.name}</span>
              <span class="truncate text-xs">{user.email}</span>
            </span>
          </DropdownTrigger>
          <DropdownContent
            class="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownLabel class="p-0 font-normal">
              <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar class="size-8 rounded-lg">
                  {user.avatarSrc ? <AvatarImage src={user.avatarSrc} alt="" /> : null}
                  <AvatarFallback class="rounded-lg">{user.initials}</AvatarFallback>
                </Avatar>
                <span class="grid flex-1 leading-tight">
                  <span class="truncate font-semibold">{user.name}</span>
                  <span class="truncate text-xs">{user.email}</span>
                </span>
              </div>
            </DropdownLabel>
            <DropdownSeparator />
            <DropdownItem onClick={() => onSelect?.("profile")}>
              <BadgeCheckIcon size={14} aria-hidden="true" />
              Profile
            </DropdownItem>
            <DropdownItem onClick={() => onSelect?.("account")}>
              <UserIcon size={14} aria-hidden="true" />
              Account
            </DropdownItem>
            <DropdownItem onClick={() => onSelect?.("settings")}>
              <SettingsIcon size={14} aria-hidden="true" />
              Settings
            </DropdownItem>
            <DropdownSeparator />
            <DropdownItem variant="destructive" onClick={() => onSelect?.("logout")}>
              <LogOutIcon size={14} aria-hidden="true" />
              Log out
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
