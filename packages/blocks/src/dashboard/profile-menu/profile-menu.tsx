import { CreditCardIcon, LogOutIcon, SettingsIcon, UserIcon } from "@kamod-ch/icons/lucide";
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
} from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { isValidElement } from "preact";
import type { DashboardIcon } from "../shared/types";

export type ProfileMenuItem = {
  key: string;
  label: string;
  icon?: DashboardIcon;
  variant?: "default" | "destructive";
  separatorBefore?: boolean;
};

export type ProfileMenuUser = {
  name: string;
  email: string;
  avatarSrc?: string;
  initials?: string;
};

export type ProfileMenuProps = {
  user?: ProfileMenuUser;
  items?: ProfileMenuItem[];
  trigger?: ComponentChildren;
  onSelect?: (key: string) => void;
  /** Drop preview chrome so the menu can sit in a topbar. */
  embedded?: boolean;
};

const defaultUser: ProfileMenuUser = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  initials: "AL",
};

const defaultItems: ProfileMenuItem[] = [
  { key: "profile", label: "Profile", icon: UserIcon },
  { key: "billing", label: "Billing", icon: CreditCardIcon },
  { key: "settings", label: "Settings", icon: SettingsIcon },
  {
    key: "logout",
    label: "Log out",
    icon: LogOutIcon,
    variant: "destructive",
    separatorBefore: true,
  },
];

export const ProfileMenu = ({
  user = defaultUser,
  items = defaultItems,
  trigger,
  onSelect,
  embedded = false,
}: ProfileMenuProps) => {
  const customTrigger = isValidElement(trigger) ? trigger : null;

  return (
    <div
      data-slot="block-profile-menu"
      class={
        embedded
          ? "text-foreground"
          : "flex min-h-[240px] items-start justify-end bg-background p-6 text-foreground"
      }
    >
      <Dropdown>
        {customTrigger ? (
          <DropdownTrigger asChild>{customTrigger}</DropdownTrigger>
        ) : (
          <DropdownTrigger class="h-auto gap-2 px-2 py-1.5" aria-label="Open profile menu">
            <Avatar size="sm">
              {user.avatarSrc ? <AvatarImage src={user.avatarSrc} alt="" /> : null}
              <AvatarFallback>
                {user.initials ?? user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span class="hidden text-left sm:grid">
              <span class="text-sm font-medium">{user.name}</span>
              <span class="text-muted-foreground text-xs">{user.email}</span>
            </span>
          </DropdownTrigger>
        )}
        <DropdownContent align="end" class="min-w-56">
          <DropdownLabel>
            <span class="grid">
              <span class="text-foreground text-sm font-medium">{user.name}</span>
              <span class="font-normal">{user.email}</span>
            </span>
          </DropdownLabel>
          <DropdownSeparator />
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key}>
                {item.separatorBefore ? <DropdownSeparator /> : null}
                <DropdownItem variant={item.variant} onClick={() => onSelect?.(item.key)}>
                  {Icon ? <Icon size={14} aria-hidden="true" /> : null}
                  {item.label}
                </DropdownItem>
              </div>
            );
          })}
        </DropdownContent>
      </Dropdown>
    </div>
  );
};
