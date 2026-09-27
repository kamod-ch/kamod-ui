import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  Separator,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@kamod-ch/ui";
import { favorites } from "../data/favorites-data";
import { navigationItems } from "../data/navigation-data";
import { secondaryItems } from "../data/secondary-data";
import { teams } from "../data/teams-data";
import { NavActions } from "../shared/nav-actions";
import { NavFavorites } from "../shared/nav-favorites";
import { NavMain } from "../shared/nav-main";
import { NavSecondary } from "../shared/nav-secondary";
import { TeamSwitcher } from "../shared/team-switcher";

/** Self-contained page composition; replace its demo data and placeholder content locally. */
export const Sidebar10 = () => (
  <SidebarProvider>
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigationItems} />
        <NavFavorites items={favorites} />
        <NavSecondary items={secondaryItems} />
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
