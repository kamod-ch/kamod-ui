import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@kamod-ch/ui";
import { settingsNav } from "../data/settings-data";

/** Self-contained page composition; replace its demo data and placeholder content locally. */
export const Sidebar13 = () => (
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
