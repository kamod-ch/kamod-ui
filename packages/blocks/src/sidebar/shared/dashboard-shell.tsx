import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Separator,
  SidebarInset,
  SidebarTrigger,
} from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";

export type DashboardShellProps = {
  children?: ComponentChildren;
  breadcrumbParent?: string;
  breadcrumbPage?: string;
  headerClass?: string;
  stickyHeader?: boolean;
  showHeader?: boolean;
  placeholder?: "grid" | "list" | "squares" | "centered";
};

const PlaceholderContent = ({ kind }: { kind: DashboardShellProps["placeholder"] }) => {
  if (kind === "list") {
    return (
      <div class="flex flex-1 flex-col gap-4 p-4">
        {Array.from({ length: 24 }).map((_, index) => (
          <div key={index} class="aspect-video h-12 w-full rounded-lg bg-muted/50" />
        ))}
      </div>
    );
  }
  if (kind === "squares") {
    return (
      <div class="flex flex-1 flex-col gap-4 p-4">
        <div class="grid auto-rows-min gap-4 md:grid-cols-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} class="aspect-square rounded-xl bg-muted/50" />
          ))}
        </div>
      </div>
    );
  }
  if (kind === "centered") {
    return (
      <div class="flex flex-1 flex-col gap-4 px-4 py-10">
        <div class="mx-auto h-24 w-full max-w-3xl rounded-xl bg-muted/50" />
        <div class="mx-auto h-full w-full max-w-3xl rounded-xl bg-muted/50" />
      </div>
    );
  }
  return (
    <div class="flex flex-1 flex-col gap-4 p-4">
      <div class="grid auto-rows-min gap-4 md:grid-cols-3">
        <div class="aspect-video rounded-xl bg-muted/50" />
        <div class="aspect-video rounded-xl bg-muted/50" />
        <div class="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div class="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
};

export const DashboardShell = ({
  children,
  breadcrumbParent = "Build Your Application",
  breadcrumbPage = "Data Fetching",
  headerClass = "flex h-16 shrink-0 items-center gap-2 border-b px-4",
  stickyHeader = false,
  showHeader = true,
  placeholder = "grid",
}: DashboardShellProps) => (
  <SidebarInset>
    {showHeader ? (
      <header
        class={[headerClass, stickyHeader ? "sticky top-0 z-10 bg-background" : ""]
          .filter(Boolean)
          .join(" ")}
      >
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbParent ? (
              <>
                <BreadcrumbItem class="hidden md:block">
                  <BreadcrumbLink href="#">{breadcrumbParent}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator class="hidden md:block" />
              </>
            ) : null}
            <BreadcrumbItem>
              <BreadcrumbPage>{breadcrumbPage}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
    ) : null}
    {children ?? <PlaceholderContent kind={placeholder} />}
  </SidebarInset>
);
