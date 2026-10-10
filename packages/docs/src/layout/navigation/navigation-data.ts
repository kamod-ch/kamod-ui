import { withBasePath } from "../../base-path";
import { type BlockCategory, blockCategories } from "../../blocks/block-categories";
import {
  blockCategoryStatuses,
  PLACEHOLDER_BLOCK_CATEGORIES,
  visibleBlockNavItems,
} from "../../blocks/block-nav-config";
import { blockGuides } from "../../blocks/guides/guide-catalog";
import { docsAddedComponentSlugs, docsUpdatedComponentSlugs } from "../../docs/component-status";
import { docsShowMotion, isMotionDocSlug } from "../../docs/docs-feature-flags";
import { docsNavigation } from "../../docs/generated-navigation";

export type NavigationLink = {
  label: string;
  href: string;
  matchDescendants?: boolean;
  planned?: boolean;
  updated?: boolean;
  added?: boolean;
  variantCount?: number;
  /** Decorative trailing icon for introductory destinations; regular entries retain their counts. */
  icon?:
    | "components"
    | "blocks"
    | "forms"
    | "packages"
    | "getting-started"
    | "styles"
    | "theming"
    | "utility";
};
export type NavigationGroup = {
  id: string;
  label: string;
  kind: "components" | "blocks" | "forms" | "packages";
  overview: NavigationLink;
  guides?: NavigationLink[];
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
    overview: { label: `${label} overview`, href: withBasePath(`/docs/${id}`), icon: id },
    guides:
      id === "components"
        ? [
            {
              label: "Theming",
              href: withBasePath("/docs/theming/installation"),
              icon: "theming" as const,
            },
            {
              label: "Component Styles",
              href: withBasePath("/blocks/styles"),
              icon: "styles" as const,
            },
            {
              label: "cn Utility",
              href: withBasePath("/docs/cn/installation"),
              icon: "utility" as const,
            },
          ]
        : undefined,
    links: docsNavigation
      .filter((doc) => !["theming", "cn"].includes(doc.slug))
      .filter((doc) => docsShowMotion || !isMotionDocSlug(doc.slug))
      .filter((doc) => doc.group === id || (id === "components" && doc.group === "motion"))
      .map((doc) => ({
        label: doc.label,
        updated: docsUpdatedComponentSlugs.has(doc.slug),
        added: docsAddedComponentSlugs.has(doc.slug),
        variantCount:
          "variantCount" in doc
            ? doc.variantCount + (docsShowMotion ? doc.motionVariantCount : 0)
            : undefined,
        href: withBasePath(`/docs/${doc.slug}/installation`),
      })),
  })),
  {
    id: "blocks",
    label: "Blocks",
    kind: "blocks",
    overview: { label: "Blocks Overview", href: withBasePath("/blocks"), icon: "blocks" },
    guides: blockGuides.map(({ slug, label }) => ({
      label,
      href: withBasePath(`/blocks/${slug}`),
      icon: slug,
    })),
    links: [
      ...visibleBlockNavItems
        .filter((item) => item.key in blockCategories)
        .map((item) => ({
          label: item.label,
          href: withBasePath(item.href),
          matchDescendants: true,
          added: blockCategoryStatuses[item.key] === "added",
          updated: blockCategoryStatuses[item.key] === "updated",
          variantCount: blockCategories[item.key as BlockCategory].blocks.length,
        })),
      ...PLACEHOLDER_BLOCK_CATEGORIES.map(({ key, label }) => ({
        label,
        href: withBasePath(`/blocks/${key}`),
        planned: true,
        variantCount: 0,
      })),
    ],
  },
];

/** Match section routes and explicitly opted-in collections without matching sibling names. */
export function isNavigationCurrent(pathname: string, href: string, matchDescendants = false) {
  const path = pathname.replace(/\/$/, "");
  const target = href.replace(/\/$/, "");
  if (target.endsWith("/installation")) {
    const root = target.slice(0, -"/installation".length);
    return path === root || path.startsWith(`${root}/`);
  }
  return path === target || (matchDescendants && path.startsWith(`${target}/`));
}

export const navigationGroups: NavigationGroup[] = [groups[0], groups[3], groups[1], groups[2]];
