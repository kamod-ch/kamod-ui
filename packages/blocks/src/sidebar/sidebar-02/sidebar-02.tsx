import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarRail } from "@kamod-ch/ui";
import { docsNavData } from "../data/docs-data";
import { DashboardShell } from "../shared/dashboard-shell";
import { NavDocs } from "../shared/nav-docs";
import { SearchForm } from "../shared/search-form";
import { VersionSwitcher } from "../shared/version-switcher";

/** Self-contained page composition; replace its demo data and placeholder content locally. */
export const Sidebar02 = () => (
  <SidebarProvider>
    <Sidebar>
      <SidebarHeader>
        <VersionSwitcher
          versions={docsNavData.versions}
          defaultVersion={docsNavData.versions[0]!}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <NavDocs groups={docsNavData.navMain} collapsibleSections />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
    <DashboardShell stickyHeader placeholder="list" />
  </SidebarProvider>
);
