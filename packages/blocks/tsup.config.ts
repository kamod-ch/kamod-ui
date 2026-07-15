import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/sidebar/index.ts",
    "src/login/index.ts",
    "src/signup/index.ts",
    "src/login/login-01/index.ts",
    "src/login/login-02/index.ts",
    "src/login/login-03/index.ts",
    "src/login/login-04/index.ts",
    "src/login/login-05/index.ts",
    "src/signup/signup-01/index.ts",
    "src/signup/signup-02/index.ts",
    "src/signup/signup-03/index.ts",
    "src/signup/signup-04/index.ts",
    "src/signup/signup-05/index.ts",
  ],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["preact", "preact/hooks", "@preact/signals", "@kamod-ch/ui"],
});
