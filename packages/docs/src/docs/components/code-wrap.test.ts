/** @vitest-environment jsdom */
import { expect, it } from "vitest";
import { readableCodeLines } from "./code-wrap";
import { highlightCode } from "./highlight-code";

it.each([
  'const value = "<span> & other markup";\n',
  "/* A comment\n\tcontinued on another line\n  and another */\nconst x = 1;",
  "const text = `first line\n    deeply indented ${value}\nlast line`;\n\n",
  '          <Panel>\n            <span title="A long value">Hello</span>\n          </Panel>',
  "\t \tconst x = 1;\r\n\r\n    // Done\r\n",
  "\n   \n",
  "",
])("preserves exact source text and balanced highlight tokens: %j", (source) => {
  const node = document.createElement("code");
  node.innerHTML = readableCodeLines(highlightCode(source, "tsx"), source);
  expect(node.textContent).toBe(source);
  expect(node.querySelectorAll(":scope > .docs-code-line")).toHaveLength(
    source.split(/\r\n|\r|\n/).length,
  );
  expect(node.querySelector(".docs-code-line .docs-code-line")).toBeNull();
  for (const line of node.querySelectorAll(".docs-code-line")) {
    expect(line.firstElementChild?.className).toBe("docs-code-indent");
  }
});

it("keeps multiline comment highlighting on each logical line", () => {
  const source = "/* Start\n    Continue\n End */";
  const node = document.createElement("code");
  node.innerHTML = readableCodeLines(highlightCode(source, "tsx"), source);
  expect(node.querySelectorAll(".docs-code-line > .token.comment")).toHaveLength(3);
  expect(node.children[1].getAttribute("style")).toBe("--code-indent-ch:4ch");
});
