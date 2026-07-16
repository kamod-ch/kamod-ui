import {
  ChevronDownIcon,
  FileIcon,
  FolderIcon,
  HouseIcon,
  InboxIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UsersIcon,
} from "@kamod-ch/icons/lucide";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Calendar,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Separator,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import { AppSidebar } from "./shared/app-sidebar";
import { DashboardShell } from "./shared/dashboard-shell";
import { NavMain, NavUser, TeamSwitcher } from "./shared/nav";
import { NavActions } from "./shared/nav-actions";
import { NavFavorites } from "./shared/nav-favorites";
import { NavSecondary } from "./shared/nav-secondary";
import { filesTree, stopNavigation } from "./shared/sample-data";
import { SiteHeader } from "./shared/site-header";
import type { SidebarBlockLayout, SidebarBlockVariant } from "./sidebar-data";

type SidebarBlockShellProps = { variant: SidebarBlockVariant };

const settingsNav = [
  { title: "General", icon: <SettingsIcon /> },
  { title: "Team", icon: <UsersIcon /> },
  { title: "Billing", icon: <InboxIcon /> },
  { title: "Limits", icon: <LayoutDashboardIcon /> },
];

const defaultLayout: SidebarBlockLayout = {
  headerClass: "flex h-16 shrink-0 items-center gap-2 border-b px-4",
  placeholder: "grid",
  contentPaddingTop: true,
};

const resolveLayout = (variant: SidebarBlockVariant): SidebarBlockLayout => ({
  ...defaultLayout,
  ...variant.layout,
});

