import { expect, it } from "vitest";
import { findCodeImports } from "./code-imports";

it("folds default, multiline, type, namespace and side-effect imports", () => {
  const source = `import App from './App';
import {
  Button,
  type ButtonProps,
} from '@kamod-ch/ui';
import type { ComponentChildren } from 'preact';
import * as helpers from './helpers';
import './styles.css';

export const Example = () => <Button>Save</Button>;`;
  expect(findCodeImports(source, "tsx")).toEqual({
    count: 5,
    folded: "export const Example = () => <Button>Save</Button>;",
  });
});

it("supports semicolon-free imports, CRLF, comments and import attributes", () => {
  const source =
    'import Foo from "foo"\r\nimport { /* keep */ Bar as Baz } from "bar"\r\nimport data from "./data.json" with { type: "json" };\r\n\r\nuse(Foo, Baz, data);';
  expect(findCodeImports(source, "typescript")).toEqual({
    count: 3,
    folded: "use(Foo, Baz, data);",
  });
});

it("preserves license comments, directives and documentation below the imports", () => {
  const source = `// License
"use client";
import { Button } from "ui";
// Explanation
import './styles.css';
/** Example documentation. */
export const Example = Button;`;
  const result = findCodeImports(source, "tsx")!;
  expect(result.count).toBe(2);
  expect(result.folded).toContain('// License\n"use client";');
  expect(result.folded).toContain("// Explanation");
  expect(result.folded).toContain("/** Example documentation. */");
});

it.each([
  ['const text = `\nimport Fake from "fake";\n`; ', "tsx"],
  ['// import Fake from "fake";', "javascript"],
  ['import("./lazy");', "typescript"],
  ["import.meta.env.MODE", "javascript"],
  ["import { incomplete", "tsx"],
  ['import Foo = require("foo");', "typescript"],
  ['import Foo from "foo";', "text"],
  ['import Foo from "foo";', "markdown"],
  ['@import "tailwindcss";', "css"],
] as const)("leaves unsupported or non-static source untouched: %s", (source, language) => {
  expect(findCodeImports(source, language)).toBeNull();
});

it("stops at executable code and never removes import-like content from its body", () => {
  const body = 'const example = `\nimport fake from "fake";\n`;\nconst lazy = import("lazy");';
  expect(findCodeImports(`import "styles";\n${body}`, "jsx")).toEqual({ count: 1, folded: body });
  expect(findCodeImports('import "styles"; doSomething();', "javascript")?.folded).toBe(
    " doSomething();",
  );
});

it("handles an imports-only snippet", () => {
  expect(findCodeImports('import "styles";', "javascript")).toEqual({ count: 1, folded: "" });
});

it.each(["\n", "\r\n"])(
  "removes complete import lines after a header with %j line endings",
  (newline) => {
    const source = [
      "/** File header. */",
      "import {",
      "  Button,",
      "  Input,",
      '} from "ui";',
      "",
      'import type { ComponentChildren } from "preact";',
      "",
      'import "./styles.css";',
      "",
      "/** Component documentation. */",
      "const template = `Keep\n\n\nthese blank lines`; ",
    ].join(newline);
    expect(findCodeImports(source, "tsx")).toEqual({
      count: 3,
      folded: [
        "/** File header. */",
        "",
        "/** Component documentation. */",
        "const template = `Keep\n\n\nthese blank lines`; ",
      ].join(newline),
    });
  },
);

it("keeps trailing comments and same-line statements when hiding imports", () => {
  const source =
    '/** Header */\nimport "styles"; // Keep this explanation\nimport Foo from "foo"; use(Foo);';
  expect(findCodeImports(source, "typescript")?.folded).toBe(
    "/** Header */\n // Keep this explanation\n use(Foo);",
  );
});

it("leaves a long incomplete default import visible after a complete declaration", () => {
  const incomplete = `import App${" ".repeat(8_000)}!`;
  expect(findCodeImports(incomplete, "typescript")).toBeNull();
  expect(findCodeImports(`import "styles";\n${incomplete}`, "typescript")).toEqual({
    count: 1,
    folded: incomplete,
  });
});

it("accepts long import trivia without folding unsupported import assignments", () => {
  const gap = " \t".repeat(4_000);
  const body = "const value = App;";
  expect(findCodeImports(`import App${gap}from "app";\n${body}`, "typescript")).toEqual({
    count: 1,
    folded: body,
  });
  expect(findCodeImports(`import App${gap}= require("app");\n${body}`, "typescript")).toBeNull();
});

it.each(["\n", "\r\n"])(
  "preserves retained comments and source after long blank prefixes: %j",
  (newline) => {
    const header = "/** License notice. */  ";
    const body = `// Keep these lines${newline}${newline}${newline}const value = 1;`;
    const source = `${newline.repeat(8_000)}${header}${newline}import "styles";${newline}${newline}${body}`;
    expect(findCodeImports(source, "typescript")).toEqual({
      count: 1,
      folded: `${header}${newline}${newline}${body}`,
    });
  },
);

it("folds multiple declarations on the same line without changing the remaining body", () => {
  const body = " /* Keep this comment. */ const value = 1;";
  expect(findCodeImports('import "styles";'.repeat(2_000) + body, "javascript")).toEqual({
    count: 2_000,
    folded: body,
  });
});
