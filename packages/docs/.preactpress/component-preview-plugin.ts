import { resolve } from "node:path";
import type { Plugin, ResolvedConfig } from "vite";

const filename = "component-preview-frame.htm";

/** Build a small, router-free entry for examples instead of booting another docs application. */
export function componentPreviewPlugin(): Plugin {
  let config: ResolvedConfig;
  let entry: string | undefined;
  const html = (script: string, styles: string[] = []) =>
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${styles.map((href) => `<link rel="stylesheet" href="${href}">`).join("")}<title>Component preview</title></head><body><main id="component-preview-root"></main><script type="module" src="${script}"></script></body></html>`;
  return {
    name: "kamod-component-preview",
    configResolved(value) {
      config = value;
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (
          req.url?.split("?")[0] !== `${config.base}${filename}` &&
          req.url?.split("?")[0] !== `/${filename}`
        )
          return next();
        // .htm bypasses PreactPress's catch-all page SSR middleware. Keep its router
        // and site-theme bootstrap out of this deliberately isolated document.
        res.setHeader("Content-Type", "text/html");
        res.end(
          html(`${config.base}src/docs/component-preview-entry.tsx`, [
            `${config.base}src/styles/index.css?direct`,
          ]),
        );
      });
    },
    buildStart() {
      if (config.command === "build" && !config.build.ssr)
        entry = this.emitFile({
          type: "chunk",
          id: resolve(config.root, "src/docs/component-preview-entry.tsx"),
          name: "component-preview",
        });
    },
    generateBundle(_, bundle) {
      if (!entry || config.build.ssr) return;
      const script = this.getFileName(entry);
      const styles = new Set<string>();
      const visited = new Set<string>();
      const collectStyles = (file: string) => {
        if (visited.has(file)) return;
        visited.add(file);
        const chunk = bundle[file];
        if (chunk?.type !== "chunk") return;
        const metadata = (chunk as typeof chunk & { viteMetadata?: { importedCss: Set<string> } })
          .viteMetadata;
        metadata?.importedCss.forEach((css) => styles.add(`${config.base}${css}`));
        chunk.imports.forEach(collectStyles);
      };
      // PreactPress reads CSS from its main entry. Importing that stylesheet in both
      // entries moves it into a shared chunk that its page HTML does not link.
      // Leave CSS ownership with the app and link those same cached assets here.
      for (const chunk of Object.values(bundle)) {
        if (chunk.type === "chunk" && chunk.isEntry && chunk.name === "main")
          collectStyles(chunk.fileName);
      }
      collectStyles(script);
      this.emitFile({
        type: "asset",
        fileName: filename,
        source: html(`${config.base}${script}`, [...styles]),
      });
    },
  };
}