export const SidebarBlockShell = ({ variant }: SidebarBlockShellProps) => {
  if (variant.dialog) return <DialogSidebar />;
  if (variant.popover) return <PopoverSidebar />;
  if (variant.stickyHeader) return <StickyHeaderSidebar />;
  if (variant.dual) return <DualSidebar />;
  if (variant.right && !variant.dual) return <RightSidebar />;
  if (variant.nested) return <NestedSidebar />;
  if (variant.fileTree) return <FileTreeSidebar />;
  if (variant.calendar) return <CalendarSidebarBlock />;

  const collapsible = variant.iconMode
    ? ("icon" as const)
    : variant.floating
      ? ("none" as const)
      : ("offcanvas" as const);
  const sidebarVariant = variant.floating
    ? ("floating" as const)
    : variant.inset
      ? ("inset" as const)
      : ("sidebar" as const);

  const mode =
    variant.iconMode || variant.inset
      ? ("app" as const)
      : variant.dropdowns
        ? ("dropdowns" as const)
        : variant.submenus
          ? ("submenus" as const)
          : ("docs" as const);

  const layout = resolveLayout(variant);

  const providerStyle = variant.floating
    ? ({ ["--sidebar-width" as string]: "19rem" } as Record<string, string>)
    : undefined;

  const headerClass = variant.iconMode
    ? "flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
    : variant.inset
      ? "flex h-16 shrink-0 items-center gap-2"
      : (layout.headerClass ?? defaultLayout.headerClass);

  if (variant.iconMode || variant.inset) {
    return (
      <SidebarProvider>
        <AppSidebar
          mode="app"
          collapsible={variant.iconMode ? "icon" : "offcanvas"}
          variant={sidebarVariant}
          showSecondaryNav={variant.showSecondaryNav ?? variant.inset}
        />
        <DashboardShell showHeader={false}>
          <header class={headerClass}>
            <div class="flex items-center gap-2 px-4">
              <SidebarTrigger class="-ml-1" />
              <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem class="hidden md:block">
                    <BreadcrumbLink href="#">Build Your Application</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator class="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div class="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div class="grid auto-rows-min gap-4 md:grid-cols-3">
              <div class="aspect-video rounded-xl bg-muted/50" />
              <div class="aspect-video rounded-xl bg-muted/50" />
              <div class="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          </div>
        </DashboardShell>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider style={providerStyle}>
      <AppSidebar
        mode={mode}
        collapsible={collapsible === "none" ? "offcanvas" : collapsible}
        variant={sidebarVariant}
        collapsibleSections={variant.collapsibleSections}
        collapsibleSubmenus={variant.collapsibleSubmenus}
        showSearchForm={variant.showSearchForm}
        showOptInForm={variant.showOptInForm}
      />
      <DashboardShell
        stickyHeader={layout.stickyHeader}
        headerClass={headerClass}
        placeholder={layout.placeholder}
        breadcrumbs={layout.breadcrumbs}
        triggerClass={layout.triggerClass}
        headerInner={layout.headerInner}
        contentClass={layout.contentClass}
        contentPaddingTop={layout.contentPaddingTop}
      />
    </SidebarProvider>
  );
};

const FileTreeSidebar = () => {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({ app: true });
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <FolderIcon class="size-4" />
                </div>
                <div class="flex flex-col gap-0.5 leading-none">
                  <span class="font-medium">Files</span>
                  <span class="text-xs">workspace</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Explorer</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filesTree.map((folder) => (
                  <Collapsible
                    key={folder.name}
                    open={Boolean(openFolders[folder.name])}
                    onOpenChange={(next) =>
                      setOpenFolders((current) => ({ ...current, [folder.name]: next }))
                    }
                    class="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <FolderIcon />
                          <span>{folder.name}</span>
                          <ChevronDownIcon class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {folder.items.map((file) => (
                            <SidebarMenuSubItem key={file}>
                              <SidebarMenuSubButton href="#" onClick={stopNavigation}>
                                <FileIcon />
                                <span>{file}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <DashboardShell
        breadcrumbs={[
          { label: "components", href: "#", hiddenOnMobile: true },
          { label: "ui", href: "#", hiddenOnMobile: true },
          { label: "button.tsx" },
        ]}
      />
    </SidebarProvider>
  );
};

const CalendarSidebarBlock = () => {
  const [date, setDate] = useState(new Date(2024, 9, 12));
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <NavUser />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Calendars</SidebarGroupLabel>
            <SidebarGroupContent>
              <div class="rounded-lg border border-sidebar-border p-2">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(next) => {
                    if (next instanceof Date) setDate(next);
                  }}
                  size="sm"
                  class="w-full"
                />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <DashboardShell
        breadcrumbParent=""
        breadcrumbPage="October 2024"
        stickyHeader
        placeholder="squares"
      />
    </SidebarProvider>
  );
};

const NestedSidebar = () => {
  const [activeItem, setActiveItem] = useState("Inbox");
  const inboxItems = [
    "Alice Johnson",
    "Marketing Team",
    "Product Launch",
    "Weekly Standup",
    "Design Review",
  ];

  return (
    <SidebarProvider style={{ ["--sidebar-width" as string]: "350px" }}>
      <Sidebar collapsible="icon" class="overflow-hidden *:data-[sidebar=sidebar]:flex-row">
        <Sidebar collapsible="none" class="w-[calc(var(--sidebar-width-icon)+1px)]! border-r">
          <SidebarHeader>
            <TeamSwitcher />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {[
                    { title: "Inbox", icon: <InboxIcon /> },
                    { title: "Drafts", icon: <HouseIcon /> },
                    { title: "Sent", icon: <UsersIcon /> },
                  ].map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={item.title === activeItem}
                        onClick={() => setActiveItem(item.title)}
                      >
                        {item.icon}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <NavUser />
          </SidebarFooter>
        </Sidebar>
        <Sidebar collapsible="none" class="hidden flex-1 md:flex">
          <SidebarHeader class="border-b p-4">
            <strong class="text-sm font-medium">{activeItem}</strong>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {inboxItems.map((item) => (
                    <SidebarMenuItem key={item}>
                      <SidebarMenuButton>{item}</SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarRail />
      </Sidebar>
      <DashboardShell
        breadcrumbParent="All Inboxes"
        breadcrumbPage="Inbox"
        stickyHeader
        headerClass="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4"
        placeholder="list"
      />
    </SidebarProvider>
  );
};

const DialogSidebar = () => (
  <div class="flex h-svh items-center justify-center">
    <Dialog>
      <Button asChild>
        <DialogTrigger>Open settings</DialogTrigger>
      </Button>
      <DialogContent class="max-w-4xl overflow-hidden p-0 md:max-h-[500px]">
        <DialogHeader class="sr-only">
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <SidebarProvider class="items-start">
          <Sidebar collapsible="none" class="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {settingsNav.map((item, index) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton isActive={index === 0}>
                          {item.icon}
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main class="flex h-[480px] flex-1 flex-col overflow-hidden">
            <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>Settings</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <div class="flex flex-1 flex-col gap-4 overflow-auto p-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} class="aspect-video h-12 w-full rounded-lg bg-muted/50" />
              ))}
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  </div>
);

const PopoverSidebar = () => (
  <SidebarProvider>
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
        <NavFavorites />
        <NavSecondary />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
    <SidebarInset>
      <header class="flex h-14 shrink-0 items-center gap-2">
        <div class="flex flex-1 items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage class="line-clamp-1">
                  Project Management & Task Tracking
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div class="ml-auto px-3">
          <NavActions />
        </div>
      </header>
      <div class="flex flex-1 flex-col gap-4 px-4 py-10">
        <div class="mx-auto h-24 w-full max-w-3xl rounded-xl bg-muted/50" />
        <div class="mx-auto h-full w-full max-w-3xl rounded-xl bg-muted/50" />
      </div>
    </SidebarInset>
  </SidebarProvider>
);

const RightSidebar = () => (
  <SidebarProvider>
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem class="hidden md:block">
              <BreadcrumbLink href="#">Build Your Application</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator class="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <SidebarTrigger class="-mr-1 ml-auto rotate-180" />
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4">
        <div class="grid auto-rows-min gap-4 md:grid-cols-3">
          <div class="aspect-video rounded-xl bg-muted/50" />
          <div class="aspect-video rounded-xl bg-muted/50" />
          <div class="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </SidebarInset>
    <AppSidebar side="right" mode="docs" />
  </SidebarProvider>
);

const DualSidebar = () => (
  <SidebarProvider>
    <AppSidebar mode="app" collapsible="icon" showSecondaryNav />
    <SidebarInset>
      <header class="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
        <div class="flex flex-1 items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage class="line-clamp-1">
                  Project Management & Task Tracking
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div class="flex flex-1 flex-col gap-4 p-4">
        <div class="mx-auto h-24 w-full max-w-3xl rounded-xl bg-muted/50" />
        <div class="mx-auto h-[100vh] w-full max-w-3xl rounded-xl bg-muted/50" />
      </div>
    </SidebarInset>
    <Sidebar side="right" collapsible="none" class="sticky top-0 hidden h-svh border-l md:flex">
      <SidebarHeader class="p-4">
        <SidebarGroupLabel>October 2024</SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <Calendar mode="single" size="sm" class="p-2" />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  </SidebarProvider>
);

const StickyHeaderSidebar = () => (
  <div class="[--header-height:calc(--spacing(14))]">
    <SidebarProvider class="flex flex-col">
      <SiteHeader />
      <div class="flex flex-1">
        <AppSidebar
          mode="app"
          class="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
        />
        <SidebarInset>
          <div class="flex flex-1 flex-col gap-4 p-4">
            <div class="grid auto-rows-min gap-4 md:grid-cols-3">
              <div class="aspect-video rounded-xl bg-muted/50" />
              <div class="aspect-video rounded-xl bg-muted/50" />
              <div class="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  </div>
);
