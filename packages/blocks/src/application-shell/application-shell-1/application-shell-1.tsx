/**
 * @file Responsive application frame composed from Kamod sidebar and breadcrumb primitives.
 * Demo data and documentation controls live outside this reusable block.
 * @see https://www.shadcnblocks.com/block/application-shell1 — design reference.
 */
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  cn,
  Separator,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@kamod-ch/ui";
import { Fragment } from "preact";
import { AppSidebar } from "./app-sidebar";
import type { ApplicationShell1Props } from "./types";

/**
 * Renders grouped navigation, an account menu, a breadcrumb header and page content.
 * The included SidebarProvider owns desktop collapse and the independent mobile sheet.
 * Routing and account actions remain with the caller; links work without a router hook.
 *
 * @param props - Shell content, callbacks and optional desktop state; see {@link ApplicationShell1Props}.
 * @returns The sidebar and a `main` landmark containing the header and children.
 * @example
 * ```tsx
 * <ApplicationShell1
 *   brand={{ name: "Acme", href: "/" }}
 *   navigationGroups={[{
 *     id: "workspace",
 *     items: [{ id: "overview", label: "Overview", href: "/overview" }],
 *   }]}
 *   user={{ name: "Alex Morgan", email: "alex@example.com" }}
 *   breadcrumbs={[{ label: "Workspace", href: "/" }, { label: "Overview" }]}
 *   currentPath="/overview"
 * >
 *   <h1>Overview</h1>
 * </ApplicationShell1>
 * ```
 */
export const ApplicationShell1 = ({
  brand,
  navigationGroups,
  user,
  breadcrumbs,
  children,
  currentPath,
  onNavigate,
  onUserAction,
  open,
  defaultOpen,
  onOpenChange,
  class: classProp,
  className,
}: ApplicationShell1Props) => (
  <SidebarProvider
    data-application-shell="1"
    open={open}
    defaultOpen={defaultOpen}
    onOpenChange={onOpenChange}
    class={cn(
      "min-w-0 bg-background text-foreground motion-reduce:[&_*]:transition-none! motion-reduce:[&_*]:animate-none!",
      classProp,
      className,
    )}
  >
    <AppSidebar
      brand={brand}
      navigationGroups={navigationGroups}
      user={user}
      currentPath={currentPath}
      onNavigate={onNavigate}
      onUserAction={onUserAction}
    />
    {/* SidebarInset supplies the main landmark; children need no additional main wrapper. */}
    <SidebarInset class="min-w-0">
      <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb class="min-w-0">
          <BreadcrumbList class="flex-nowrap">
            {breadcrumbs.map((crumb, index) => {
              // The final crumb stays visible on narrow screens and never links to itself.
              const current = index === breadcrumbs.length - 1;
              return (
                <Fragment key={`${index}-${crumb.label}`}>
                  {index > 0 && <BreadcrumbSeparator class="hidden shrink-0 md:block" />}
                  <BreadcrumbItem class={cn("min-w-0", !current && "hidden md:inline-flex")}>
                    {current ? (
                      <BreadcrumbPage class="truncate">{crumb.label}</BreadcrumbPage>
                    ) : crumb.href ? (
                      <BreadcrumbLink
                        href={crumb.href}
                        class="truncate"
                        onClick={(event) => onNavigate?.(crumb, event)}
                      >
                        {crumb.label}
                      </BreadcrumbLink>
                    ) : (
                      <span class="truncate">{crumb.label}</span>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div class="flex min-w-0 flex-1 flex-col gap-4 p-4">{children}</div>
    </SidebarInset>
  </SidebarProvider>
);
