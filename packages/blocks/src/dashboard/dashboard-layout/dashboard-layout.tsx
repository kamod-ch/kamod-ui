import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Separator,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  ThemeToggle,
} from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { AppSidebar02, type AppSidebar02Props } from "../../app-sidebar/sidebar-02";
import { type BlockLinkComponent, renderBlockLink } from "../../shared";
import { CommandPalette } from "../command-palette";
import { NotificationsPopover } from "../notifications-popover";
import { ProfileMenu } from "../profile-menu";

export type DashboardBreadcrumbItem = {
  label: string;
  href?: string;
};

export type DashboardLayoutProps = AppSidebar02Props & {
  breadcrumbs?: DashboardBreadcrumbItem[];
  children?: ComponentChildren;
  themeSlot?: ComponentChildren;
  notificationsSlot?: ComponentChildren;
  profileSlot?: ComponentChildren;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCommandSelect?: AppSidebar02Props["onNavigate"];
  onProfileSelect?: (key: string) => void;
  linkComponent?: BlockLinkComponent;
};

const defaultBreadcrumbs: DashboardBreadcrumbItem[] = [
  { label: "Workspace", href: "/workspace" },
  { label: "Dashboard" },
];

export const DashboardLayout = ({
  breadcrumbs = defaultBreadcrumbs,
  children,
  themeSlot,
  notificationsSlot,
  profileSlot,
  open,
  defaultOpen = true,
  onOpenChange,
  onCommandSelect,
  onProfileSelect,
  linkComponent,
  ...sidebarProps
}: DashboardLayoutProps) => (
  <SidebarProvider
    defaultOpen={open === undefined ? defaultOpen : undefined}
    open={open}
    onOpenChange={onOpenChange}
    data-slot="block-dashboard-layout"
  >
    <AppSidebar02 {...sidebarProps} linkComponent={linkComponent} />
    <SidebarInset>
      <header class="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur">
        <SidebarTrigger />
        <Separator orientation="vertical" class="h-4" />
        <Breadcrumb class="min-w-0 flex-1">
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <span class="contents" key={`${item.label}-${index}`}>
                  {index > 0 ? <BreadcrumbSeparator class="hidden md:block" /> : null}
                  <BreadcrumbItem
                    class={index < breadcrumbs.length - 1 ? "hidden md:block" : undefined}
                  >
                    {isLast || !item.href ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        {renderBlockLink(linkComponent, { href: item.href, children: item.label })}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </span>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
        <div class="ml-auto flex items-center gap-1.5">
          <CommandPalette
            embedded
            showTrigger
            shortcut
            onSelect={(item) =>
              onCommandSelect?.({ id: item.id, label: item.label, href: `/${item.id}` })
            }
          />
          {themeSlot ?? <ThemeToggle />}
          {notificationsSlot ?? <NotificationsPopover embedded />}
          {profileSlot ?? <ProfileMenu embedded onSelect={onProfileSelect} />}
        </div>
      </header>
      <div class="flex-1 p-6">{children}</div>
    </SidebarInset>
  </SidebarProvider>
);
