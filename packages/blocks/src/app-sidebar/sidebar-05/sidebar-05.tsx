import {
  BellIcon,
  BriefcaseIcon,
  CalendarIcon,
  ChartLineIcon,
  ChevronsUpDownIcon,
  ClipboardListIcon,
  CreditCardIcon,
  FileTextIcon,
  FolderIcon,
  GaugeIcon,
  HeadphonesIcon,
  HouseIcon,
  InboxIcon,
  LayoutDashboardIcon,
  LockIcon,
  MailIcon,
  MessageSquareIcon,
  SendIcon,
  SettingsIcon,
  StarIcon,
  UsersIcon,
} from "@kamod-ch/icons/lucide";
import {
  Avatar,
  AvatarFallback,
  cn,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useSidebar,
} from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { AppBrandMark } from "../shared/brand-mark";
import { AppSearchField } from "../shared/search-field";
import type { AppSidebarIcon, AppSidebarLinkProps } from "../shared/types";
import { sidebar05WidthVars } from "../shared/width-style";

export { sidebar05WidthVars };

export type DualRailId = "home" | "projects" | "inbox" | "messages" | "support" | "settings";

export type DualRailItem = {
  id: DualRailId;
  label: string;
  icon: AppSidebarIcon;
};

const railUpper: DualRailItem[] = [
  { id: "home", icon: HouseIcon, label: "Home" },
  { id: "projects", icon: FolderIcon, label: "Projects" },
  { id: "inbox", icon: BellIcon, label: "Inbox" },
  { id: "messages", icon: MessageSquareIcon, label: "Messages" },
];

const railLower: DualRailItem[] = [
  { id: "support", icon: HeadphonesIcon, label: "Support" },
  { id: "settings", icon: SettingsIcon, label: "Settings" },
];

const titles: Record<DualRailId, string> = {
  home: "Workspace",
  projects: "Projects",
  inbox: "Inbox",
  messages: "Messages",
  support: "Support",
  settings: "Settings",
};

const panelItems: Record<
  DualRailId,
  { label: string; items: { id: string; label: string; icon: AppSidebarIcon; href: string }[] }[]
> = {
  home: [
    {
      label: "",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboardIcon, href: "/dashboard" },
        { id: "employees", label: "Employees", icon: UsersIcon, href: "/employees" },
        { id: "clients", label: "Clients", icon: BriefcaseIcon, href: "/clients" },
        { id: "projects", label: "Projects", icon: FolderIcon, href: "/projects" },
      ],
    },
    {
      label: "Workforce",
      items: [
        { id: "calendar", label: "Calendar", icon: CalendarIcon, href: "/calendar" },
        { id: "attendance", label: "Attendance", icon: ClipboardListIcon, href: "/attendance" },
        { id: "mail", label: "Mail", icon: MailIcon, href: "/mail" },
        { id: "analytics", label: "Analytics", icon: ChartLineIcon, href: "/analytics" },
      ],
    },
  ],
  projects: [
    {
      label: "Pinned",
      items: [
        { id: "shift", label: "Shift Planner", icon: FolderIcon, href: "/projects/shift" },
        { id: "training", label: "Training Portal", icon: FolderIcon, href: "/projects/training" },
      ],
    },
    {
      label: "Recent",
      items: [
        {
          id: "onboarding",
          label: "Onboarding 2026",
          icon: FolderIcon,
          href: "/projects/onboarding",
        },
        { id: "hiring", label: "Q1 hiring plan", icon: FolderIcon, href: "/projects/hiring" },
      ],
    },
  ],
  inbox: [
    {
      label: "Today",
      items: [
        { id: "pto", label: "3 PTO requests pending", icon: InboxIcon, href: "/inbox/pto" },
        {
          id: "payroll",
          label: "Payroll cycle closes today",
          icon: BellIcon,
          href: "/inbox/payroll",
        },
      ],
    },
  ],
  messages: [
    {
      label: "Direct messages",
      items: [
        { id: "olivia", label: "Olivia Bennett", icon: UsersIcon, href: "/messages/olivia" },
        { id: "daniel", label: "Daniel Morgan", icon: UsersIcon, href: "/messages/daniel" },
      ],
    },
    {
      label: "Channels",
      items: [
        {
          id: "announcements",
          label: "# announcements",
          icon: MessageSquareIcon,
          href: "/messages/announcements",
        },
      ],
    },
  ],
  support: [
    {
      label: "Help center",
      items: [
        { id: "start", label: "Getting started", icon: FileTextIcon, href: "/support/start" },
        { id: "contact", label: "Contact support", icon: SendIcon, href: "/support/contact" },
      ],
    },
  ],
  settings: [
    {
      label: "Workspace",
      items: [
        { id: "general", label: "General", icon: SettingsIcon, href: "/settings/general" },
        { id: "members", label: "Members", icon: UsersIcon, href: "/settings/members" },
        { id: "billing", label: "Billing", icon: CreditCardIcon, href: "/settings/billing" },
        { id: "limits", label: "Limits", icon: GaugeIcon, href: "/settings/limits" },
      ],
    },
    {
      label: "Account",
      items: [
        { id: "security", label: "Security", icon: LockIcon, href: "/settings/security" },
        {
          id: "notifications",
          label: "Notifications",
          icon: BellIcon,
          href: "/settings/notifications",
        },
      ],
    },
  ],
};

