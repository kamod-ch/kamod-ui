import { NavigationDirectory } from "./NavigationDirectory";
import { NavigationHeader } from "./NavigationHeader";
import { NavigationScrollArea } from "./NavigationScrollArea";
import { navigationGroups } from "./navigation-data";
import { SidebarResources } from "./SidebarResources";

/** One sidebar composition; each presentation keeps its own scroll/expansion memory. */
export function DocsSidebarNavigation({
  pathname,
  mode = "desktop",
}: {
  pathname: string;
  mode?: "desktop" | "mobile";
}) {
  const mobile = mode === "mobile";
  return (
    <>
      <NavigationScrollArea
        mode={mode}
        pathname={pathname}
        class={mobile ? "site-navigation-body" : "docs-sidebar-scroll"}
      >
        <NavigationHeader pathname={pathname} closeOnNavigate={mobile} />
        <NavigationDirectory
          groups={navigationGroups}
          pathname={pathname}
          closeOnNavigate={mobile}
        />
      </NavigationScrollArea>
      <SidebarResources pathname={pathname} closeOnNavigate={mobile} />
    </>
  );
}
