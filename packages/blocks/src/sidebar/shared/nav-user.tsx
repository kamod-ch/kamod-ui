import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";

export const NavUser = ({ user }: NavUserProps): ComponentChildren => (
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

export type User = {
  name: string;
  email: string;
  avatar: string;
};

/** Inputs supplied by the containing page; demo fixtures are kept separately. */
export type NavUserProps = {
  user: User;
};
