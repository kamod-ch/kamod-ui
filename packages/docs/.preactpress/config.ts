import fs from "node:fs/promises";
import path, { resolve } from "node:path";
import { defineConfig } from "@kamod-ch/preactpress/config";
import { getThemeInitScript } from "@kamod-ch/themes";
import tailwindcss from "@tailwindcss/vite";
import type { Connect } from "vite";

const configDir = import.meta.dirname;
const docsRoot = resolve(configDir, "..");
const repoRoot = resolve(configDir, "../../../");
const preactRoot = resolve(docsRoot, "node_modules/preact");
const openuiSrc = resolve(configDir, "../../openui/src");
const motionSrc = resolve(configDir, "../../motion/src");
const blocksSrc = resolve(configDir, "../../blocks/src");
const coreSrc = resolve(configDir, "../../core/src");
const base = (process.env.VITE_BASE_PATH?.trim() || "/").replace(/\/?$/, "/");
const faviconFiles = new Map([
  ["/favicon.svg", { file: "favicon.svg", type: "image/svg+xml" }],
  ["/favicon-32.png", { file: "favicon-32.png", type: "image/png" }],
  ["/favicon.png", { file: "favicon.png", type: "image/png" }],
]);
const matomoImageTracker =
  '<!-- Matomo Image Tracker--><img referrerpolicy="no-referrer-when-downgrade" src="https://matomo.kamod.ch/matomo.php?idsite=3&amp;rec=1" style="border:0" alt="" /><!-- End Matomo -->';

const basePrefix = base === "/" ? "" : base.replace(/\/$/, "");

function publicUrl(assetPath: string): string {
  const normalized = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
  if (basePrefix === "") return normalized;
  return `${basePrefix}${normalized}`;
}

