import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";

const repoRoot = resolve(__dirname, "../..");

export default defineConfig({
  /** GitHub project pages: set `VITE_BASE_PATH=/repo-name/` in CI (trailing slash). */
  base: (process.env.VITE_BASE_PATH?.trim() || "/").replace(/\/?$/, "/"),
  plugins: [preact(), tailwindcss()],
  /** Avoid extra FS churn from tooling folders at repo root (e.g. tmp summaries, IDE metadata). */
  server: {
    watch: {
      ignored: [resolve(repoRoot, "tmp"), resolve(repoRoot, ".cursor"), "**/node_modules/**"],
    },
  },
  resolve: {
    extensions: [".ts", ".tsx", ".mjs", ".js", ".jsx", ".json"],
    alias: {
      "@kamod-ui/core": resolve(__dirname, "../../packages/core/src/index.ts"),
    },
  },
});
