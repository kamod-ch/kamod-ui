import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = dirname(fileURLToPath(import.meta.url));
const preactRoot = resolve(root, "node_modules/preact");
const coreSrc = resolve(root, "../core/src");

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "preact",
  },
  resolve: {
    alias: [
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
        find: /^preact\/jsx-runtime$/,
        replacement: resolve(preactRoot, "jsx-runtime/dist/jsxRuntime.module.js"),
      },
      {
        find: /^preact\/jsx-dev-runtime$/,
        replacement: resolve(preactRoot, "jsx-runtime/dist/jsxRuntime.module.js"),
      },
      {
        find: /^preact\/hooks$/,
        replacement: resolve(preactRoot, "hooks/dist/hooks.module.js"),
      },
      {
        find: /^preact\/compat$/,
        replacement: resolve(preactRoot, "compat/dist/compat.module.js"),
      },
      {
        find: /^preact$/,
        replacement: resolve(preactRoot, "dist/preact.module.js"),
      },
      { find: "@kamod-ch/ui/lib/utils", replacement: resolve(coreSrc, "lib/utils.ts") },
      {
        find: "@kamod-ch/ui/lib/interactive",
        replacement: resolve(coreSrc, "lib/interactive/index.ts"),
      },
      {
        find: /^@kamod-ch\/ui\/(.+)$/,
        replacement: `${resolve(coreSrc, "components")}/$1/index.ts`,
      },
      { find: "@kamod-ch/ui", replacement: resolve(coreSrc, "index.ts") },
    ],
    dedupe: ["preact", "preact/hooks", "preact/compat", "motion", "motion/mini"],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["./src/**/*.test.{ts,tsx}"],
    server: {
      deps: {
        inline: [/@kamod-ch\//, /preact/, /motion/],
      },
    },
  },
});
