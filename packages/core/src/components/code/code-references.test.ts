import { expect, it } from "vitest";
import { findCodeImports } from "./code-imports";
import { escapeCodeHtml, selectCodeMarkup } from "./code-markup";
import { linkCodeMarkup } from "./code-reference-markup";
import { referenceTokens } from "./code-reference-tokens";
import { type CodeReferenceResolver, findCodeReferences } from "./code-references";
import { readableCodeLines } from "./code-wrap";

const resolve: CodeReferenceResolver = ({ module, imported }) =>
  `https://example.test/${module}/${imported ?? "package"}`;
const labels = (code: string) =>
  findCodeReferences(code, "tsx", resolve).map(({ start, end }) => code.slice(start, end));

it("links named, aliased, default, type and namespace imports and their later uses", () => {
  const code = `import Default from "default";
import { Button as Action, type CardProps } from "ui";
import * as UI from "ui";
import "styles";
const props: CardProps = {};
const Example = () => <UI.Card><Action /><Default /></UI.Card>;`;
  expect(labels(code)).toEqual([
    "Default",
    "default",
    "Button",
    "Action",
    "CardProps",
    "ui",
    "UI",
    "ui",
    "styles",
    "CardProps",
    "UI",
    "Card",
    "Action",
    "Default",
    "UI",
    "Card",
  ]);
  expect(
    findCodeReferences(code, "tsx", resolve)
      .filter((r) => code.slice(r.start, r.end) === "Action")
      .map((r) => r.href),
  ).toEqual(["https://example.test/ui/Button", "https://example.test/ui/Button"]);
});

it("leaves comments, JSX prose/attributes, literal strings, regexes and object properties alone", () => {
  const code = `import { Button } from "ui";
// Button
const text = "Button";
const pattern = /Button <Button>/;
const literal = \`Button \${Button}\`;
const value = object.Button;
const keyed = { Button: false };
const Example = () => <div Button="Button">Button <Button title="Button" /></div>;`;
  expect(labels(code)).toEqual(["Button", "ui", "Button", "Button"]);
});

it("respects function parameter and block-local shadowing without suppressing outer uses", () => {
  const code = `import { Button } from "ui";
const Before = <Button />;
function Local(Button) { return <Button />; }
const Short = Button => <Button />;
function Destructured() { const { Button } = local; return <Button />; }
const Arrow = (Button) => { return <Button />; };
{ const Button = local; use(Button); }
const After = <Button />;`;
  expect(labels(code)).toEqual(["Button", "ui", "Button", "Button"]);
});

it("does not invent links in literal languages, escaped module specifiers or unverified destinations", () => {
  expect(findCodeReferences('import { Button } from "ui";', "text", resolve)).toEqual([]);
  expect(labels('const module = import("ui");')).toEqual(["ui"]);
  expect(labels('import { Button } from "u\\\\i";')).toEqual([]);
  expect(
    findCodeReferences('import { Button } from "ui";', "tsx", () => "javascript:alert(1)"),
  ).toEqual([]);
  expect(referenceTokens("/* unmatched", true)).toEqual([]);
});

it.each([false, true])(
  "preserves exact source and balanced anchors through folding/wrapping (highlight=%s)",
  (highlighted) => {
    const source =
      'import { Button } from "ui";\r\n\r\nexport const Example = () => <Button title="a & b">Save</Button>;\r\n';
    const html = linkCodeMarkup(
      highlighted
        ? `<span class="token tag">${escapeCodeHtml(source)}</span>`
        : escapeCodeHtml(source),
      findCodeReferences(source, "tsx", resolve),
    );
    const node = document.createElement("code");
    node.innerHTML = html;
    expect(node.textContent).toBe(source.replaceAll("\r\n", "\n"));
    expect(node.querySelectorAll("a")).toHaveLength(4);
    expect(node.querySelector("a a")).toBeNull();
    const imports = findCodeImports(source, "tsx")!;
    node.innerHTML = readableCodeLines(selectCodeMarkup(html, imports.parts), imports.folded);
    expect(node.textContent).toBe(imports.folded);
    expect([...node.querySelectorAll("a")].map((a) => a.textContent)).toEqual(["Button", "Button"]);
    expect(node.querySelector("a a")).toBeNull();
    if (highlighted) expect(node.querySelector(".token.tag a")).not.toBeNull();
  },
);

it("escapes destination attributes without creating extra elements", () => {
  const node = document.createElement("code");
  node.innerHTML = linkCodeMarkup("Button", [
    {
      start: 0,
      end: 6,
      href: 'https://example.test/?x="<img>&y=1',
      module: 'ui" data-fake="<img>',
    },
  ]);
  expect(node.textContent).toBe("Button");
  expect(node.querySelectorAll("a")).toHaveLength(1);
  expect(node.querySelector("img")).toBeNull();
  expect(node.querySelector("a")?.getAttribute("data-code-module")).toBe('ui" data-fake="<img>');
  expect(node.querySelector("a")?.hasAttribute("data-fake")).toBe(false);
});
