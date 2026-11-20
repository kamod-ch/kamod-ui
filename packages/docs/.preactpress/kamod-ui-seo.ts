import type { HeadTag } from "@kamod-ch/preactpress/config";
import { docsNavigation } from "../src/docs/generated-navigation.ts";

const NPM_PACKAGE_URL = "https://www.npmjs.com/package/@kamod-ch/ui";
const GITHUB_REPO_URL = "https://github.com/kamod-ch/kamod-ui";
const GITHUB_ORG_URL = "https://github.com/kamod-ch";
const BRAND_URL = "https://ui.kamod.ch/";
const SAME_AS = [GITHUB_REPO_URL, NPM_PACKAGE_URL, BRAND_URL];

const CATALOG_GROUPS = {
  "/docs/components": "components",
  "/docs/forms": "forms",
  "/docs/packages": "packages",
} as const;

const CRUMB_LABELS: Record<string, string> = {
  blocks: "Blocks",
  components: "Components",
  docs: "Docs",
  forms: "Forms",
  packages: "Packages",
  "getting-started": "Getting Started",
};

const ACRONYMS = new Map([
  ["ai", "AI"],
  ["api", "API"],
  ["css", "CSS"],
  ["cta", "CTA"],
  ["faq", "FAQ"],
  ["id", "ID"],
  ["llm", "LLM"],
  ["mfa", "MFA"],
  ["otp", "OTP"],
  ["ui", "UI"],
  ["url", "URL"],
]);

function normalizeRoute(route: string): string {
  const path = route.split("?")[0]?.split("#")[0] ?? "/";
  if (path === "" || path === "/") return "/";
  return path.endsWith("/") ? path.slice(0, -1) : path;
}

function absoluteSiteUrl(site: { url?: string; base: string }, route: string): string {
  const origin = (site.url ?? "").replace(/\/$/, "");
  const base = site.base === "/" ? "" : site.base.replace(/\/$/, "");
  const normalized = normalizeRoute(route);
  const path = normalized === "/" ? "/" : normalized;
  return `${origin}${base}${path === "/" ? "/" : path}`;
}

function jsonLdScript(data: Record<string, unknown>): HeadTag {
  const json = JSON.stringify(data).replaceAll("<", "\\u003c");
  return ["script", { type: "application/ld+json" }, json];
}

function humanizeSegment(segment: string): string {
  return (
    CRUMB_LABELS[segment] ??
    segment
      .split("-")
      .filter(Boolean)
      .map((part) => {
        if (/^\d+$/.test(part)) return String(Number(part));
        return ACRONYMS.get(part) ?? part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join(" ")
  );
}

function publisher(): Record<string, unknown> {
  return {
    "@type": "Organization",
    name: "Kamod",
    url: GITHUB_ORG_URL,
    sameAs: SAME_AS,
  };
}

/** Section, preview, and error routes stay reachable but should not be indexed. */
export function isIndexablePage(
  route: string,
  page: { meta?: Record<string, unknown> } = {},
): boolean {
  const path = normalizeRoute(route);
  if (path === "/404" || path === "/component-preview") return false;
  if (/\/(?:preview|collapsed|mobile)$/.test(path)) return false;
  const kind = String(page.meta?.pageKind ?? "");
  if (kind === "not-found" || kind.includes("preview")) return false;
  if (kind === "component-doc") {
    const slug = String(page.meta?.slug ?? "");
    if (slug && path !== `/docs/${slug}`) return false;
  }
  const section = path.match(/^\/docs\/([^/]+)\/.+/);
  if (section && docsNavigation.some((item) => item.slug === section[1])) return false;
  return true;
}

const NOINDEX: HeadTag = ["meta", { name: "robots", content: "noindex, follow" }];

function hasRobots(meta: Record<string, unknown> | undefined): boolean {
  const head = meta?.head;
  if (!Array.isArray(head)) return false;
  return head.some((tag) => {
    if (!Array.isArray(tag) || tag[0] !== "meta") return false;
    const attrs = tag[1];
    return Boolean(
      attrs && typeof attrs === "object" && "name" in attrs && attrs.name === "robots",
    );
  });
}

/** Keep duplicate guides and chrome-less previews out of search indexes. */
export function applySeoPageData<T extends { meta?: Record<string, unknown> }>(
  page: T,
  route: string,
): T & { meta: Record<string, unknown> } {
  if (isIndexablePage(route, page) || hasRobots(page.meta)) {
    return page as T & { meta: Record<string, unknown> };
  }
  const head = Array.isArray(page.meta?.head) ? page.meta.head : [];
  return {
    ...page,
    meta: { ...page.meta, head: [...head, NOINDEX] },
  };
}

export function routeFromSitemapLoc(loc: string, base: string): string {
  const pathname = new URL(loc).pathname;
  const prefix = base === "/" ? "" : base.replace(/\/$/, "");
  let route = prefix && pathname.startsWith(prefix) ? pathname.slice(prefix.length) : pathname;
  if (!route.startsWith("/")) route = `/${route}`;
  return normalizeRoute(route);
}

/** Drop URLs that are noindex aliases so the sitemap only lists landing pages. */
export function filterSitemap(
  xml: string,
  hiddenRoutes: ReadonlySet<string>,
  base: string,
): string {
  return xml.replace(/  <url><loc>([^<]+)<\/loc>[\s\S]*?<\/url>\n/g, (block, loc: string) => {
    const route = routeFromSitemapLoc(loc, base);
    return hiddenRoutes.has(route) ? "" : block;
  });
}

function breadcrumbList(
  site: { url?: string; base: string },
  route: string,
  title: string,
): Record<string, unknown> {
  const parts = normalizeRoute(route).split("/").filter(Boolean);
  const items = [
    { "@type": "ListItem", position: 1, name: "Kamod UI", item: absoluteSiteUrl(site, "/") },
    ...parts.map((part, index) => {
      const path = `/${parts.slice(0, index + 1).join("/")}`;
      const last = index === parts.length - 1;
      return {
        "@type": "ListItem",
        position: index + 2,
        name: last && title ? title : humanizeSegment(part),
        item: absoluteSiteUrl(site, path),
      };
    }),
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

function catalogItemList(
  site: { url?: string; base: string },
  route: string,
  group: (typeof CATALOG_GROUPS)[keyof typeof CATALOG_GROUPS],
): Record<string, unknown> {
  const entries = docsNavigation
    .filter((item) => item.group === group)
    .sort((a, b) => a.label.localeCompare(b.label));
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: route === "/docs/components" ? "Kamod UI components" : `Kamod UI ${group}`,
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.label,
      url: absoluteSiteUrl(site, `/docs/${entry.slug}`),
    })),
  };
}

