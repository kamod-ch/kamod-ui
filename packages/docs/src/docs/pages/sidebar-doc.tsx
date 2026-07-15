import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  Separator,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@kamod-ch/ui";
import { createGenericDocPage } from "./create-generic-doc-page";

export const sidebarDocPage = createGenericDocPage({
  slug: "sidebar",
  title: "Sidebar",
  usageLabel: "Sidebar provides a collapsible application navigation rail.",
  installationText:
    "Import SidebarProvider and sidebar primitives from `@/components/kamod-ui/sidebar`.",
  usageText:
    "Wrap the layout in SidebarProvider, render Sidebar next to SidebarInset, and toggle with SidebarTrigger.",
  exampleSections: [
    {
      id: "basic-sidebar",
      title: "Basic Sidebar",
      text: "A sidebar with grouped navigation and an inset content area.",
      code: `import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger, Separator,
} from "@/components/kamod-ui/sidebar";

export const Example = () => (
  <SidebarProvider>
    <Sidebar>
      <SidebarHeader>Workspace</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Nav</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>Home</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
    <SidebarInset>
      <header class="flex h-12 items-center gap-2 border-b px-3">
        <SidebarTrigger />
        <Separator orientation="vertical" class="h-4" />
        <span class="text-sm">Dashboard</span>
      </header>
    </SidebarInset>
  </SidebarProvider>
);`,
      renderPreview: () => (
        <div class="h-72 w-full overflow-hidden rounded-lg border">
          <SidebarProvider class="min-h-0! h-full">
            <Sidebar collapsible="none" class="w-56 border-r">
              <SidebarHeader>Workspace</SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Nav</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton isActive>Home</SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>Inbox</SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
            <SidebarInset>
              <header class="flex h-12 items-center gap-2 border-b px-3">
                <SidebarTrigger />
                <Separator orientation="vertical" class="data-[orientation=vertical]:h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </header>
              <div class="p-4">
                <div class="aspect-video rounded-xl bg-muted/50" />
              </div>
            </SidebarInset>
          </SidebarProvider>
        </div>
      ),
    },
    {
      id: "sidebar-with-inset",
      title: "Sidebar With Inset",
      text: 'Use variant="inset" for a padded floating content panel.',
      code: `import { Sidebar, SidebarContent, SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/kamod-ui/sidebar";

export const Example = () => (
  <SidebarProvider>
    <Sidebar variant="inset">
      <SidebarContent>Menu</SidebarContent>
    </Sidebar>
    <SidebarInset>
      <header class="flex h-12 items-center gap-2 px-3">
        <SidebarTrigger />
      </header>
      Main content
    </SidebarInset>
  </SidebarProvider>
);`,
      renderPreview: () => (
        <div class="h-72 w-full overflow-hidden rounded-lg border bg-sidebar">
          <SidebarProvider class="min-h-0! h-full">
            <Sidebar collapsible="none" variant="inset" class="w-56">
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Menu</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton isActive>Overview</SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
            <SidebarInset>
              <header class="flex h-12 items-center gap-2 px-3">
                <SidebarTrigger />
              </header>
              <div class="p-4 pt-0">
                <div class="aspect-video rounded-xl bg-muted/50" />
              </div>
            </SidebarInset>
          </SidebarProvider>
        </div>
      ),
    },
  ],
  apiRows: [
    { prop: "SidebarProvider defaultOpen", type: "boolean", defaultValue: "true" },
    {
      prop: "Sidebar collapsible",
      type: '"offcanvas" | "icon" | "none"',
      defaultValue: '"offcanvas"',
    },
    {
      prop: "Sidebar variant",
      type: '"sidebar" | "floating" | "inset"',
      defaultValue: '"sidebar"',
    },
    { prop: "Sidebar side", type: '"left" | "right"', defaultValue: '"left"' },
    { prop: "SidebarTrigger", type: "toggle button", defaultValue: "recommended" },
  ],
  accessibilityText:
    "Ensure sidebar navigation remains keyboard reachable. SidebarTrigger includes an accessible label; on mobile the sidebar opens in a sheet dialog.",
});
