import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { technologies } from "../src/references/catalog/technologies";
import type { CodeReferenceHelp } from "../src/references/types";

type Resources = NonNullable<CodeReferenceHelp["related"]>;
type SourceDocument = { file: string; source: string; href?: string; title?: string };
type Technology = Pick<(typeof technologies)[number], "name" | "href" | "aliases">;

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const contentRoutes: Record<string, string> = {
  "theming-foundations": "/docs/theming/installation",
  "theme-component-foundations": "/docs/theming/installation",
  "code-prism-explained": "/docs/code/installation",
  "code-theme-tokens": "/docs/code/installation",
};
const contentPages: Record<string, string> = {
  GettingStartedContent: "/docs/getting-started",
  DocsOverviewContent: "/docs/components",
  DocsPackagesOverviewContent: "/docs/packages",
  DocsFormsOverviewContent: "/docs/forms",
};

/** Index real authored destinations and discussing pages, never arbitrary links from a matched page. */
export function collectTechnologyResources(documents: SourceDocument[], entries: Technology[]) {
  const indexes = entries.map((entry) => ({
    ...entry,
    url: new URL(entry.href),
    mention: new RegExp(
      `(?<![\\w])(?:${[entry.name, ...(entry.aliases ?? [])]
        .filter((name) => name.length > 2)
        .map(escape)
        .join("|")})(?![\\w])`,
      "i",
    ),
    links: new Map<string, Resources[number]>(),
  }));
  for (const document of documents) {
    const prose = document.source.replace(/https?:\/\/[^\s<>"'`)}\\]+/g, "");
    const urls = new Set<string>();
    for (const match of document.source.matchAll(/https?:\/\/[^\s<>"'`)}\\]+/g)) {
      const href = match[0].replace(/&amp;/g, "&").replace(/[.,;]+$/, "");
      try {
        urls.add(new URL(href).href);
      } catch {
        /* A source fragment is not a destination. */
      }
    }
    for (const entry of indexes) {
      if (document.href && entry.mention.test(prose))
        entry.links.set(document.href, {
          label: document.title || document.href,
          href: document.href,
          kind: "guide",
        });
      for (const href of urls) {
        const url = new URL(href);
        if (url.hostname !== entry.url.hostname && !url.hostname.endsWith(`.${entry.url.hostname}`))
          continue;
        // Hosting sites share one domain across projects; retain the exact verified owner boundary.
        if (
          ["github.com", "gitlab.com"].includes(entry.url.hostname) &&
          entry.url.pathname !== "/" &&
          url.pathname !== entry.url.pathname &&
          !url.pathname.startsWith(`${entry.url.pathname.replace(/\/$/, "")}/`)
        )
          continue;
        const path = url.pathname.replace(/\/$/, "").split("/").filter(Boolean);
        const last = decodeURIComponent(url.hash.slice(1) || path.at(-1) || entry.name).replace(
          /[-_]/g,
          " ",
        );
        entry.links.set(href, {
          label: `${entry.name}: ${last}`,
          href,
          kind: url.hostname === "github.com" ? "source" : "guide",
        });
      }
    }
  }
  return Object.fromEntries(
    indexes.map(({ name, links }) => [
      `technology:${name.toLowerCase()}`,
      [...links.values()].sort(
        (a, b) =>
          Number(a.href.startsWith("/")) - Number(b.href.startsWith("/")) ||
          a.href.localeCompare(b.href),
      ),
    ]),
  );
}

/** Only authored content participates: exclude tests, generated inventories and local duplicate copies. */
export function isTechnologyResourceSource(path: string) {
  return (
    /packages\/docs\/(?:docs\/|blocks\/|src\/(?:docs|blocks)\/|\.preactpress\/content\/)/.test(
      path.replaceAll("\\", "/"),
    ) &&
    /\.(?:mdx?|tsx?)$/.test(path) &&
    !/(?:\.test\.|\.spec\.|\/generated[^/]*| 2\.)/.test(path)
  );
}

/** One server/build scan is emitted as one shared lazy resource index. */
export async function buildTechnologyProjectResources(
  root: string,
  pages: Record<string, CodeReferenceHelp>,
) {
  const files: string[] = [];
  const docsRoot = resolve(root, "packages/docs");
  const directories = ["docs", "blocks", "src/docs", "src/blocks", ".preactpress/content"];
  for (const directory of directories)
    for (const file of await readdir(resolve(docsRoot, directory), { recursive: true })) {
      const path = resolve(docsRoot, directory, file);
      if (isTechnologyResourceSource(path)) files.push(path);
    }
  files.sort();
  const documents = await Promise.all(
    files.map(async (file): Promise<SourceDocument> => {
      const source = await readFile(file, "utf8");
      const relative = file.slice(docsRoot.length + 1).replaceAll("\\", "/");
      let href: string | undefined;
      if (/^(docs|blocks)\/.+\.mdx?$/.test(relative))
        href = `/${relative.replace(/(?:\/index)?\.mdx?$/, "").replace(/^index$/, "")}`.replace(
          /\/$/,
          "",
        );
      const component = relative.match(/^src\/docs\/pages\/([^/]+)-doc\.tsx$/)?.[1];
      if (component) href = `/docs/${component}/installation`;
      const fragment = relative.match(/^\.preactpress\/content\/([^/]+)\.md$/)?.[1];
      if (fragment) href = contentRoutes[fragment];
      const page = relative.match(/^src\/docs\/([^/]+)\.tsx$/)?.[1];
      if (page) href = contentPages[page];
      const owner = href ? pages[`page:${href}`] : undefined;
      return { file, source, href: owner ? href : undefined, title: owner?.name };
    }),
  );
  return { files, resources: collectTechnologyResources(documents, technologies) };
}
