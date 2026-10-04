import { NavigationDirectory } from "./NavigationDirectory";
import { NavigationScrollArea } from "./NavigationScrollArea";
import { navigationGroups } from "./navigation-data";
import { SidebarResources } from "./SidebarResources";

/** Shared desktop directory, scroll memory and project links for either documentation layout. */
export function DocsSidebarNavigation({ pathname }: { pathname: string }) {
  return (
    <>
      <NavigationScrollArea mode="desktop" class="docs-sidebar-scroll">
        <NavigationDirectory groups={navigationGroups} pathname={pathname} />
      </NavigationScrollArea>
      <SidebarResources />
    </>
  );
}
