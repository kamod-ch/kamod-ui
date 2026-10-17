import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { codeSyntaxThemes } from "@kamod-ch/ui/code";
import { expect, it } from "vitest";
import { prismThemeId, prismThemes } from "./prism-theme-catalog";
import {
  prismLicenseNotices,
  prismSourceColors,
  prismSourceRules,
  scopedPrismCss,
} from "./prism-theme-sources";

it("preserves 24 pinned, licensed upstream stylesheets without importing global theme CSS", () => {
  expect(prismThemes).toHaveLength(24);
  expect(new Set(prismThemes.map(({ id }) => id)).size).toBe(24);
  for (const theme of prismThemes) {
    const source = readFileSync(resolve(import.meta.dirname, theme.source.snapshot), "utf8");
    expect(theme.sourceCss).toBe(source);
    expect(theme.source.revision).toMatch(/^(v1\.30\.0|447479fc7b2be2051fe27e561aceed7cc87a589f)$/);
    expect(theme.sourceUrl).toBe(
      `https://github.com/${theme.source.repository}/blob/${theme.source.revision}/${theme.source.path}`,
    );
    expect(theme.css).toContain(theme.sourceUrl);
    expect(theme.css).toContain("Permission is hereby granted, free of charge");
    expect(theme.css).toContain("THE SOFTWARE IS PROVIDED");
    expect(prismThemeId(theme.id)).toBe(`prism-theme-${theme.id}`);
    expect(theme.author).not.toBe("");
    expect(theme.notes).toHaveLength(2);
    for (const rule of prismSourceRules(theme.css)) {
      expect(rule.selectors.every((selector) => selector.startsWith(theme.scope))).toBe(true);
    }
  }
  expect(prismLicenseNotices.core).toContain("Copyright (c) 2012 Lea Verou");
  expect(prismLicenseNotices.community).toContain("Copyright (c) 2015 PrismJS");
});

it("matches every saved source and license byte against the pinned download manifest", () => {
  const manifest: {
    file: string;
    sha256: string;
    bytes: number;
    repository: string;
    revision: string;
    path: string;
  }[] = JSON.parse(readFileSync(resolve(import.meta.dirname, "vendor/SOURCES.json"), "utf8"));
  expect(manifest).toHaveLength(27);
  for (const entry of manifest) {
    const bytes = readFileSync(resolve(import.meta.dirname, "vendor", entry.file));
    expect(bytes.byteLength).toBe(entry.bytes);
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(entry.sha256);
  }
  for (const theme of prismThemes) {
    expect(manifest.find(({ file }) => `vendor/${file}` === theme.source.snapshot)).toMatchObject({
      repository: theme.source.repository,
      revision: theme.source.revision,
      path: theme.source.path,
    });
  }
  expect(prismThemes.find(({ id }) => id === "night-owl")!.css).toContain(
    "Copyright (c) 2018 Sarah Drasner",
  );
});

it("reports exact original source values instead of bundled contrast-adjusted adaptations", () => {
  const okaidia = prismThemes.find(({ id }) => id === "okaidia")!;
  expect(okaidia.colors.find(({ id }) => id === "canvas")!.value).toBe("#272822");
  expect(okaidia.colors.find(({ id }) => id === "property")!.value).toBe("#f92672");
  expect(okaidia.colors.find(({ id }) => id === "string")!.value).toBe("#a6e22e");
  expect(okaidia.colors.find(({ id }) => id === "keyword")!.value).toBe("#66d9ef");
  expect(okaidia.builtIn).toBe("okaidia");
  expect(okaidia.builtInNotes).toContain("contrast-adjusted adaptation");
  expect(prismThemes.find(({ id }) => id === "default")!.builtIn).toBeUndefined();
  for (const theme of prismThemes.filter(({ builtIn }) => builtIn))
    expect(codeSyntaxThemes).toContain(theme.builtIn);
});

