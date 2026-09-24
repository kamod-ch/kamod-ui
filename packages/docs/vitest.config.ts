import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

const coreSrc = resolve(import.meta.dirname, "../core/src");

export default defineConfig({
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
