import { EcosystemLink } from "./EcosystemLink";

/** Companion packages remain reachable below the scrolling directory. */
export function SidebarResources({
  pathname,
  closeOnNavigate = false,
}: {
  pathname: string;
  closeOnNavigate?: boolean;
}) {
  return (
    <div class="docs-sidebar-resources">
      <EcosystemLink pathname={pathname} closeOnNavigate={closeOnNavigate} />
    </div>
  );
}
