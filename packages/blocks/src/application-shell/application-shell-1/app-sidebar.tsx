/**
 * @file Sidebar composition for Application Shell 1: brand, navigation and account menu.
 * Shares the shell's SidebarProvider and delegates its responsive layout to Kamod UI.
 */
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@kamod-ch/ui";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import type { ApplicationShell1Props, ApplicationShellNavigate } from "./types";

/**
 * Composes the shell's icon-collapsible sidebar and closes its mobile sheet on selection.
 * The brand remains named when collapsed and is a link only when an `href` is supplied.
 *
 * @param props - Brand, navigation and account data plus the shell's activation callbacks.
 * @remarks Must render within SidebarProvider; used internally by ApplicationShell1.
 */
export const AppSidebar = ({
  brand,
  navigationGroups,
  user,
  currentPath,
  onNavigate,
  onUserAction,
}: Pick<
  ApplicationShell1Props,
  "brand" | "navigationGroups" | "user" | "currentPath" | "onNavigate" | "onUserAction"
>) => {
  const { state, isMobile, setOpenMobile } = useSidebar();
  /** Forwards a selection, then dismisses mobile navigation for an ordinary primary click. */
  const navigate: ApplicationShellNavigate = (destination, event) => {
    onNavigate?.(destination, event);
    // Router preventDefault() still means a selection; modifier clicks keep the sheet open.
    if (
      isMobile &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey &&
      event.button === 0
    )
      setOpenMobile(false);
  };
  const brandContent = (
    <>
      <span
        class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent/50 text-sidebar-foreground [&>svg]:size-4"
        aria-hidden="true"
      >
        {brand.logo ?? brand.name.slice(0, 1)}
      </span>
      <span class="grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
        <span class="truncate font-semibold">{brand.name}</span>
        {brand.description && <span class="truncate text-xs">{brand.description}</span>}
      </span>
    </>
  );
  // The mobile Sheet portals outside the provider wrapper, so motion overrides live here too.
  // Important utilities also override the primitives' state-specific animation rules.
  return (
    <Sidebar
      collapsible="icon"
      class="motion-reduce:transition-none! motion-reduce:animate-none! motion-reduce:[&_*]:transition-none! motion-reduce:[&_*]:animate-none!"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip={state === "collapsed" && !isMobile ? brand.name : undefined}
              class="group-data-[collapsible=icon]:p-0!"
            >
              {brand.href ? (
                <a
                  href={brand.href}
                  aria-label={brand.name}
                  onClick={(event) => navigate({ label: brand.name, href: brand.href }, event)}
                >
                  {brandContent}
                </a>
              ) : (
                <div aria-label={brand.name}>{brandContent}</div>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      {/* Portaled icon menus let navigation scroll without covering the account footer. */}
      <SidebarContent class="group-data-[collapsible=icon]:overflow-auto">
        <NavMain
          navigationGroups={navigationGroups}
          currentPath={currentPath}
          onNavigate={navigate}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} onUserAction={onUserAction} />
      </SidebarFooter>
      <SidebarRail aria-label="Toggle sidebar with rail" />
    </Sidebar>
  );
};
