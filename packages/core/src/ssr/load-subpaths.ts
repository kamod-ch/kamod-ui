import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { VNode } from "preact";
import { hydrate, render } from "preact";
import { act } from "preact/test-utils";
import { renderToString } from "preact-render-to-string";
import { componentNames, fixtureFor, type ModuleNamespace } from "./subpath-fixtures";

type ExportCondition = string | { import?: string; default?: string };

const packageJsonPath = resolve(dirname(fileURLToPath(import.meta.url)), "../../package.json");

const loaders = import.meta.glob([
  "../components/*/index.ts",
  "../utils.ts",
  "../lib/utils.ts",
  "../lib/signals/index.ts",
  "../lib/interactive/index.ts",
]);

export type SubpathEntry = {
  subpath: string;
  source: string;
};

function importSpecifier(value: ExportCondition): string | undefined {
  if (typeof value === "string") return value;
  return value.import ?? value.default;
}

function sourceForSpecifier(specifier: string): string {
  return specifier.replace(/^\.\/dist\//, "../").replace(/\.js$/, ".ts");
}

export function listSubpaths(): SubpathEntry[] {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
    exports: Record<string, ExportCondition>;
  };
  const entries: SubpathEntry[] = [];
  for (const [key, value] of Object.entries(packageJson.exports)) {
    if (key === ".") continue;
    const specifier = importSpecifier(value);
    if (!specifier || specifier.endsWith(".css")) continue;
    entries.push({ subpath: key.slice(2), source: sourceForSpecifier(specifier) });
  }
  return entries;
}

async function importSubpath(source: string): Promise<ModuleNamespace> {
  const loader = loaders[source];
  if (!loader) {
    throw new Error(
      `No source loader for ${source}. Available: ${Object.keys(loaders).sort().join(", ")}`,
    );
  }
  return (await loader()) as ModuleNamespace;
}

function setGlobal(name: "window" | "document", value: unknown) {
  const target = globalThis as Record<string, unknown>;
  const descriptor = Object.getOwnPropertyDescriptor(target, name);
  if (!descriptor || descriptor.configurable) {
    Object.defineProperty(target, name, { configurable: true, writable: true, value });
    return;
  }
  target[name] = value;
}

export async function withoutBrowserGlobals<T>(run: () => Promise<T> | T): Promise<T> {
  const target = globalThis as { window?: unknown; document?: unknown };
  const previousWindow = target.window;
  const previousDocument = target.document;
  setGlobal("window", undefined);
  setGlobal("document", undefined);
  try {
    return await run();
  } finally {
    setGlobal("window", previousWindow);
    setGlobal("document", previousDocument);
  }
}

function captureConsoleErrors(run: () => void): string[] {
  const messages: string[] = [];
  const original = console.error;
  console.error = (...args: unknown[]) => {
    messages.push(args.map((arg) => (typeof arg === "string" ? arg : String(arg))).join(" "));
    original(...args);
  };
  try {
    run();
  } finally {
    console.error = original;
  }
  return messages;
}

export async function serverRenderSubpath(entry: SubpathEntry): Promise<{
  html: string;
  mod: ModuleNamespace;
  vnode: VNode<any> | null;
}> {
  return withoutBrowserGlobals(async () => {
    const mod = await importSubpath(entry.source);
    const vnode = fixtureFor(entry.subpath, mod);
    if (vnode == null) {
      if (componentNames(mod).length > 0) {
        throw new Error(`${entry.subpath} exports components but has no fixture`);
      }
      return { html: "", mod, vnode: null };
    }
    return { html: renderToString(vnode), mod, vnode };
  });
}

function ensureMatchMedia() {
  if (typeof window.matchMedia === "function") return;
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

/** Hydrate the same tree the client would render when `document` exists. */
export function hydrateSubpath(vnode: VNode<any>): string[] {
  ensureMatchMedia();
  const html = renderToString(vnode);
  const container = document.createElement("div");
  document.body.append(container);
  container.innerHTML = html;
  let messages: string[] = [];
  try {
    messages = captureConsoleErrors(() => {
      act(() => {
        hydrate(vnode, container);
      });
    });
  } finally {
    act(() => {
      render(null, container);
    });
    container.remove();
  }
  return messages;
}
