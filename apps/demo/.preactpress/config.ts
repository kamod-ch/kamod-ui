import { resolve } from "node:path";
import { defineConfig } from "@kamod-ch/preactpress/config";
import tailwindcss from "@tailwindcss/vite";

const repoRoot = resolve(__dirname, "../../");
const base = (process.env.VITE_BASE_PATH?.trim() || "/").replace(/\/?$/, "/");
const matomoImageTracker =
  '<!-- Matomo Image Tracker--><img referrerpolicy="no-referrer-when-downgrade" src="https://matomo.kamod.ch/matomo.php?idsite=3&amp;rec=1" style="border:0" alt="" /><!-- End Matomo -->';

export default defineConfig({
  theme: "./theme/Layout.tsx",
  srcExclude: ["dist/**", "playwright-report/**", "test-results/**", "README.md"],
  site: {
    title: "Kamod UI",
    description:
      "Lightweight UI components for Preact and Tailwind: composable primitives you can customize, extend, and ship without a heavy runtime.",
    url: "https://kamod-ch.github.io/kamod-ui/",
    base,
  },
  markdown: {
    html: false,
    emoji: true,
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: [resolve(repoRoot, "tmp"), resolve(repoRoot, ".cursor"), "**/node_modules/**"],
      },
    },
    resolve: {
      alias: [
        {
          find: "@kamod-ch/ui",
          replacement: resolve(__dirname, "../../../packages/core/src/index.ts"),
        },
        { find: "lucide-preact", replacement: resolve(__dirname, "../node_modules/lucide-preact") },
        {
          find: "preact/jsx-dev-runtime",
          replacement: resolve(
            __dirname,
            "../node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js",
          ),
        },
        {
          find: "preact/jsx-runtime",
          replacement: resolve(
            __dirname,
            "../node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js",
          ),
        },
        {
          find: "preact/hooks",
          replacement: resolve(__dirname, "../node_modules/preact/hooks/dist/hooks.module.js"),
        },
        { find: "preact", replacement: resolve(__dirname, "../node_modules/preact") },
      ],
      dedupe: ["preact", "preact/hooks"],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("/src/docs/pages/")) {
              const fileName = id.split("/").at(-1) ?? "";
              const firstChar = fileName[0]?.toLowerCase() ?? "z";

              if (firstChar <= "b") return "docs-pages-a-b";
              if (firstChar <= "d") return "docs-pages-c-d";
              if (firstChar <= "g") return "docs-pages-e-g";
              if (firstChar <= "k") return "docs-pages-h-k";
              if (firstChar <= "m") return "docs-pages-l-m";
              if (firstChar <= "p") return "docs-pages-n-p";
              if (firstChar <= "s") return "docs-pages-q-s";
              return "docs-pages-t-z";
            }
            if (id.includes("/packages/core/src/")) return "kamod-core";
            if (id.includes("/prismjs/")) return "prismjs";
            if (id.includes("/lucide-preact/")) {
              return "icons";
            }
            if (id.includes("/node_modules/")) return "vendor";
            return undefined;
          },
        },
      },
    },
  },
  transformHtml(html) {
    return html.replace("</body>", `  ${matomoImageTracker}\n  </body>`);
  },
});
