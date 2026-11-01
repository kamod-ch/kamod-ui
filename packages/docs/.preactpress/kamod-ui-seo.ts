import type { HeadTag } from "@kamod-ch/preactpress/config";

const NPM_PACKAGE_URL = "https://www.npmjs.com/package/@kamod-ch/ui";
const GITHUB_REPO_URL = "https://github.com/kamod-ch/kamod-ui";

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

  if (route === "/") {
    return [
      jsonLdScript({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: ctx.site.title,
        alternateName: "Kamod Preact UI",
        url: siteUrl,
        description: ctx.site.description,
        inLanguage: "en",
      }),
      jsonLdScript(kamodUiSoftwareApplication(siteUrl, appDescription)),
    ];
  }

  if (route === "/docs/getting-started") {
    return [
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
    ];
  }

  return [];
}
