/** Separate synchronous static rendering from browser-only route loading. */
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import { blockGuides } from "../src/blocks/guides/guide-catalog.ts";

const docsId = "virtual:kamod-doc-pages";
const gettingStartedId = "virtual:kamod-getting-started";
const ecosystemId = "virtual:kamod-ecosystem";
const moduleId = "virtual:kamod-block-pages";
const guidesId = "virtual:kamod-block-guides";
const themingId = "virtual:kamod-theming-guide";
const prosePrefix = "virtual:kamod-guide-content/";
const proseFiles = new Set([
  "code-prism-explained",
  "code-theme-tokens",
  "theme-component-foundations",
]);
const resolvedThemingId = `\0${themingId}`;
const resolvedGuidesId = `\0${guidesId}`;
const resolvedId = `\0${moduleId}`;

/**
 * PreactPress renders synchronously, so its server needs eager page modules. Generating
 * a different module per environment prevents those imports from reaching the client.
 */
export function blockPagesPlugin(): Plugin {
  return {
    name: "kamod-block-pages",
    resolveId(id) {
      if (id === docsId) return `\0${docsId}`;
      if (id === gettingStartedId) return `\0${gettingStartedId}`;
      if (id === ecosystemId) return `\0${ecosystemId}`;
      if (id === moduleId) return resolvedId;
      if (id === guidesId) return resolvedGuidesId;
      if (id === themingId) return resolvedThemingId;
      if (id.startsWith(prosePrefix) && proseFiles.has(id.slice(prosePrefix.length)))
        return `\0${id}`;
    },
    load(id, options) {
      if (id.startsWith(`\0${prosePrefix}`)) {
        // Keep authored fragments outside the route tree and bypass Markdown-to-component transforms.
        const path = resolve(import.meta.dirname, `content/${id.slice(prosePrefix.length + 1)}.md`);
        this.addWatchFile(path);
        return `export default ${JSON.stringify(readFileSync(path, "utf8"))};`;
      }
      if (id === `\0${docsId}`) {
        if (options?.ssr)
          return 'export { docsBySlug as docs } from "/src/docs/registry.ts"; export const loaders = {};';
        const directory = resolve(import.meta.dirname, "../src/docs/pages");
        const entries = readdirSync(directory)
          .filter((file) => file.endsWith("-doc.tsx"))
          .map((file) => {
            const path = resolve(directory, file);
            this.addWatchFile(path);
            const source = readFileSync(path, "utf8");
            const slug = source.match(/slug:\s*"([^"]+)"/)?.[1];
            const name = source.match(/export const (\w+DocPage)\b/)?.[1];
            if (!slug || !name) throw new Error(`Missing documentation module metadata in ${file}`);
            return `${JSON.stringify(slug)}: () => import(${JSON.stringify(`/src/docs/pages/${file}`)}).then(module => module.${name})`;
          });
        return `export const docs = {}; export const loaders = {${entries.join(",")}};`;
      }

      if (id === `\0${gettingStartedId}` || id === `\0${ecosystemId}`) {
        const slug = id === `\0${gettingStartedId}` ? "getting-started" : "ecosystem";
        const path = resolve(import.meta.dirname, `../docs/${slug}.md`);
        this.addWatchFile(path);
        return `export default ${JSON.stringify(readFileSync(path, "utf8"))};`;
      }
      if (id === resolvedThemingId) {
        const path = resolve(import.meta.dirname, "content/theming-foundations.md");
        this.addWatchFile(path);
        return `export default ${JSON.stringify(readFileSync(path, "utf8"))};`;
      }
      if (id === resolvedGuidesId) {
        // PreactPress transforms .md?raw imports too; expose the original prose through a JS module.
        const sources = Object.fromEntries(
          blockGuides.map(({ slug }) => {
            const path = resolve(import.meta.dirname, `../blocks/${slug}.md`);
            this.addWatchFile(path);
            return [slug, readFileSync(path, "utf8")];
          }),
        );
        return `export default ${JSON.stringify(sources)};`;
      }
      if (id !== resolvedId) return;
      const glob =
        '["/src/blocks/Blocks*Content.tsx", "/src/docs/GettingStartedContent.tsx", "/src/docs/EcosystemContent.tsx", "/src/blocks/BlockCategoryPage.tsx", "/src/blocks/BlockOverviewPage.tsx", "/src/docs/components/component-detail/ComponentPreviewPage.tsx", "/src/docs/DocsComponentContent.tsx", "/src/docs/DocsFormsOverviewContent.tsx", "/src/docs/DocsOverviewContent.tsx", "/src/docs/DocsPackagesOverviewContent.tsx", "/src/kitchen-sink/KitchenSinkPage.tsx", "/src/kitchen-sink/KitchenSinkShowcase.tsx", "/src/home/HomePage.tsx", "/src/home/HomeKitchenSinkSection.tsx"]';
      return options?.ssr
        ? `export const pages = import.meta.glob(${glob}, { eager: true }); export const loaders = {};`
        : `export const pages = {}; export const loaders = import.meta.glob(${glob});`;
    },
  };
}
