import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import helpCatalog from "virtual:kamod-code-reference-help";
import navigation from "virtual:kamod-code-references";
import { expect, it } from "vitest";
import { packageGuide, packageLabels, referencePackages } from "./catalog/packages";
import { loadCodeReferenceHelp } from "./help/loader";
import { inlineSourceReference } from "./inline-references";

it("every source-backed component display label beats the matching documentation page", async () => {
  expect(navigation.componentLabels["theme toggle"]).toBe("ThemeToggle");
  for (const [label, name] of Object.entries(navigation.componentLabels)) {
    const request = inlineSourceReference(label)!;
    expect(request.imported, label).toBe(name);
    expect(request.referenceId, label).toBeUndefined();
    const help = await loadCodeReferenceHelp(request);
    expect(help.kind, label).toBe("component");
    expect(help.source?.href, label).toContain(navigation.components[name].file);
  }
  const theme = await loadCodeReferenceHelp(inlineSourceReference("Theme Toggle")!);
  expect(theme.docs?.href).toBe("/docs/theme-toggle/installation#api-reference");
  expect(theme.fields?.length).toBeGreaterThan(0);
  expect(inlineSourceReference("/docs/theme-toggle/installation")?.referenceId).toMatch(/^page:/);
});

it.each([
  ["@kamod-ch/ui", "tree/main/packages/core", "/docs/components"],
  [
    "@kamod-ch/ui/theme.css",
    "blob/main/packages/core/src/theme.css",
    "/docs/theming/installation#css-setup",
  ],
  [
    "@kamod-ch/ui/code/styles.css",
    "blob/main/packages/core/src/components/code/code-styles.css",
    "/docs/code/installation#code-css-ownership",
  ],
  [
    "@kamod-ch/themes/theme.css",
    "blob/main/packages/themes/src/theme.css",
    "/docs/theming/installation#css-setup",
  ],
  ["@kamod-ch/ui-motion", "tree/main/packages/motion", "/docs/ui-motion/installation"],
  ["@kamod-ch/openui", "tree/main/packages/openui", "/docs/ecosystem#explore-the-wider-toolkit"],
  [
    "@kamod-ch/typeset",
    "tree/main/packages/typeset",
    "/docs/ecosystem#build-the-interface-foundation",
  ],
])(
  "%s links to its actual source with an independently chosen local explanation",
  async (label, source, guide) => {
    const request = inlineSourceReference(label)!;
    expect(request.href).toBe(`https://github.com/kamod-ch/kamod-ui/${source}`);
    const help = await loadCodeReferenceHelp(request);
    expect(help.source?.href).toBe(request.href);
    expect(help.docs?.href).toBe(guide);
    expect(help.kind).toBe(label.endsWith(".css") ? "module" : "package");
  },
);

it("all curated package roots resolve to their verified repository owner and an existing local page", async () => {
  const routes = navigation.inline.routes;
  for (const [name, origin] of Object.entries(referencePackages)) {
    const request = inlineSourceReference(name)!;
    expect(request, name).toBeDefined();
    expect(request.href, name).toBe(
      origin.directory ? `${origin.repository}/tree/main/${origin.directory}` : origin.repository,
    );
    expect(helpCatalog.packages[name]?.repository, name).toBe(origin.repository);
    const guide = packageGuide(name)!;
    const [path, fragment] = guide.split("#");
    expect(Object.hasOwn(routes, path), name).toBe(true);
    if (fragment) expect(routes[path], name).toContain(fragment);
  }
  expect(inlineSourceReference("@kamod-ch/signals")?.href).toContain("/kamod-signals/");
  expect(
    (await loadCodeReferenceHelp(inlineSourceReference("@kamod-ch/blocks")!)).detail,
  ).toContain("Private workspace");
  expect(
    (await loadCodeReferenceHelp(inlineSourceReference("@kamod-ch/ui-docs")!)).detail,
  ).toContain("Private workspace");
  expect(Object.hasOwn(helpCatalog.inlineLoaders!, "guide")).toBe(false);
});

it("keeps public source links separate from an explicitly authored local destination", async () => {
  const request = inlineSourceReference("@kamod-ch/ui/theme.css", "/docs/components")!;
  expect(request.href).toBe("/docs/components");
  const help = await loadCodeReferenceHelp(request);
  expect(help.source?.href).toBe(
    "https://github.com/kamod-ch/kamod-ui/blob/main/packages/core/src/theme.css",
  );
  expect(help.docs?.href).toBe("/docs/theming/installation#css-setup");
  const page = inlineSourceReference(
    "Getting Started Guide",
    "/docs/getting-started#set-up-your-app",
  )!;
  expect((await loadCodeReferenceHelp(page)).kind).toBe("page");
  expect((await loadCodeReferenceHelp(page)).docs?.href).toBe(page.href);
});

it("keeps unambiguous package/product labels attached to their source package instead of a page", async () => {
  for (const [label, module] of Object.entries(packageLabels)) {
    const request = inlineSourceReference(label)!;
    expect(request.module, label).toBe(module);
    expect(request.referenceId, label).toBeUndefined();
    expect((await loadCodeReferenceHelp(request)).kind, label).toBe("package");
    expect(inlineSourceReference(`${label}()`), label).toBeUndefined();
  }
});

it("only publishes checked-out source paths and uses real local integration destinations", async () => {
  for (const source of Object.values(navigation.packageSources)) {
    const path = source.match(
      /^https:\/\/github.com\/kamod-ch\/kamod-ui\/(tree|blob)\/main\/(.+)$/,
    );
    if (!path) continue;
    const file = await stat(resolve(import.meta.dirname, "../../../..", path[2]));
    expect(path[1] === "blob" ? file.isFile() : file.isDirectory(), source).toBe(true);
  }
  for (const module of [
    "preact/hooks",
    "@preact/preset-vite",
    "@preact/signals",
    "@formisch/preact",
    "clsx",
    "tailwind-merge",
    "prismjs",
    "tailwindcss",
    "@tailwindcss/vite",
    "motion",
    "@openuidev/react-lang",
    "valibot",
    "zod",
  ]) {
    const [route, fragment] = packageGuide(module)!.split("#");
    expect(Object.hasOwn(navigation.inline.routes, route), module).toBe(true);
    if (fragment) expect(navigation.inline.routes[route], module).toContain(fragment);
  }
});