export type AppSidebar05Props = AppSidebarLinkProps & {
  rail?: DualRailId;
  defaultRail?: DualRailId;
  onRailChange?: (id: DualRailId) => void;
  collapsible?: "offcanvas" | "icon" | "none";
};

const RailButton = ({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: ComponentChildren;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        type="button"
        aria-label={label}
        aria-current={active ? "page" : undefined}
        class={cn(
          "relative flex aspect-square size-9 items-center justify-center rounded-lg transition-colors",
          active
            ? "bg-sidebar-accent text-foreground"
            : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
        )}
        onClick={onClick}
      >
        {active ? (
          <span class="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-sidebar-primary" />
        ) : null}
        {children}
      </button>
    </TooltipTrigger>
    <TooltipContent side="right">{label}</TooltipContent>
  </Tooltip>
);

export const AppSidebar05 = ({
  rail,
  defaultRail = "home",
  onRailChange,
  collapsible = "icon",
  ...link
}: AppSidebar05Props) => {
  const { isMobile, state, setOpen } = useSidebar();
  const [uncontrolled, setUncontrolled] = useState(defaultRail);
  const active = rail ?? uncontrolled;

  const selectRail = (id: DualRailId) => {
    if (!isMobile && state === "expanded" && active === id) {
      setOpen(false);
      return;
    }
    if (rail === undefined) setUncontrolled(id);
    onRailChange?.(id);
    if (!isMobile) setOpen(true);
  };

  return (
    <Sidebar collapsible={collapsible} data-slot="block-app-sidebar-05">
      <div class="flex h-full w-full">
        <aside class="flex w-14 shrink-0 flex-col items-center gap-0.5 border-r border-sidebar-border py-2">
          <span class="mb-1 flex aspect-square size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <AppBrandMark />
          </span>
          {railUpper.map((item) => {
            const Icon = item.icon;
            return (
              <RailButton
                key={item.id}
                label={item.label}
                active={active === item.id}
                onClick={() => selectRail(item.id)}
              >
                <Icon size={16} aria-hidden="true" />
              </RailButton>
            );
          })}
          <div class="my-2 h-px w-7 bg-sidebar-border/70" />
          {railLower.map((item) => {
            const Icon = item.icon;
            return (
              <RailButton
                key={item.id}
                label={item.label}
                active={active === item.id}
                onClick={() => selectRail(item.id)}
              >
                <Icon size={16} aria-hidden="true" />
              </RailButton>
            );
          })}
          <div class="mt-auto flex flex-col items-center gap-1.5">
            <Avatar class="size-8">
              <AvatarFallback class="text-xs">JC</AvatarFallback>
            </Avatar>
          </div>
        </aside>
        <div class="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <AppBrandMark />
                  </div>
                  <span class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-bold">Kamod</span>
                    <span class="truncate text-muted-foreground text-xs">{titles[active]}</span>
                  </span>
                  <ChevronsUpDownIcon class="ml-auto size-4" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <AppSearchField id="app-sidebar-05-search" />
          </SidebarHeader>
          <SidebarContent>
            {panelItems[active].map((group) => (
              <SidebarGroup key={`${active}-${group.label || "main"}`}>
                {group.label ? <SidebarGroupLabel>{group.label}</SidebarGroupLabel> : null}
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = link.activeHref
                        ? item.href === link.activeHref
                        : item.id === "dashboard";
                      return (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton
                            isActive={isActive}
                            tooltip={item.label}
                            onClick={() =>
                              link.onNavigate?.({
                                id: item.id,
                                label: item.label,
                                href: item.href,
                                icon: item.icon,
                              })
                            }
                          >
                            <Icon aria-hidden="true" />
                            <span>{item.label}</span>
                            {active === "projects" && group.label === "Pinned" ? (
                              <StarIcon
                                class="ml-auto size-3.5 fill-current text-warning"
                                aria-hidden="true"
                              />
                            ) : null}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </div>
      </div>
    </Sidebar>
  );
};
