/** Separate synchronous static rendering from browser-only route loading. */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import { blockGuides } from "../src/blocks/guides/guide-catalog";

const moduleId = "virtual:kamod-block-pages";
const guidesId = "virtual:kamod-block-guides";
const themingId = "virtual:kamod-theming-guide";
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
      if (id === moduleId) return resolvedId;
      if (id === guidesId) return resolvedGuidesId;
      if (id === themingId) return resolvedThemingId;
    },
    load(id, options) {
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
      const glob = '"/src/blocks/Blocks*Content.tsx"';
      return options?.ssr
        ? `export const pages = import.meta.glob(${glob}, { eager: true }); export const loaders = {};`
        : `export const pages = {}; export const loaders = import.meta.glob(${glob});`;
    },
  };
}
