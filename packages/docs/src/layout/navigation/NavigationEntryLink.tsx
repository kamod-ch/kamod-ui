import { ArrowUpRightIcon } from "@kamod-ch/icons/lucide";
import { SheetClose } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { withBasePath } from "../../base-path";
import { isNavigationCurrent } from "./navigation-data";

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
  const Title = heading ? "h2" : "strong";
  const link = (
    <a
      class={`${className} sidebar-entry-row`}
      href={target}
      data-navigation-help={help}
      aria-current={isNavigationCurrent(pathname, target) ? "page" : undefined}
    >
      {icon}
      <div class="navigation-header-heading sidebar-entry-heading">
        <Title class="sidebar-entry-title">{title}</Title>
        <span class="sidebar-entry-caption">
          <span aria-hidden="true">·</span> {caption}
        </span>
      </div>
      <span class="sidebar-entry-action" aria-hidden="true">
        <ArrowUpRightIcon size={14} strokeWidth={1.75} />
      </span>
    </a>
  );
  return closeOnNavigate ? <SheetClose asChild>{link}</SheetClose> : link;
}