it("keeps inherited token groups honest and preserves language-specific paint", () => {
  const basic = `code[class*="language-"], pre[class*="language-"] { color: #123456; background: #ffffff; } .token.string { color: #00ff00; } .language-css .token.string { color: #ff0000; }`;
  const colors = prismSourceColors(basic);
  expect(colors.find(({ id }) => id === "string")).toMatchObject({
    value: "#00ff00",
    selector: ".token.string",
    inherited: undefined,
  });
  expect(colors.find(({ id }) => id === "function")).toMatchObject({
    value: "#123456",
    selector: 'code[class*="language-"]',
    inherited: true,
  });
  const css = scopedPrismCss(
    "test",
    "Test",
    basic,
    "https://example.test/source",
    prismLicenseNotices.core,
  );
  expect(css).toContain(
    '[data-prism-theme="test"] .kamod-code[data-syntax-theme] .language-css .token.string',
  );
  expect(css).toContain("--kamod-code-string: currentColor");
  expect(css).toContain("pre.docs-code");
});

it("keeps self-contained source patterns and namespace paint without external requests or plugin layout", () => {
  const funky = prismThemes.find(({ id }) => id === "funky")!;
  expect(funky.css).toContain("data:image/svg+xml");
  expect(prismThemes.find(({ id }) => id === "nord")!.css).toContain(
    '[data-prism-theme="nord"] .kamod-code[data-syntax-theme] .namespace',
  );
  const source = `code[class*="language-"], pre[class*="language-"] { color: black; background: white; font-family: Example; margin: 3rem; } .token.string { color: green; background-image: url("https://example.test/image.png"); } .line-numbers { color: red; width: 3em; }`;
  const css = scopedPrismCss(
    "test",
    "Test",
    source,
    "https://example.test/source",
    prismLicenseNotices.core,
  );
  expect(css).not.toContain("image.png");
  expect(css).not.toContain("font-family:");
  expect(css).not.toContain("margin:");
  expect(css).not.toContain(".line-numbers");
  expect(css).toContain("color: green");
  expect(() => scopedPrismCss('bad"] body', "Bad", source, "", "")).toThrow(
    "Invalid Prism theme identity",
  );
});

it("keeps saved keyword paint above the real legacy docs dark-mode syntax cascade", () => {
  const pageCss = readFileSync(
    resolve(import.meta.dirname, "../../../../styles/pages.css"),
    "utf8",
  );
  const legacySelector = "html.dark .docs-code .token.keyword";
  const legacyRule = prismSourceRules(pageCss).find(({ selectors }) =>
    selectors.includes(legacySelector),
  );
  expect(legacyRule?.declarations.color).toContain("--kamod-code-keyword");
  // These regression selectors have no :is/:where, IDs or pseudo-classes: count
  // their attribute/class selectors first, then their optional element names.
  const specificity = (selector: string) => {
    const simple = selector.replace(/\[[^\]]+\]/g, ".attribute");
    return (
      (simple.match(/\.[\w-]+/g)?.length ?? 0) * 100 +
      (simple.replace(/\.[\w-]+/g, "").match(/\b[a-z][\w-]*\b/g)?.length ?? 0)
    );
  };
  for (const theme of prismThemes) {
    const keywordRule = prismSourceRules(theme.css).find(({ selectors }) =>
      selectors.includes(`${theme.scope} .kamod-code[data-syntax-theme] .token.keyword`),
    );
    expect(keywordRule, theme.label).toBeDefined();
    const selector = keywordRule!.selectors.find((value) => value.endsWith(" .token.keyword"))!;
    expect(specificity(selector), theme.label).toBeGreaterThan(specificity(legacySelector));
    expect(keywordRule!.declarations.color, theme.label).not.toContain("!important");
    expect(theme.css).toContain(`${theme.scope} .kamod-code {`);
  }
});

it("preserves the actual gradient canvas instead of guessing a solid Synthwave background", () => {
  const synthwave = prismThemes.find(({ id }) => id === "synthwave84")!;
  expect(synthwave.colors.find(({ id }) => id === "canvas")).toMatchObject({
    value: "linear-gradient(to bottom, #2a2139 75%, #34294f)",
    selector: 'pre[class*="language-"]',
  });
  expect(synthwave.css).toContain(
    "background-image: linear-gradient(to bottom, #2a2139 75%, #34294f)",
  );
  expect(synthwave.css).toContain("background-color: transparent !important");
  expect(synthwave.colors.find(({ id }) => id === "canvas")!.description).toContain("single solid");
});
