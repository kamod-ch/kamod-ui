/** Descriptive detail headings; compact registry names remain in cards and breadcrumbs. */
import type { LoginBlockId, SignupBlockId } from "@kamod-ch/blocks";
import type { SidebarBlockId } from "../../../blocks/src/sidebar/sidebar-data";
import type { BlockOverviewEntry } from "./block-categories";
import { getBlockDisplayName } from "./block-overview-details";

const subtitles: Record<SidebarBlockId | LoginBlockId | SignupBlockId, string> = {
  "sidebar-01": "Documentation sidebar with grouped navigation",
  "sidebar-02": "Collapsible sections with a sticky breadcrumb header",
  "sidebar-03": "Workspace navigation with expanded submenus",
  "sidebar-04": "Floating sidebar with nested navigation",
  "sidebar-05": "Searchable navigation with collapsible submenus",
  "sidebar-06": "Dropdown navigation with a newsletter form",
  "sidebar-07": "Collapsible icon rail with workspace navigation",
  "sidebar-08": "Inset workspace with secondary navigation",
  "sidebar-09": "Nested navigation with an inbox panel",
  "sidebar-10": "Favorites sidebar with dropdown action menus",
  "sidebar-11": "File navigation with an expandable folder tree",
  "sidebar-12": "Calendar sidebar with date navigation",
  "sidebar-13": "Settings dialog with sidebar navigation",
  "sidebar-14": "Right-side documentation navigation",
  "sidebar-15": "Dual sidebars with a calendar utility panel",
  "sidebar-16": "Workspace sidebar beneath a sticky site header",
  "login-01": "Centered login form with social sign-in",
  "login-02": "Split-screen login with a cover image",
  "login-03": "Login card on a muted background",
  "login-04": "Split login card with an image panel",
  "login-05": "Email-only sign-in with social providers",
  "signup-01": "Centered registration form with terms consent",
  "signup-02": "Split-screen registration with a cover image",
  "signup-03": "Branded signup card on a muted background",
  "signup-04": "Split signup card with an image panel",
  "signup-05": "Account registration with social providers",
};

/** Other categories can supply an explicit title through the shared detail header. */
export function getBlockDetailTitle(block: Pick<BlockOverviewEntry, "id" | "title">): string {
  const name = getBlockDisplayName(block.title);
  const subtitle = subtitles[block.id as keyof typeof subtitles];
  return subtitle ? `${name} — ${subtitle}` : name;
}
