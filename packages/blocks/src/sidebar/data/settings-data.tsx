import { InboxIcon, LayoutDashboardIcon, SettingsIcon, UsersIcon } from "@kamod-ch/icons/lucide";
import type { ComponentChildren } from "preact";

export type SettingsItem = {
  title: string;
  icon: ComponentChildren;
};

/** Demo settings sections; supply panel selection and content in your application. */
export const settingsNav: SettingsItem[] = [
  { title: "General", icon: <SettingsIcon /> },
  { title: "Team", icon: <UsersIcon /> },
  { title: "Billing", icon: <InboxIcon /> },
  { title: "Limits", icon: <LayoutDashboardIcon /> },
];
