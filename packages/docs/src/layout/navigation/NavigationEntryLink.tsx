import { ArrowUpRightIcon } from "@kamod-ch/icons/lucide";
import { SheetClose } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { withBasePath } from "../../base-path";
import { isNavigationCurrent } from "./navigation-data";
import { SidebarEntryContent } from "./SidebarEntryContent";

/** The two pinned entries share their geometry, current-page state and mobile close behavior. */
export function NavigationEntryLink({
  pathname,
  href,
  title,
  caption,
  icon,
  help,
  className,
  heading = false,
  closeOnNavigate = false,
}: {
  pathname: string;
  href: string;
  title: string;
  caption: string;
  icon: ComponentChildren;
  help: "getting-started" | "ecosystem";
  className: string;
  heading?: boolean;
  closeOnNavigate?: boolean;
}) {
  const target = withBasePath(href);
  const link = (
    <a
      class={`${className} sidebar-entry-row`}
      href={target}
      data-navigation-help={help}
      aria-current={isNavigationCurrent(pathname, target) ? "page" : undefined}
    >
      <SidebarEntryContent
        icon={icon}
        title={title}
        caption={caption}
        heading={heading ? "h2" : "strong"}
        action={
          <span class="sidebar-entry-action" aria-hidden="true">
            <ArrowUpRightIcon size={14} strokeWidth={1.75} />
          </span>
        }
      />
    </a>
  );
  return closeOnNavigate ? <SheetClose asChild>{link}</SheetClose> : link;
}
