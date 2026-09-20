/**
 * @file Sidebar account identity and action menu for Application Shell 1.
 * Consuming apps implement account navigation and sign-out through onUserAction.
 */
import {
  BadgeCheckIcon,
  BellIcon,
  ChevronsUpDownIcon,
  CreditCardIcon,
  LogOutIcon,
} from "@kamod-ch/icons/lucide";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Dropdown,
  DropdownLabel,
  DropdownSeparator,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@kamod-ch/ui";
import { MenuContent, MenuItem, MenuTrigger } from "./menu";
import type { ApplicationShell1Props, ApplicationShellUser } from "./types";

/**
 * Displays an avatar and identity, hiding the text in desktop icon mode.
 * The fallback uses explicit initials or the first letters of the name's first two words,
 * with `?` for an empty result. The enclosing menu trigger supplies the accessible name.
 *
 * @param props - Account identity used for the image, fallback and visible text.
 */
const UserInfo = ({ user }: { user: ApplicationShellUser }) => {
  const initials =
    user.initials ??
    user.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  return (
    <>
      <Avatar class="size-8 shrink-0 rounded-lg">
        {user.avatarSrc && <AvatarImage src={user.avatarSrc} alt="" />}
        <AvatarFallback class="rounded-lg">{initials || "?"}</AvatarFallback>
      </Avatar>
      <span class="grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
        <span class="truncate font-semibold">{user.name}</span>
        <span class="truncate text-xs">{user.email}</span>
      </span>
    </>
  );
};

/**
 * Renders the footer's keyboard-operable account menu within SidebarProvider.
 * Opens above the trigger on mobile and to its right on desktop. Selecting an action
 * reports its identifier and dismisses the menu; it does not change authentication state.
 *
 * @param props - User display data and an optional handler for the four account actions.
 */
export const NavUser = ({
  user,
  onUserAction,
}: Pick<ApplicationShell1Props, "user" | "onUserAction">) => {
  const { isMobile } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dropdown
          class="w-full"
          onKeyDown={(event) => {
            // Escape handled by the dropdown must not also dismiss the enclosing mobile Sheet.
            if (event.key === "Escape" && event.defaultPrevented) event.stopPropagation();
          }}
        >
          <SidebarMenuButton asChild size="lg" class="group-data-[collapsible=icon]:p-0!">
            <MenuTrigger
              aria-label={`Open account menu for ${user.name}`}
              class="justify-start border-0 bg-transparent shadow-none hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <UserInfo user={user} />
              <ChevronsUpDownIcon
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                class="ml-auto size-4 group-data-[collapsible=icon]:hidden"
              />
            </MenuTrigger>
          </SidebarMenuButton>
          <MenuContent
            side={isMobile ? "top" : "right"}
            align="end"
            class="w-56 max-w-[calc(100vw-2rem)] bg-popover motion-reduce:animate-none"
          >
            <DropdownLabel class="grid min-w-0 px-2 py-1.5">
              <span class="truncate font-semibold">{user.name}</span>
              <span class="truncate text-xs font-normal text-muted-foreground">{user.email}</span>
            </DropdownLabel>
            <DropdownSeparator />
            <MenuItem class="gap-2 px-2 py-1.5" onClick={() => onUserAction?.("account")}>
              <BadgeCheckIcon
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              />
              Account
            </MenuItem>
            <MenuItem class="gap-2 px-2 py-1.5" onClick={() => onUserAction?.("billing")}>
              <CreditCardIcon
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              />
              Billing
            </MenuItem>
            <MenuItem class="gap-2 px-2 py-1.5" onClick={() => onUserAction?.("notifications")}>
              <BellIcon
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              />
              Notifications
            </MenuItem>
            <DropdownSeparator />
            <MenuItem class="gap-2 px-2 py-1.5" onClick={() => onUserAction?.("logout")}>
              <LogOutIcon
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              />
              Log out
            </MenuItem>
          </MenuContent>
        </Dropdown>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
