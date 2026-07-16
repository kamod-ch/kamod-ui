import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    presets: "src/presets.ts",
    generator: "src/generator.ts",
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: true,
  treeshake: true,
  target: "esnext",
});
