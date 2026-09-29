import { withBasePath } from "../../base-path";
import { type BlockCategory, blockCategories } from "../../blocks/block-categories";
import { visibleBlockNavItems } from "../../blocks/block-nav-config";
import { getBlockDisplayName } from "../../blocks/block-overview-details";
import { docsShowMotion, isMotionDocSlug } from "../../docs/docs-feature-flags";
import { docsNavigation } from "../../docs/generated-navigation";

export type NavigationLink = { label: string; href: string; children?: NavigationLink[] };
export type NavigationGroup = {
  id: string;
  label: string;
  kind: "components" | "blocks" | "forms" | "packages";
  overview: NavigationLink;
  links: NavigationLink[];
};

const docsGroups = [
  { id: "components", label: "Components" },
  { id: "forms", label: "Forms" },
  { id: "packages", label: "Packages" },
] as const;

/** Only metadata is imported here: opening the menu never loads live block demos. */
const groups: NavigationGroup[] = [
  ...docsGroups.map(({ id, label }) => ({
    id,
    label,
    kind: id,
    overview: { label: `${label} overview`, href: withBasePath(`/docs/${id}`) },
    links: docsNavigation
      .filter((doc) => docsShowMotion || !isMotionDocSlug(doc.slug))
      .filter((doc) => doc.group === id || (id === "components" && doc.group === "motion"))
      .map((doc) => ({
        label: doc.label,
        href: withBasePath(`/docs/${doc.slug}/installation`),
      })),
  })),
  {
    id: "blocks",
    label: "Blocks",
    kind: "blocks",
    overview: { label: "Blocks overview", href: withBasePath("/blocks") },
    links: visibleBlockNavItems
      .filter((item) => item.key in blockCategories)
      .map((item) => ({
        label: item.label,
        href: withBasePath(item.href),
        children: blockCategories[item.key as BlockCategory].blocks.map((block) => ({
          label: getBlockDisplayName(block.title),
          href: withBasePath(`${item.href}/${block.id}`),
        })),
      })),
  },
];

/** Match a component's section routes too, but never mark its overview as the current page. */
export function isNavigationCurrent(pathname: string, href: string) {
  const path = pathname.replace(/\/$/, "");
  const target = href.replace(/\/$/, "");
  if (target.endsWith("/installation")) {
    const root = target.slice(0, -"/installation".length);
    return path === root || path.startsWith(`${root}/`);
  }
  return path === target;
}

/** Keep nested variants reachable when deciding which collection to expand. */
export function flattenNavigationLinks(links: NavigationLink[]): NavigationLink[] {
  return links.flatMap((link) => [link, ...flattenNavigationLinks(link.children ?? [])]);
}

export const navigationGroups = [groups[0], groups[3], groups[1], groups[2]];
