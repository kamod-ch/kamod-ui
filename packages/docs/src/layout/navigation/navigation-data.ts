import { withBasePath } from "../../base-path";
import { type BlockCategory, blockCategories } from "../../blocks/block-categories";
import { visibleBlockNavItems } from "../../blocks/block-nav-config";
import { getBlockDisplayName } from "../../blocks/block-overview-details";
import { docsShowMotion, isMotionDocSlug } from "../../docs/docs-feature-flags";
import { docsNavigation } from "../../docs/generated-navigation";

export type NavigationLink = { label: string; href: string; keywords?: string };
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
export const navigationGroups: NavigationGroup[] = [
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
        keywords: doc.slug,
      })),
  })),
  ...visibleBlockNavItems
    .filter((item) => item.key in blockCategories)
    .map((item) => ({
      id: item.key,
      label: item.label,
      kind: "blocks" as const,
      overview: { label: `All ${item.label.toLowerCase()} blocks`, href: withBasePath(item.href) },
      links: blockCategories[item.key as BlockCategory].blocks.map((block) => ({
        label: getBlockDisplayName(block.title),
        href: withBasePath(`${item.href}/${block.id}`),
        keywords: `${block.title} ${block.description}`,
      })),
    })),
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

/** Search labels, slugs and block descriptions; every word must match the same destination. */
export function filterNavigation(groups: NavigationGroup[], query: string): NavigationGroup[] {
  const words = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!words.length) return groups;
  return groups.flatMap((group) => {
    const matches = (link: NavigationLink) => {
      const text =
        `${group.label} ${group.kind} ${link.label} ${link.keywords ?? ""}`.toLocaleLowerCase();
      return words.every((word) => text.includes(word));
    };
    const links = group.links.filter(matches);
    return links.length || matches(group.overview) ? [{ ...group, links }] : [];
  });
}
