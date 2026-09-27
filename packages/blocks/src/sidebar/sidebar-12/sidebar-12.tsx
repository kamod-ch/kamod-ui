import {
  Calendar,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarProvider,
  SidebarRail,
} from "@kamod-ch/ui";
import { useState } from "preact/hooks";
import { user } from "../data/user-data";
import { DashboardShell } from "../shared/dashboard-shell";
import { NavUser } from "../shared/nav-user";

/** Self-contained page composition; replace its demo data and placeholder content locally. */
export const Sidebar12 = () => {
  const [date, setDate] = useState(new Date(2024, 9, 12));
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <NavUser user={user} />
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
