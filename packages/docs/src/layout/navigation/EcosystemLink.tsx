import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { NavigationEntryLink } from "./NavigationEntryLink";

/** Keep the ecosystem guide reachable below the scrolling directory. */
export function EcosystemLink({
  pathname,
  closeOnNavigate = false,
}: {
  pathname: string;
  closeOnNavigate?: boolean;
}) {
  return (
    <nav class="docs-sidebar-ecosystem" aria-label="Kamod Ecosystem">
      <NavigationEntryLink
        pathname={pathname}
        href="/docs/ecosystem"
        title="Kamod Ecosystem"
        caption="Toolkit"
        icon={<BrandGithubIcon size={16} aria-hidden="true" />}
        help="ecosystem"
        className="docs-sidebar-ecosystem-heading"
        closeOnNavigate={closeOnNavigate}
      />
    </nav>
  );
}
