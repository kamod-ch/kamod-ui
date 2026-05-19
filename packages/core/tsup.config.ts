import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "tsup";

const componentsDir = "src/components";
const componentEntries: Record<string, string> = Object.fromEntries(
  readdirSync(componentsDir)
    .filter((name) => {
      const entry = join(componentsDir, name);
      try {
        return statSync(entry).isDirectory();
      } catch {
        return false;
      }
    })
    .map((name) => [`components/${name}/index`, `${componentsDir}/${name}/index.ts`])
);

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "lib/utils": "src/lib/utils.ts",
    "lib/signals/index": "src/lib/signals/index.ts",
    "lib/interactive/index": "src/lib/interactive/index.ts",
    ...componentEntries
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: true,
  treeshake: true,
  target: "esnext",
  external: ["preact", "preact/hooks", "preact/jsx-runtime", "@preact/signals"]
});
