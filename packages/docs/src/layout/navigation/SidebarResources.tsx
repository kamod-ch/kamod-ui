import { KamodRepositories } from "./KamodRepositories";

/** Companion packages remain reachable below the scrolling directory. */
export function SidebarResources() {
  return (
    <div class="docs-sidebar-resources">
      <KamodRepositories />
    </div>
  );
}
