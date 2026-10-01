import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@kamod-ch/ui";
import { docsNavData } from "../data/docs-data";
import { NavDocs } from "../shared/nav-docs";
import { SearchForm } from "../shared/search-form";
import { VersionSwitcher } from "../shared/version-switcher";

/** Self-contained page composition; replace its demo data and placeholder content locally. */
export const Sidebar14 = () => (
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
    <Sidebar side="right">
      <SidebarHeader>
        <VersionSwitcher
          versions={docsNavData.versions}
          defaultVersion={docsNavData.versions[0]!}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <NavDocs groups={docsNavData.navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  </SidebarProvider>
);
