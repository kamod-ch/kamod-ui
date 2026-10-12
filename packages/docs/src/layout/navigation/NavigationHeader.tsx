import { RocketIcon } from "@kamod-ch/icons/tabler/outline";
import { NavigationEntryLink } from "./NavigationEntryLink";

/** A full-row guide entry shared by the sidebar and responsive directory. */
export function NavigationHeader({
  pathname,
  closeOnNavigate = false,
}: {
  pathname: string;
  closeOnNavigate?: boolean;
}) {
  return (
    <div class="navigation-header">
      <NavigationEntryLink
        pathname={pathname}
        href="/docs/getting-started"
        title="Getting Started"
        caption="Guide"
        icon={<RocketIcon size={16} strokeWidth={1.8} aria-hidden="true" />}
        help="getting-started"
        className="navigation-header-link"
        heading
        closeOnNavigate={closeOnNavigate}
      />
    </div>
  );
}
