import { readFileSync } from "node:fs";
import path, { resolve } from "node:path";
import { expect, it, vi } from "vitest";

const source = readFileSync(
  resolve(
    import.meta.dirname,
    "../../..",
    "node_modules/@kamod-ch/preactpress/dist/node/plugin.js",
  ),
  "utf8",
);

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

/** Exercise the installed plugin with controlled I/O, preserving its actual scan/load logic. */
function fixture() {
  const route = "/existing";
  const file = { route, file: "/fixture/existing.md", kind: "markdown" };
  const markdown = { title: "Existing", meta: {}, html: "<p>Visible text</p>", headings: [] };
  const services = {
    path,
    scanContentFiles: vi.fn().mockResolvedValue([file]),
    readMarkdownMetadata: () => markdown,
    isDraftPage: () => false,
    resolveDynamicRoutes: vi.fn().mockResolvedValue([]),
    resolvePageDataMap: vi.fn().mockResolvedValue(new Map([[route, "first"]])),
    applyRouteRewrites: () => {},
    collectTagIndexPages: () => [],
    resolveFileLastUpdated: async () => undefined,
    readMarkdownFile: vi.fn().mockResolvedValue(markdown),
    localeFromRoute: () => undefined,
    resolvePageTags: () => [],
    pageImageFromMeta: () => undefined,
    pageTypeFromMeta: () => undefined,
    createDevSsrMiddleware: () => () => {},
    createFaviconMiddleware: () => () => {},
    CONTENT_EXTENSIONS: [".md", ".mdx"],
    VIRTUAL_PAGES: "\0pages",
    VIRTUAL_LAYOUT: "\0layout",
    VIRTUAL_SITE: "\0site",
  };
  const start = source.indexOf("export function preactPressPlugin(site)");
  if (start < 0) throw new Error("Review the pinned PreactPress catalog patch after an upgrade.");
  const factory = new Function(
    ...Object.keys(services),
    source.slice(start).replace("export function", "return function"),
  )(...Object.values(services));
  const warn = vi.fn();
  const plugin = factory({
    srcDir: "/fixture",
    site: { base: "/" },
    rewrites: {},
    markdown: {},
    logger: { warn },
  });
  let changed!: (event: string, file: string) => Promise<void>;
  plugin.configureServer({
    middlewares: { use: () => {} },
    watcher: {
      add: () => {},
      on: (_event: string, handler: typeof changed) => {
        changed = handler;
      },
    },
    moduleGraph: { getModuleById: () => undefined },
  });
  const pages = async (ssr = true) => {
    const module = await plugin.load("\0pages", { ssr });
    return new Function(module.replaceAll("export const", "const") + "\nreturn pages;")() as Record<
      string,
      { title: string; meta: { contentData: string } }
    >;
  };
  return {
    plugin,
    services,
    changed: () => changed("change", file.file),
    pages,
    file,
    markdown,
    warn,
  };
}

it.each([false, true])(
  "serves a complete previous route table during refresh (SSR: %s)",
  async (ssr) => {
    const { plugin, services, changed, pages, file } = fixture();
    await plugin.buildStart();
    const gate = deferred<(typeof file)[]>();
    services.scanContentFiles.mockReturnValueOnce(gate.promise);
    const refreshing = changed();
    await vi.waitFor(() => expect(services.scanContentFiles).toHaveBeenCalledTimes(2));
    expect((await pages(ssr))[file.route].title).toBe("Existing");
    gate.resolve([file]);
    await refreshing;
    expect((await pages(ssr))[file.route].title).toBe("Existing");
  },
);

it("keeps the last good catalog after a failed refresh and allows a later retry", async () => {
  const { plugin, services, changed, pages, file, warn } = fixture();
  await plugin.buildStart();
  services.scanContentFiles.mockResolvedValueOnce([]);
  services.resolvePageDataMap.mockRejectedValueOnce(new Error("temporary read failure"));
  await changed();
  expect(warn).toHaveBeenCalledWith(expect.stringContaining("temporary read failure"));
  expect((await pages())[file.route].meta.contentData).toBe("first");
  await changed();
  expect((await pages())[file.route].title).toBe("Existing");
});

it("still rejects an invalid initial build instead of concealing its error", async () => {
  const { plugin, services, warn } = fixture();
  services.scanContentFiles.mockRejectedValueOnce(new Error("invalid initial content"));
  await expect(plugin.buildStart()).rejects.toThrow("invalid initial content");
  expect(warn).not.toHaveBeenCalled();
});

it("serializes overlapping scans rather than exposing partial or out-of-order tables", async () => {
  const { plugin, services, changed, file } = fixture();
  await plugin.buildStart();
  const gate = deferred<(typeof file)[]>();
  services.scanContentFiles.mockReturnValueOnce(gate.promise);
  const first = changed();
  await vi.waitFor(() => expect(services.scanContentFiles).toHaveBeenCalledTimes(2));
  const second = changed();
  await Promise.resolve();
  expect(services.scanContentFiles).toHaveBeenCalledTimes(2);
  gate.resolve([file]);
  await Promise.all([first, second]);
  expect(services.scanContentFiles).toHaveBeenCalledTimes(3);
});

it.each([false, true])(
  "keeps one content/metadata snapshot without stale caching (SSR: %s)",
  async (ssr) => {
    const { plugin, services, changed, pages, markdown, file } = fixture();
    await plugin.buildStart();
    const gate = deferred<typeof markdown>();
    services.readMarkdownFile.mockReturnValueOnce(gate.promise);
    const rendering = pages(ssr);
    await vi.waitFor(() => expect(services.readMarkdownFile).toHaveBeenCalledTimes(1));
    services.resolvePageDataMap.mockResolvedValueOnce(new Map([[file.route, "second"]]));
    await changed();
    gate.resolve(markdown);
    expect((await rendering)[file.route].meta.contentData).toBe("first");
    expect((await pages(ssr))[file.route].meta.contentData).toBe("second");
  },
);