/** Prefix root-absolute dev stylesheet URLs when deploying under a subpath (GitHub Pages). */
function prefixSubpathAssetUrls(html: string): string {
  if (!basePrefix) return html;
  return html.replace(/(<link[^>]+href=")\/((?:src|@)[^"]*)"/g, `$1${basePrefix}/$2"`);
}

/** Vite dev SSR can emit a doubled repo segment in the html-proxy client entry under `base`. */
function fixDevClientModule(html: string): string {
  if (!basePrefix) return html;
  const baseName = basePrefix.replace(/^\//, "").replace(/\/$/, "");
  const doubled = `${basePrefix}/@id/__x00__/${baseName}/index.html`;
  const fixed = `${basePrefix}/@id/__x00__/index.html`;
  return html.replaceAll(doubled, fixed);
}

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
    plugins: [
      {
        name: "kamod-ui-favicon-dev",
        enforce: "pre",
        configureServer(server) {
          const serveKamodFavicon: Connect.NextHandleFunction = (req, res, next) => {
            const pathname = req.url?.split("?")[0] ?? "";
            const favicon = faviconFiles.get(pathname);

            if (!favicon) {
              next();
              return;
            }

            void fs
              .readFile(path.join(docsRoot, "public", favicon.file))
              .then((body) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", favicon.type);
                res.setHeader("Cache-Control", "no-store, max-age=0");
                res.end(body);
              })
              .catch(() => next());
          };

          const stack = server.middlewares.stack;
          if (Array.isArray(stack)) {
            stack.unshift({ route: "", handle: serveKamodFavicon });
          } else {
            server.middlewares.use(serveKamodFavicon);
          }
        },
      },
      tailwindcss(),
    ],
    server: {
      watch: {
        ignored: [resolve(repoRoot, "tmp"), resolve(repoRoot, ".cursor"), "**/node_modules/**"],
      },
    },
    resolve: {
      alias: [
        {
          find: /^@kamod-ch\/blocks\/app-sidebar$/,
          replacement: resolve(blocksSrc, "app-sidebar/index.ts"),
        },
        {
          find: /^@kamod-ch\/blocks\/sidebar$/,
          replacement: resolve(blocksSrc, "sidebar/index.ts"),
        },
        {
          find: /^@kamod-ch\/blocks\/login$/,
          replacement: resolve(blocksSrc, "login/index.ts"),
        },
        {
          find: /^@kamod-ch\/blocks\/signup$/,
          replacement: resolve(blocksSrc, "signup/index.ts"),
        },
        {
          find: /^@kamod-ch\/blocks\/shared$/,
          replacement: resolve(blocksSrc, "shared/index.ts"),
        },
        {
          find: /^@kamod-ch\/blocks\/marketing$/,
          replacement: resolve(blocksSrc, "marketing/index.ts"),
        },
        {
          find: /^@kamod-ch\/blocks\/auth$/,
          replacement: resolve(blocksSrc, "auth/index.ts"),
        },
        {
          find: /^@kamod-ch\/blocks\/dashboard$/,
          replacement: resolve(blocksSrc, "dashboard/index.ts"),
        },
        {
          find: "@kamod-ch/blocks",
          replacement: resolve(blocksSrc, "index.ts"),
        },
        {
          find: "@kamod-ch/openui/examples",
          replacement: resolve(openuiSrc, "examples/fixtures.ts"),
        },
        {
          find: "@kamod-ch/openui/prompts",
          replacement: resolve(openuiSrc, "prompts/index.ts"),
        },
        {
          find: "@kamod-ch/openui",
          replacement: resolve(openuiSrc, "index.ts"),
        },
        {
          find: /^@kamod-ch\/ui-motion\/(.+)$/,
          replacement: `${motionSrc}/$1/index.ts`,
        },
        {
          find: "@kamod-ch/ui-motion",
          replacement: resolve(motionSrc, "index.ts"),
        },
        {
          find: "@kamod-ch/ui/lib/utils",
          replacement: resolve(coreSrc, "lib/utils.ts"),
        },
        {
          find: "@kamod-ch/ui/lib/interactive",
          replacement: resolve(coreSrc, "lib/interactive/index.ts"),
        },
        {
          find: /^@kamod-ch\/ui\/(.+)$/,
          replacement: `${resolve(coreSrc, "components")}/$1/index.ts`,
        },
        {
          find: "@kamod-ch/ui",
          replacement: resolve(coreSrc, "index.ts"),
        },
        { find: "lucide-preact", replacement: resolve(configDir, "../node_modules/lucide-preact") },
        {
          find: /^react$/,
          replacement: resolve(preactRoot, "compat/dist/compat.module.js"),
        },
        {
          find: /^react-dom$/,
          replacement: resolve(preactRoot, "compat/dist/compat.module.js"),
        },
        {
          find: /^react-dom\/client$/,
          replacement: resolve(preactRoot, "compat/dist/compat.module.js"),
        },
        {
          find: /^react\/jsx-runtime$/,
          replacement: resolve(preactRoot, "jsx-runtime/dist/jsxRuntime.module.js"),
        },
        {
          find: /^react\/jsx-dev-runtime$/,
          replacement: resolve(preactRoot, "jsx-runtime/dist/jsxRuntime.module.js"),
        },
        {
          find: "preact/jsx-dev-runtime",
          replacement: resolve(preactRoot, "jsx-runtime/dist/jsxRuntime.module.js"),
        },
        {
          find: "preact/jsx-runtime",
          replacement: resolve(preactRoot, "jsx-runtime/dist/jsxRuntime.module.js"),
        },
        {
          find: "preact/hooks",
          replacement: resolve(preactRoot, "hooks/dist/hooks.module.js"),
        },
        {
          find: "preact/devtools",
          replacement: resolve(preactRoot, "devtools/dist/devtools.module.js"),
        },
        {
          find: "preact/debug",
          replacement: resolve(preactRoot, "debug/dist/debug.module.js"),
        },
        {
          find: "preact/compat",
          replacement: resolve(preactRoot, "compat/dist/compat.module.js"),
        },
        {
          find: /^preact$/,
          replacement: resolve(preactRoot, "dist/preact.module.js"),
        },
      ],
      dedupe: [
        "preact",
        "preact/hooks",
        "preact/compat",
        "preact/devtools",
        "react",
        "react-dom",
        "motion",
        "motion/mini",
      ],
    },
    ssr: {
      noExternal: [
        "@formisch/preact",
        "@formisch/core",
        "@kamod-ch/blocks",
        "@kamod-ch/icons",
        "@formisch/methods",
        "@preact/signals",
        "@kamod-ch/openui",
        "@kamod-ch/ui-motion",
        "@kamod-ch/motion",
        "@kamod-ch/motion/motion",
        "@kamod-ch/motion/presence",
        "@kamod-ch/motion/presets",
        "motion",
        "motion/mini",
        "@openuidev/react-lang",
        "@openuidev/lang-core",
        "preact",
        "preact/hooks",
        "preact/compat",
        "preact/jsx-runtime",
        "preact-render-to-string",
      ],
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
    const withAssets = prefixSubpathAssetUrls(fixDevClientModule(html));
    return withAssets.replace("</body>", `  ${matomoImageTracker}\n  </body>`);
  },
  head: [
    ["link", { rel: "icon", href: publicUrl("favicon.svg"), type: "image/svg+xml" }],
    ["link", { rel: "icon", href: publicUrl("favicon-32.png"), type: "image/png", sizes: "32x32" }],
    ["link", { rel: "apple-touch-icon", href: publicUrl("favicon.png") }],
    ["link", { rel: "stylesheet", href: publicUrl("styles/logo.css") }],
    ["link", { rel: "stylesheet", href: publicUrl("styles/logo-overrides.css") }],
    ["script", { type: "text/javascript" }, getThemeInitScript({ defaultScheme: "system" })],
  ],
});