function kamodUiSoftwareApplication(siteUrl: string, description: string): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Kamod UI",
    alternateName: ["Kamod Preact UI", "Kamod Preact UI library"],
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: "Preact UI library",
    operatingSystem: "Any",
    description,
    url: siteUrl,
    downloadUrl: NPM_PACKAGE_URL,
    codeRepository: GITHUB_REPO_URL,
    isAccessibleForFree: true,
    sameAs: SAME_AS,
    author: publisher(),
    programmingLanguage: ["TypeScript", "JavaScript"],
    keywords: "Preact, Preact UI, UI components, Tailwind CSS, design system",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

/** Extra JSON-LD for discoverability (home, getting started). Default PreactPress tags still emit WebPage/Article. */
export function kamodUiStructuredDataHead(ctx: {
  route: string;
  title: string;
  description: string;
  site: { url?: string; base: string; title: string; description: string };
}): HeadTag[] {
  const route = normalizeRoute(ctx.route);
  const siteUrl = absoluteSiteUrl(ctx.site, "/");
  const pageUrl = absoluteSiteUrl(ctx.site, route);
  const appDescription =
    "Preact UI components and blocks for Tailwind CSS v4 — composable TypeScript primitives from Kamod UI.";

  const tags: HeadTag[] = [];

  if (route === "/") {
    tags.push(
      jsonLdScript({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: ctx.site.title,
        alternateName: "Kamod Preact UI",
        url: siteUrl,
        description: ctx.site.description,
        inLanguage: "en",
        publisher: publisher(),
      }),
      jsonLdScript(kamodUiSoftwareApplication(siteUrl, appDescription)),
    );
    return tags;
  }

  if (!isIndexablePage(route)) return tags;

  if (route === "/docs/getting-started") {
    tags.push(
      jsonLdScript(kamodUiSoftwareApplication(siteUrl, appDescription)),
      jsonLdScript({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: ctx.title,
        name: ctx.title,
        description: ctx.description,
        url: pageUrl,
        inLanguage: "en",
        about: {
          "@type": "SoftwareApplication",
          name: "Kamod UI",
          alternateName: "Kamod Preact UI library",
          url: siteUrl,
        },
        keywords: "Preact UI, Kamod UI, Tailwind CSS, getting started, components, blocks",
      }),
    );
  }

  const catalog = CATALOG_GROUPS[route as keyof typeof CATALOG_GROUPS];
  if (catalog) tags.push(jsonLdScript(catalogItemList(ctx.site, route, catalog)));
  tags.push(jsonLdScript(breadcrumbList(ctx.site, route, ctx.title)));
  return tags;
}
