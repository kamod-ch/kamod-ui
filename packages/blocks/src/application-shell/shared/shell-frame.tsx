import { LayoutSidebarRightIcon } from "@kamod-ch/icons/tabler/outline";
import { Button, cn, SidebarInset, SidebarProvider, SidebarTrigger } from "@kamod-ch/ui";
import { useId, useState } from "preact/hooks";
import { AppSidebar } from "../application-shell-1/app-sidebar";
import { NavUser } from "../application-shell-1/nav-user";
import { ShellBreadcrumbs } from "./shell-breadcrumbs";
import { ShellNavigation } from "./shell-navigation";
import type { ApplicationShellLayoutProps } from "./types";

export type ShellLayout =
  | "inset"
  | "rail"
  | "horizontal"
  | "right"
  | "inspector"
  | "sections"
  | "actions";

/** Shared interactions, with layout choices fixed by each public block entrypoint. */
export function ShellFrame({
  layout,
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
  headerActions,
  inspector,
  inspectorTitle = "Details",
  sectionLinks = [],
  sectionLabel = "Section navigation",
  footerStatus,
  footerActions,
  class: classProp,
  className,
}: ApplicationShellLayoutProps & { layout: ShellLayout }) {
  const [showInspector, setShowInspector] = useState(true);
  const inspectorId = useId();
  const horizontal = layout === "horizontal";
  const sidebar = (
    <AppSidebar
      brand={brand}
      navigationGroups={navigationGroups}
      user={user}
      currentPath={currentPath}
      onNavigate={onNavigate}
      onUserAction={onUserAction}
      side={layout === "right" ? "right" : "left"}
      variant={layout === "inset" ? "inset" : "sidebar"}
    />
  );
  const brandContent = (
    <>
      {brand.logo && (
        <span class="shrink-0" aria-hidden="true">
          {brand.logo}
        </span>
      )}
      <span class="truncate">{brand.name}</span>
    </>
  );
  return (
    <SidebarProvider
      open={open}
      defaultOpen={defaultOpen ?? layout !== "rail"}
      onOpenChange={onOpenChange}
      data-application-shell={layout}
      class={cn(
        "min-w-0 bg-background text-foreground motion-reduce:[&_*]:transition-none! motion-reduce:[&_*]:animate-none!",
        layout === "inset" && "bg-sidebar",
        classProp,
        className,
      )}
    >
      {layout !== "right" && (horizontal ? <div class="md:hidden">{sidebar}</div> : sidebar)}
      <SidebarInset class="min-w-0">
        <header class="flex min-h-16 flex-wrap items-center gap-3 border-b px-4 py-3">
          <SidebarTrigger class={horizontal ? "md:hidden" : ""} />
          {horizontal &&
            (brand.href ? (
              <a
                href={brand.href}
                class="flex min-w-0 max-w-full items-center gap-2 text-base font-semibold"
                onClick={(event) => onNavigate?.({ label: brand.name, href: brand.href }, event)}
              >
                {brandContent}
              </a>
            ) : (
              <span class="flex min-w-0 max-w-full items-center gap-2 text-base font-semibold">
                {brandContent}
              </span>
            ))}
          <ShellBreadcrumbs breadcrumbs={breadcrumbs} onNavigate={onNavigate} />
          <div class="ml-auto flex max-w-full flex-wrap items-center gap-2">
            {headerActions}
            {layout === "inspector" && inspector && (
              <Button
                variant="outline"
                size="sm"
                aria-expanded={showInspector}
                aria-controls={inspectorId}
                onClick={() => setShowInspector((value) => !value)}
              >
                <LayoutSidebarRightIcon
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  size={15}
                  aria-hidden="true"
                />
                {inspectorTitle}
              </Button>
            )}
            {horizontal && (
              <div class="hidden w-48 md:block">
                <NavUser user={user} onUserAction={onUserAction} />
              </div>
            )}
          </div>
        </header>
        {horizontal && (
          <ShellNavigation
            groups={navigationGroups}
            currentPath={currentPath}
            onNavigate={onNavigate}
          />
        )}
        {layout === "sections" && sectionLinks.length > 0 && (
          <ShellNavigation
            links={sectionLinks}
            label={sectionLabel}
            currentPath={currentPath}
            onNavigate={onNavigate}
          />
        )}
        <div
          class={cn(
            "grid min-w-0 flex-1",
            layout === "inspector" &&
              inspector &&
              showInspector &&
              "lg:grid-cols-[minmax(0,1fr)_18rem]",
          )}
        >
          <div class={cn("min-w-0 p-4 sm:p-6", horizontal && "mx-auto w-full max-w-6xl")}>
            {children}
          </div>
          {layout === "inspector" && inspector && showInspector && (
            <aside
              id={inspectorId}
              aria-label={inspectorTitle}
              class="min-w-0 border-t bg-muted/20 p-4 lg:border-t-0 lg:border-l"
            >
              <h2 class="mb-4 text-sm font-semibold">{inspectorTitle}</h2>
              {inspector}
            </aside>
          )}
        </div>
        {layout === "actions" && (footerStatus || footerActions) && (
          <footer
            aria-label="Page actions"
            class="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 border-t bg-background px-4 py-3 sm:px-6"
          >
            {footerStatus && (
              <div class="min-w-0 text-sm text-muted-foreground">{footerStatus}</div>
            )}
            {footerActions && (
              <div class="ml-auto flex max-w-full flex-wrap items-center gap-2">
                {footerActions}
              </div>
            )}
          </footer>
        )}
      </SidebarInset>
      {layout === "right" && sidebar}
    </SidebarProvider>
  );
}
