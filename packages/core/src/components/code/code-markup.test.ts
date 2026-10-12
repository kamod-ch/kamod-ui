/** @vitest-environment jsdom */
import { expect, it } from "vitest";
import { findCodeImports } from "./code-imports";
import { escapeCodeHtml, selectCodeMarkup } from "./code-markup";
import { readableCodeLines } from "./code-wrap";
import { highlightCode } from "./highlight-code";

it.each([
  'import { Button } from "ui";\n\nexport const Example = () => <Button title="a & b">Save</Button>;',
  '/** License. */\n"use client";\nimport {\n Button,\n} from "ui";\n\n// Keep this explanation.\nimport "styles";\n\n\n/** The body. */\nconst value = `<a> & ${other}`;',
  'import Foo from "foo"; // Keep this comment.\nimport "styles"; use(Foo);',
  '/** Header. */\r\nimport "styles";\r\n\r\nconst x = "<span> & \\\"quoted\\\"";\r\n',
  '/** Header. */\r\nimport "styles";\n\n\nconst x = true;',
  '\n\nimport "styles";\n\n/* First line\n   Continued comment. */\nexport const x = 1;',
  `${'import "styles";'.repeat(200)} /* Keep this. */ const x = 1;`,
])("preserves retained source and colors without retokenizing imports: %j", (source) => {
  const imports = findCodeImports(source, "tsx")!;
  expect(
    imports.parts
      .map((part) => (typeof part === "string" ? part : source.slice(part.start, part.end)))
      .join(""),
  ).toBe(imports.folded);
  for (const html of [escapeCodeHtml(source), highlightCode(source, "tsx")]) {
    const foldedHtml = selectCodeMarkup(html, imports.parts);
    const code = document.createElement("code");
    code.innerHTML = readableCodeLines(foldedHtml, imports.folded);
    expect(code.textContent).toBe(imports.folded);
    expect(code.querySelector(".docs-code-line .docs-code-line")).toBeNull();
    if (html.includes('class="token')) expect(code.querySelector(".token")).not.toBeNull();
  }
});

it("reopens a token spanning a removed source range without changing its class", () => {
  const source = "/* First\n hidden\n last */";
  const code = document.createElement("code");
  code.innerHTML = selectCodeMarkup(highlightCode(source, "tsx"), [
    { start: 0, end: 8 },
    { start: 16, end: source.length },
  ]);
  expect(code.textContent).toBe(source.slice(0, 8) + source.slice(16));
  expect(code.querySelectorAll(".token.comment")).toHaveLength(2);
});
