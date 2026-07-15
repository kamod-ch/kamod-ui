import {
  CalendarIcon,
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
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
import { filesTree, stopNavigation } from "./shared/sample-data";
import { SearchForm } from "./shared/search-form";
import type { SidebarBlockVariant } from "./sidebar-data";

type SidebarBlockShellProps = { variant: SidebarBlockVariant };

const settingsNav = [
  { title: "General", icon: <SettingsIcon /> },
  { title: "Team", icon: <UsersIcon /> },
  { title: "Billing", icon: <InboxIcon /> },
  { title: "Limits", icon: <LayoutDashboardIcon /> },
];

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
      : variant.submenus || variant.collapsible
        ? ("submenus" as const)
        : ("docs" as const);

  const providerStyle = variant.floating
    ? ({ ["--sidebar-width" as string]: "19rem" } as Record<string, string>)
    : undefined;

  const headerClass = variant.iconMode
    ? "flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
    : variant.inset
      ? "flex h-16 shrink-0 items-center gap-2"
      : "flex h-16 shrink-0 items-center gap-2 border-b px-4";

  if (variant.iconMode || variant.inset) {
    return (
      <SidebarProvider>
        <AppSidebar
          mode="app"
          collapsible={variant.iconMode ? "icon" : "offcanvas"}
          variant={sidebarVariant}
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
      />
      <DashboardShell
        stickyHeader={Boolean(variant.collapsible && !variant.submenus)}
        headerClass={headerClass}
        placeholder={variant.collapsible && !variant.submenus ? "list" : "grid"}
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
      <DashboardShell breadcrumbParent="components" breadcrumbPage="button.tsx" />
    </SidebarProvider>
  );
};

const CalendarSidebarBlock = () => {
  const [date, setDate] = useState(12);
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
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
                <div class="mb-2 flex items-center justify-between px-1">
                  <span class="text-sm font-medium">October 2024</span>
                  <CalendarIcon class="size-4" />
                </div>
                <div class="grid grid-cols-7 gap-1 text-center text-xs">
                  {days.map((day) => (
                    <button
                      type="button"
                      key={day}
                      class={[
                        "rounded-md py-1",
                        date === day
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "hover:bg-sidebar-accent",
                      ].join(" ")}
                      onClick={() => setDate(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
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

const NestedSidebar = () => (
  <SidebarProvider style={{ ["--sidebar-width" as string]: "350px" }}>
    <Sidebar collapsible="icon" class="overflow-hidden">
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {[
                { title: "Inbox", icon: <InboxIcon /> },
                { title: "Home", icon: <HouseIcon /> },
                { title: "Team", icon: <UsersIcon /> },
              ].map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title} isActive={item.title === "Inbox"}>
                    {item.icon}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup class="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Recent</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {["Design System", "Release Notes", "Customer Feedback"].map((item) => (
                <SidebarMenuItem key={item}>
                  <SidebarMenuButton>{item}</SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    <DashboardShell
      breadcrumbParent="All Inboxes"
      breadcrumbPage="Inbox"
      stickyHeader
      placeholder="list"
    />
  </SidebarProvider>
);

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

const PopoverSidebar = () => {
  const [open, setOpen] = useState(false);
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <TeamSwitcher />
        </SidebarHeader>
        <SidebarContent>
          <NavMain />
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
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button size="sm" aria-expanded={open}>
                  Open sidebar popover
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-72 p-0" align="end">
                <Sidebar collapsible="none" class="w-full border-0">
                  <SidebarHeader>
                    <SearchForm />
                  </SidebarHeader>
                  <SidebarContent>
                    <SidebarGroup>
                      <SidebarGroupLabel>Favorites</SidebarGroupLabel>
                      <SidebarGroupContent>
                        <SidebarMenu>
                          {["Project Alpha", "Design System", "Roadmap"].map((item) => (
                            <SidebarMenuItem key={item}>
                              <SidebarMenuButton>{item}</SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </SidebarGroup>
                  </SidebarContent>
                </Sidebar>
              </PopoverContent>
            </Popover>
          </div>
        </header>
        <div class="flex flex-1 flex-col gap-4 px-4 py-10">
          <div class="mx-auto h-24 w-full max-w-3xl rounded-xl bg-muted/50" />
          <div class="mx-auto h-full w-full max-w-3xl rounded-xl bg-muted/50" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

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
    <AppSidebar mode="app" collapsible="icon" />
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
      <SidebarHeader>
        <SidebarGroupLabel>Calendar</SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <div class="grid grid-cols-7 gap-1 p-2 text-center text-xs">
              {Array.from({ length: 28 }, (_, i) => (
                <div key={i} class="rounded-md py-1 hover:bg-sidebar-accent">
                  {i + 1}
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  </SidebarProvider>
);

const StickyHeaderSidebar = () => (
  <div style={{ ["--header-height" as string]: "3.5rem" }}>
    <SidebarProvider class="flex flex-col">
      <header class="sticky top-0 z-50 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background px-4">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
        <strong class="text-sm font-medium">Kamod Cloud</strong>
        <nav class="ml-6 hidden gap-4 text-sm text-muted-foreground md:flex">
          <a href="#" onClick={stopNavigation}>
            Product
          </a>
          <a href="#" onClick={stopNavigation}>
            Docs
          </a>
          <a href="#" onClick={stopNavigation}>
            Support
          </a>
        </nav>
        <Button class="ml-auto" size="sm">
          Upgrade
        </Button>
      </header>
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
