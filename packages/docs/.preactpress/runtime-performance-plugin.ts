import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";

const packageRoot = resolve(import.meta.dirname, "../node_modules/@kamod-ch/preactpress");
const runtimeRoot = resolve(import.meta.dirname, "../src/layout/runtime");
const requiredModules = [
  "client/app.js",
  "client/loadPage.js",
  "client/prefetchLinks.js",
  "shared/scrollRestoration.js",
];
const runtimeModule = (id: string) =>
  id
    .replaceAll("\\", "/")
    .split("/node_modules/@kamod-ch/preactpress/")[1]
    ?.split("?")[0]
    .replace(/^(?:src|dist)\//, "")
    .replace(/\.[jt]sx?$/, ".js");

/** Fail loudly if an upstream upgrade changes a compatibility patch's boundary. */
function replaceOnce(source: string, before: string, after: string, module: string) {
  if (!source.includes(before) || source.indexOf(before) !== source.lastIndexOf(before))
    throw new Error(
      `PreactPress runtime compatibility: ${module} changed; review the performance patch.`,
    );
  return source.replace(before, after);
}

function replaceBetween(source: string, start: string, end: string, after: string, module: string) {
  const first = source.indexOf(start);
  const last = source.indexOf(end, first + start.length);
  if (first < 0 || last < 0)
    throw new Error(
      `PreactPress runtime compatibility: ${module} changed; review the performance patch.`,
    );
  return replaceOnce(source, source.slice(first, last), after, module);
}

/**
 * Scoped compatibility for PreactPress 2.2.1. Keep upstream routing/SSR intact;
 * replace only speculative scheduling, pending-request sharing and scroll saves.
 * Remove this bridge when those fixes are available in the dependency itself.
 */
export function patchPreactpressRuntime(source: string, id: string): string | undefined {
  const module = runtimeModule(id);
  if (!module) return;
  const importRuntime = (file: string, names: string) =>
    `import { ${names} } from ${JSON.stringify(`${runtimeRoot}/${file}.ts`)};\n`;
  if (module === "client/prefetchLinks.js") {
    replaceOnce(source, "export function setupViewportPrefetch(", "", module);
    return `export { setupViewportPrefetch } from ${JSON.stringify(`${runtimeRoot}/link-prefetch.ts`)};`;
  }
  if (module === "shared/scrollRestoration.js") {
    let patched = replaceBetween(
      source,
      "export function setupScrollRestoration(",
      "export function persistScrollPosition(",
      "export function setupScrollRestoration() { return connectScrollPersistence(persistScrollPosition); }\n",
      module,
    );
    patched = replaceOnce(
      patched,
      "const scrollY = window.scrollY;",
      "const scrollY = window.scrollY;\n    rememberScrollPosition(scrollY);",
      module,
    );
    patched = replaceOnce(
      patched,
      'return typeof scrollY === "number" && Number.isFinite(scrollY) ? scrollY : 0;',
      'return readRememberedScrollPosition(typeof scrollY === "number" && Number.isFinite(scrollY) ? scrollY : 0);',
      module,
    );
    for (const statement of [
      'window.scrollTo({ top: readScrollPositionFromHistory(), left: 0, behavior: "auto" });',
      'window.scrollTo({ top, left: 0, behavior: "auto" });',
    ])
      patched = replaceOnce(
        patched,
        statement,
        `${statement}\n    finishScrollRestoration();`,
        module,
      );
    const start = patched.indexOf("async function scrollAfterLayout(");
    const firstAwait = patched.indexOf("await nextAnimationFrame();", start);
    if (start < 0 || firstAwait < 0)
      throw new Error("PreactPress scrollAfterLayout changed; review the performance patch.");
    patched =
      patched.slice(0, firstAwait) +
      "const canRestore = guardScrollRestoration();\n    " +
      patched.slice(firstAwait);
    patched = replaceOnce(
      patched,
      "const html = document.documentElement;",
      "if (!canRestore()) return;\n    const html = document.documentElement;",
      module,
    );
    return (
      importRuntime(
        "scroll-persistence",
        "connectScrollPersistence, rememberScrollPosition, readRememberedScrollPosition, finishScrollRestoration, guardScrollRestoration",
      ) + patched
    );
  }
  if (module === "client/loadPage.js") {
    const renamed = replaceOnce(
      source,
      "export async function loadPage(",
      "async function loadPageUncached(",
      module,
    );
    replaceOnce(renamed, "export function prefetchPage(", "", module);
    return (
      importRuntime("page-loading", "createPageLoader") +
      replaceOnce(
        renamed,
        renamed.slice(renamed.indexOf("export function prefetchPage(")),
        "export const { loadPage, prefetchPage } = createPageLoader(loadPageUncached, getCachedPage);\n",
        module,
      )
    );
  }
  if (module === "client/app.js") {
    let patched = replaceBetween(
      source,
      "const onMouseEnter =",
      'window.addEventListener("popstate", onPopState);',
      "const stopHoverPrefetch = setupHoverPrefetch(routeFromHref, prefetch);\n    ",
      module,
    );
    patched = replaceOnce(
      patched,
      'document.addEventListener("mouseenter", onMouseEnter, true);',
      "",
      module,
    );
    patched = replaceOnce(
      patched,
      'document.removeEventListener("mouseenter", onMouseEnter, true);',
      "stopHoverPrefetch();",
      module,
    );
    return importRuntime("link-prefetch", "setupHoverPrefetch") + patched;
  }
}

export function runtimePerformancePlugin(): Plugin {
  let clientBuild = false;
  const transformed = new Set<string>();
  return {
    name: "kamod-preactpress-runtime-performance",
    enforce: "pre",
    config() {
      // The four guarded modules must pass through Vite's transform in development too.
      return { optimizeDeps: { exclude: ["@kamod-ch/preactpress"] } };
    },
    configResolved(config) {
      clientBuild = config.command === "build" && !config.build.ssr;
      transformed.clear();
      const { version } = JSON.parse(readFileSync(resolve(packageRoot, "package.json"), "utf8"));
      if (version !== "2.2.1")
        throw new Error(
          `PreactPress ${version}: review runtime-performance-plugin.ts before upgrading the supported 2.2.1 runtime.`,
        );
    },
    transform(source, id) {
      const code = patchPreactpressRuntime(source, id);
      if (code !== undefined) {
        transformed.add(runtimeModule(id)!);
        return { code, map: null };
      }
    },
    generateBundle() {
      if (!clientBuild) return;
      const missing = requiredModules.filter((module) => !transformed.has(module));
      if (missing.length)
        this.error(
          `PreactPress runtime fixes were not applied to: ${missing.join(", ")}. Review the dependency's actual client entry paths.`,
        );
    },
  };
}
