import { resolve } from "node:path";
import { defineConfig } from "vitest/config";
import { blockPagesPlugin } from "./.preactpress/block-pages-plugin";
import { componentApiPlugin } from "./.preactpress/component-api-plugin";

const coreSrc = resolve(import.meta.dirname, "../core/src");

export default defineConfig({
  plugins: [blockPagesPlugin(), componentApiPlugin()],
  resolve: {
    alias: [
      {
        find: "@kamod-ch/ui/utils",
        replacement: resolve(coreSrc, "utils.ts"),
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
        find: "@kamod-ch/ui/code/highlight",
        replacement: resolve(coreSrc, "components/code/highlight-code.ts"),
      },
      {
        find: /^@kamod-ch\/ui\/(.+)$/,
        replacement: `${coreSrc}/components/$1/index.ts`,
      },
      {
        find: "@kamod-ch/ui",
        replacement: resolve(coreSrc, "index.ts"),
      },
    ],
  },
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
