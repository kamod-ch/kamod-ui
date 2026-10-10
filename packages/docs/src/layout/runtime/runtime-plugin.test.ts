import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { build, type InlineConfig, type Plugin, transformWithEsbuild } from "vite";
import { expect, it } from "vitest";
import {
  patchPreactpressRuntime,
  runtimePerformancePlugin,
} from "../../../.preactpress/runtime-performance-plugin";

const root = resolve(import.meta.dirname, "../../..", "node_modules/@kamod-ch/preactpress");
it.each([
  "src/client/app.tsx",
  "src/client/loadPage.ts",
  "src/client/prefetchLinks.ts",
  "src/shared/scrollRestoration.ts",
  "dist/client/app.js",
  "dist/client/loadPage.js",
  "dist/client/prefetchLinks.js",
  "dist/shared/scrollRestoration.js",
])("patches the installed %s without changing its public exports", async (module) => {
  const id = `${root}/${module}`;
  const source = readFileSync(id, "utf8");
  const patched = patchPreactpressRuntime(source, id)!;
  expect(patched).toBeTruthy();
  await expect(transformWithEsbuild(patched, id)).resolves.toHaveProperty("code");
  if (module.includes("client/app.")) {
    expect(patched).toContain("setupHoverPrefetch(routeFromHref, prefetch)");
    expect(patched).toContain("saveScrollPositionBeforeNavigation();");
    expect(patched).toContain("stopHoverPrefetch();");
    expect(patched).not.toContain("onMouseEnter");
  } else if (module.includes("shared/scrollRestoration.")) {
    expect(patched).toContain("connectScrollPersistence(persistScrollPosition)");
    expect(patched).toContain("rememberScrollPosition(scrollY);");
    expect(patched).toContain("return readRememberedScrollPosition(");
    expect(patched.match(/finishScrollRestoration\(\);/g)).toHaveLength(2);
    expect(patched).toContain("const canRestore = guardScrollRestoration();");
    expect(patched).toContain("if (!canRestore()) return;");
    expect(patched).toContain("export function persistScrollPosition(");
    expect(patched).toContain("export async function restoreScrollPositionAfterLayout(");
  } else if (module.includes("client/loadPage.")) {
    expect(patched).toContain("createPageLoader(loadPageUncached, getCachedPage)");
    expect(patched).toContain("export function seedPage(");
    expect(patched).toContain("export function getCachedPage(");
  }
});
it("leaves application and unrelated dependency modules alone", () => {
  expect(
    patchPreactpressRuntime("export const example = 1", "/app/src/client/app.js"),
  ).toBeUndefined();
  expect(
    patchPreactpressRuntime("export const example = 1", `${root}/dist/client/mermaid.js`),
  ).toBeUndefined();
});
it("fails clearly if an upstream patch boundary changes", () => {
  expect(() =>
    patchPreactpressRuntime("export function changed() {}", `${root}/src/client/loadPage.ts`),
  ).toThrow("review the performance patch");
});

const fixturePlugin: Plugin = {
  name: "runtime-integration-fixture",
  resolveId(id) {
    if (id.startsWith("virtual:preactpress-")) return `\0${id}`;
    if (id === "mermaid" || id.startsWith("mermaid/")) return "\0mermaid";
  },
  load(id) {
    if (id === "\0virtual:preactpress-layout") return "export default () => null;";
    if (id === "\0virtual:preactpress-pages")
      return "export const pagesMeta = {}, routes = [], mdxLoaders = {};";
    if (id === "\0virtual:preactpress-site")
      return 'export const i18n = undefined, mpa = false, site = { base: "/" }, themeConfig = {};';
    if (id === "\0mermaid")
      return "export default { initialize() {}, async render() { return { svg: '' }; } };";
  },
};
const bundleConfig = (entry: string): InlineConfig => ({
  configFile: false,
  logLevel: "silent",
  plugins: [runtimePerformancePlugin(), fixturePlugin],
  build: {
    write: false,
    minify: false,
    rollupOptions: { input: `${root}/src/${entry}`, treeshake: false },
  },
});

it("actually patches PreactPress's shipped source entry in a client Vite bundle", async () => {
  const result = await build(bundleConfig("client/entry-client.tsx"));
  if (!("output" in result)) throw new Error("Expected one client bundle");
  const code = result.output
    .filter((item) => item.type === "chunk")
    .map((item) => item.code)
    .join("\n");
  expect(code.includes("kamodScrollEntry")).toBe(true);
  expect(code.includes("guardScrollRestoration")).toBe(true);
  expect(code.includes("setupHoverPrefetch")).toBe(true);
  expect(code.includes('addEventListener("mouseenter"')).toBe(false);
});

it("fails the client build if expected runtime transforms never ran", async () => {
  await expect(build(bundleConfig("shared/scrollRestoration.ts"))).rejects.toThrow(
    "runtime fixes were not applied",
  );
});
