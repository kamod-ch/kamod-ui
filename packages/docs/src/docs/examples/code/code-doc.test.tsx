import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "@typescript/typescript6";
import { options } from "preact";
import render from "preact-render-to-string";
import { expect, it } from "vitest";
import { ComponentExample } from "../../components/component-detail/ComponentExample";
import { ComponentExampleCode } from "../../components/component-detail/ComponentExampleCode";
import { DocsComponentContent } from "../../DocsComponentContent";
import { codeDocPage } from "../../pages/code-doc";
import { codeExamples, codeHeroSnippet } from "./code-examples";
import { languageSelectorSnippet } from "./code-guide-languages";
import { controlledCodeSnippet, customControlsSnippet } from "./code-guide-modularity";
import { syntaxThemeSnippet } from "./code-guide-themes";

it("preserves package imports in the actual page's rendered showcase source", () => {
  const snippets: string[] = [];
  const originalHook = options.vnode;
  // Capture the props after the real page has applied its snippet import policy.
  options.vnode = (node) => {
    originalHook?.(node);
    if (
      node.type === ComponentExample &&
      "codeSnippet" in node.props &&
      typeof node.props.codeSnippet === "string"
    ) {
      snippets.push(node.props.codeSnippet);
    }
  };
  let page: string;
  try {
    page = render(<DocsComponentContent slug="code" section="installation" />);
  } finally {
    options.vnode = originalHook;
  }
  expect(page).not.toContain("**Readable Home for Source Code**");
  for (const prop of ["inferLanguage", "showImportControl", "showWrapControl"]) {
    expect(page).toContain(`<code>${prop}={false}</code>`);
    expect(page).not.toContain(`<code>${prop}=</code>`);
  }
  expect(snippets).toHaveLength(11);
  for (const code of snippets) {
    const html = render(<ComponentExampleCode code={code} filePath="src/CodeExample.tsx" />);
    expect(html).toContain("@kamod-ch/ui/code");
    expect(html).not.toContain("@/components/kamod-ui/code");
  }
  // Inner source is data, not another consumer import to rewrite.
  expect(snippets[0]).toContain("@kamod-ch/ui/button");
  expect(snippets[0]).not.toContain("@/components/kamod-ui/code/button");
});

it("keeps the nested reading guide and every example reference reachable", () => {
  const examples: string[] = [];
  const content = codeDocPage.renderMain({
    title: codeDocPage.title,
    sections: codeDocPage.sections,
    activeSectionId: "installation",
    getSectionHref: (id) => `#${id}`,
    renderTitleRow: () => null,
    renderMarkdownAction: () => null,
    renderSectionExtraContent: () => null,
    renderPreviewAndCodeTabs: ({ codeSnippet }) => {
      examples.push(codeSnippet);
      return null;
    },
  });
  const html = render(<>{content}</>);
  expect(examples).toHaveLength(11);
  expect(new Set(examples).size).toBe(examples.length);
  expect(codeDocPage.exampleSectionIds).toEqual(Object.keys(codeExamples));
  for (const section of codeDocPage.sections) {
    expect(html, section.id).toContain(`id="${section.id}"`);
    for (const child of section.children ?? []) {
      expect(html, child.id).toContain(`id="${child.id}"`);
    }
    for (const [, target] of section.text.matchAll(/\]\(#([^)]+)\)/g)) {
      if (target === "component-examples") continue;
      expect(html, target).toContain(`id="${target}"`);
    }
  }
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) {
    // The shared component wrapper owns this example-directory heading.
    if (target === "component-examples") continue;
    expect(html, `Rendered guide link #${target}`).toContain(`id="${target}"`);
  }
});

it("typechecks all copyable variants against the real core Code API", () => {
  const directory = mkdtempSync(
    resolve(import.meta.dirname, "../../../../node_modules/.code-guide-test-"),
  );
  try {
    const snippets = [
      codeHeroSnippet,
      ...Object.values(codeExamples).map(({ code }) => code),
      languageSelectorSnippet,
      controlledCodeSnippet,
      customControlsSnippet,
      syntaxThemeSnippet,
    ];
    const files = snippets.map((snippet, index) => {
      const file = resolve(directory, `example-${index}.tsx`);
      writeFileSync(file, snippet);
      return file;
    });
    const program = ts.createProgram(files, {
      noEmit: true,
      strict: true,
      skipLibCheck: true,
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      jsx: ts.JsxEmit.ReactJSX,
      jsxImportSource: "preact",
      types: [],
      paths: {
        "@kamod-ch/ui/code": [
          resolve(import.meta.dirname, "../../../../../core/src/components/code/index.ts"),
        ],
        "@kamod-ch/ui/button": [
          resolve(import.meta.dirname, "../../../../../core/src/components/button/index.ts"),
        ],
      },
    });
    expect(
      ts.formatDiagnosticsWithColorAndContext(ts.getPreEmitDiagnostics(program), {
        getCanonicalFileName: (path) => path,
        getCurrentDirectory: () => directory,
        getNewLine: () => "\n",
      }),
    ).toBe("");
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}, 30_000);
