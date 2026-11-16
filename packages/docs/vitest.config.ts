import { defineConfig } from "vitest/config";
import { blockPagesPlugin } from "./.preactpress/block-pages-plugin";
import { codeReferencePlugin } from "./.preactpress/code-reference-plugin";
import { componentApiPlugin } from "./.preactpress/component-api-plugin";
import { kamodUiSourceAliasPlugin, kamodUiViteAliases } from "./.preactpress/ui-source-aliases.ts";

export default defineConfig({
  plugins: [
    kamodUiSourceAliasPlugin(),
    blockPagesPlugin(),
    componentApiPlugin(),
    codeReferencePlugin(),
  ],
  resolve: {
    alias: kamodUiViteAliases(),
  },
  test: {
    // Palette documentation reads the shipped declarations as data, including ?raw imports.
    css: { include: [/packages\/themes\/src\/.*\.css/] },
    environment: "node",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
