import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const themesEntry = resolve(dirname(fileURLToPath(import.meta.url)), "../themes/src/index.tsx");

export default defineConfig({
  resolve: {
    // Vite's native resolver turns this optional peer into a throwing stub
    // unless a resolve alias points at the workspace source.
    alias: {
      "@kamod-ch/themes": themesEntry,
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["./src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/test/**",
        "src/**/index.ts",
        "src/index.ts",
        "**/*.d.ts",
      ],
    },
  },
});
