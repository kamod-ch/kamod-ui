import { ArrowUpRightIcon } from "@kamod-ch/icons/lucide";
import { RocketIcon } from "@kamod-ch/icons/tabler/outline";
import { SheetClose } from "@kamod-ch/ui";
import { withBasePath } from "../../base-path";

/** A full-row guide entry shared by the sidebar and responsive directory. */
export function NavigationHeader({
  pathname,
  closeOnNavigate = false,
}: {
  pathname: string;
  closeOnNavigate?: boolean;
}) {
  const href = withBasePath("/docs/getting-started");
  const link = (
    <a
      class="navigation-header-link sidebar-entry-row"
      href={href}
      data-navigation-help="getting-started"
      aria-current={pathname.replace(/\/$/, "") === href ? "page" : undefined}
    >
      <RocketIcon size={16} strokeWidth={1.8} aria-hidden="true" />
      <div class="navigation-header-heading sidebar-entry-heading">
        <h2 class="sidebar-entry-title">Getting Started</h2>
        <span class="sidebar-entry-caption">
          <span aria-hidden="true">·</span> Guide
        </span>
      </div>
      <span class="sidebar-entry-action" aria-hidden="true">
        <ArrowUpRightIcon size={14} strokeWidth={1.75} />
      </span>
    </a>
  );
  return (
    <div class="navigation-header">
      {closeOnNavigate ? <SheetClose asChild>{link}</SheetClose> : link}
    </div>
  );
}
