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
    fs: { existsSync: () => true },
    scanAllContentFiles: vi.fn().mockResolvedValue([file]),
    readMarkdownDraftMeta: () => ({}),
    readMarkdownMetadata: () => markdown,
    isDraftPage: () => false,
    resolveDynamicRoutes: vi.fn().mockResolvedValue([]),
    resolvePageDataMap: vi.fn().mockResolvedValue(new Map([[route, "first"]])),
    applyRouteRewrites: () => {},
    collectTagIndexPages: () => [],
    resolveFileLastUpdated: vi.fn().mockResolvedValue(undefined),
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
    VIRTUAL_CLIENT: "\0client",
  };
  const start = source.indexOf("export function preactPressPlugin(site)");
  if (start < 0) throw new Error("Review the pinned PreactPress catalog patch after an upgrade.");
  const factory = new Function(
    ...Object.keys(services),
    source.slice(start).replace("export function", "return function"),
  )(...Object.values(services));
  const warn = vi.fn();
  const plugin = factory({
    root: "/fixture",
    srcDir: "/fixture",
    site: { base: "/" },
    rewrites: {},
    markdown: {},
    logger: { warn },
  });
  let changed!: (event: string, file: string) => void;
  plugin.configureServer({
    config: { logger: { warn } },
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
    services.scanAllContentFiles.mockReturnValueOnce(gate.promise);
    changed();
    await vi.waitFor(() => expect(services.scanAllContentFiles).toHaveBeenCalledTimes(2));
    expect((await pages(ssr))[file.route].title).toBe("Existing");
    gate.resolve([file]);
    await vi.waitFor(async () => expect((await pages(ssr))[file.route].title).toBe("Existing"));
  },
);

it("keeps the last good catalog after a failed refresh and allows a later retry", async () => {
  const { plugin, services, changed, pages, file, warn } = fixture();
  await plugin.buildStart();
  services.scanAllContentFiles.mockResolvedValueOnce([]);
  services.resolvePageDataMap.mockRejectedValueOnce(new Error("temporary read failure"));
  changed();
  await vi.waitFor(() =>
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("temporary read failure")),
  );
  expect((await pages())[file.route].meta.contentData).toBe("first");
  changed();
  await vi.waitFor(() => expect(services.scanAllContentFiles).toHaveBeenCalledTimes(3));
  expect((await pages())[file.route].title).toBe("Existing");
});

it("still rejects an invalid initial build instead of concealing its error", async () => {
  const { plugin, services, warn } = fixture();
  services.scanAllContentFiles.mockRejectedValueOnce(new Error("invalid initial content"));
  await expect(plugin.buildStart()).rejects.toThrow("invalid initial content");
  expect(warn).not.toHaveBeenCalled();
});

it("serializes overlapping scans rather than exposing partial or out-of-order tables", async () => {
  const { plugin, services, changed, file } = fixture();
  await plugin.buildStart();
  const gate = deferred<(typeof file)[]>();
  services.scanAllContentFiles.mockReturnValueOnce(gate.promise);
  changed();
  await vi.waitFor(() => expect(services.scanAllContentFiles).toHaveBeenCalledTimes(2));
  changed();
  await new Promise((resolve) => setTimeout(resolve, 175));
  expect(services.scanAllContentFiles).toHaveBeenCalledTimes(2);
  gate.resolve([file]);
  await vi.waitFor(() => expect(services.scanAllContentFiles).toHaveBeenCalledTimes(3));
});

it.each([false, true])(
  "keeps one content/metadata snapshot without stale caching (SSR: %s)",
  async (ssr) => {
    const { plugin, services, changed, pages, file } = fixture();
    await plugin.buildStart();
    const gate = deferred<undefined>();
    services.resolveFileLastUpdated.mockReturnValueOnce(gate.promise);
    const rendering = pages(ssr);
    await vi.waitFor(() => expect(services.resolveFileLastUpdated).toHaveBeenCalledTimes(1));
    services.resolvePageDataMap.mockResolvedValueOnce(new Map([[file.route, "second"]]));
    changed();
    await vi.waitFor(() => expect(services.scanAllContentFiles).toHaveBeenCalledTimes(2));
    gate.resolve(undefined);
    expect((await rendering)[file.route].meta.contentData).toBe("first");
    await vi.waitFor(async () =>
      expect((await pages(ssr))[file.route].meta.contentData).toBe("second"),
    );
  },
);
