/** Serve the same generated installation assets in development and static deployments. */
import { resolve } from "node:path";
import type { Plugin } from "vite";
import { createShellThreeInstallation } from "../scripts/lib/shell-three-download.mjs";
import {
  blocksRoot,
  createSidebarInstallations,
  writeInstallationManifest,
} from "../scripts/lib/sidebar-downloads.mjs";

type Asset = { source: string | Uint8Array; type: string };

export function blockDownloadsPlugin(): Plugin {
  let assets = new Map<string, Asset>();
  let base = "/";
  function regenerate() {
    const installations = createSidebarInstallations();
    writeInstallationManifest(installations);
    assets = new Map(
      [...installations, createShellThreeInstallation()].flatMap(
        (installation) =>
          [
            [
              `blocks/downloads/${installation.id}.zip`,
              { source: installation.zip, type: "application/zip" },
            ],
            [
              `blocks/downloads/${installation.id}.json`,
              { source: JSON.stringify(installation.sources), type: "application/json" },
            ],
          ] as [string, Asset][],
      ),
    );
  }
  return {
    name: "kamod-block-downloads",
    configResolved(config) {
      base = config.base;
    },
    buildStart() {
      regenerate();
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = (req.url ?? "").split("?")[0];
        // Vite may already have stripped base before this middleware runs.
        const key = pathname.startsWith(base)
          ? pathname.slice(base.length)
          : pathname.replace(/^\//, "");
        const asset = assets.get(key);
        if (!asset) return next();
        res.setHeader("Content-Type", asset.type);
        res.setHeader("Cache-Control", "no-store");
        if (key.endsWith(".zip"))
          res.setHeader("Content-Disposition", `attachment; filename="${key.split("/").at(-1)}"`);
        res.end(asset.source);
      });
    },
    handleHotUpdate({ file, server }) {
      if (file === resolve(blocksRoot, "src/sidebar/installation-manifest.json")) return;
      if (
        file.startsWith(resolve(blocksRoot, "src/sidebar") + "/") ||
        file.startsWith(resolve(blocksRoot, "src/shared/branding") + "/") ||
        file.startsWith(resolve(blocksRoot, "src/application-shell") + "/") ||
        file === resolve(blocksRoot, "../../LICENSE.md")
      ) {
        regenerate();
        server.ws.send({ type: "full-reload" });
      }
    },
    generateBundle() {
      for (const [fileName, asset] of assets)
        this.emitFile({ type: "asset", fileName, source: asset.source });
    },
  };
}
