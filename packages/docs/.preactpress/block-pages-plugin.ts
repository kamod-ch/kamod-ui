/** Separate synchronous static rendering from browser-only route loading. */
import type { Plugin } from "vite";

const moduleId = "virtual:kamod-block-pages";
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
    },
    load(id, options) {
      if (id !== resolvedId) return;
      const glob = '"/src/blocks/Blocks*Content.tsx"';
      return options?.ssr
        ? `export const pages = import.meta.glob(${glob}, { eager: true }); export const loaders = {};`
        : `export const pages = {}; export const loaders = import.meta.glob(${glob});`;
    },
  };
}
