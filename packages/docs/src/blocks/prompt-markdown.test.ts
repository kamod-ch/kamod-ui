/** @vitest-environment jsdom */
import { expect, it } from "vitest";
import { renderPromptMarkdown } from "./prompt-markdown";

it("renders headings, lists, inline code and source without changing fenced source", () => {
  const root = document.createElement("div");
  root.innerHTML = renderPromptMarkdown(
    "# Setup\n\n## Instructions\n\n1. Read **the app** and `package.json`.\n2. Add the block.\n\n```tsx\nexport const Demo = () => <div>Hello</div>;\n```",
  );
  expect(root.querySelector("h5")?.textContent).toBe("Setup");
  expect(root.querySelectorAll("ol li")).toHaveLength(2);
  expect(root.querySelector("strong")?.textContent).toBe("the app");
  expect(root.querySelector("pre code")?.textContent).toBe(
    "export const Demo = () => <div>Hello</div>;\n",
  );
  expect(root.querySelector("pre div")).toBeNull();
  expect(root.querySelector("pre code")?.className).toBe("language-tsx");
  expect(root.querySelector("pre .token.keyword")?.textContent).toBe("export");
});

it("uses the fence grammar and infers unknown labels without activating embedded HTML", () => {
  const root = document.createElement("div");
  root.innerHTML = renderPromptMarkdown(
    [
      '```js\nconst label = "<script>";\n```',
      "```css\n.panel { color: red; }\n```",
      "```unavailable\n<script>alert(1)</script>\n```",
    ].join("\n\n"),
  );
  expect([...root.querySelectorAll("pre")].map((el) => el.dataset.language)).toEqual([
    "javascript",
    "css",
    "markup",
  ]);
  expect(root.querySelector(".language-javascript")?.textContent).toBe(
    'const label = "<script>";\n',
  );
  expect(root.querySelector(".language-css .token.property")?.textContent).toBe("color");
  expect(root.querySelector(".language-markup")?.textContent).toBe("<script>alert(1)</script>\n");
  expect(root.querySelector("script")).toBeNull();
});

it.each([
  ["", "const ready = true;", "javascript"],
  ["text", '{ "name": "demo" }', "json"],
  ["unknown", ".panel { color: red; }", "css"],
  ["TS", "const ready: boolean = true;", "typescript"],
  ["typescript", "const ready = true;", "typescript"],
  ["unknown src/theme.css", ":root { --surface: white; }", "css"],
  ["src/App.tsx", "export const App = () => <main />;", "tsx"],
  ["unavailable", "A plain message for the reader.", "text"],
])("resolves the %j fence and preserves its exact source", (label, source, language) => {
  const root = document.createElement("div");
  root.innerHTML = renderPromptMarkdown(`\`\`\`${label}\n${source}\n\`\`\``);
  expect(root.querySelector("pre")?.dataset.language).toBe(language);
  expect(root.querySelector("pre code")?.textContent).toBe(`${source}\n`);
  expect(Boolean(root.querySelector(".token"))).toBe(language !== "text");
});

it("keeps subsection hierarchy and Markdown emphasis in the rendered brief", () => {
  const root = document.createElement("div");
  root.innerHTML = renderPromptMarkdown(
    "# Task\n\n## Integrate\n\n### Connect data\n\n**Keep** the *existing* `onNavigate` callback.\n\n> Review the result.\n\n---",
  );
  expect(root.querySelector('[data-prompt-depth="3"]')?.textContent).toBe("Connect data");
  expect(root.querySelector("strong")?.textContent).toBe("Keep");
  expect(root.querySelector("em")?.textContent).toBe("existing");
  expect(root.querySelector("blockquote")?.textContent).toContain("Review the result.");
  expect(root.querySelector("hr")).not.toBeNull();
});

it("keeps embedded HTML and unsafe links inert without requesting remote images", () => {
  const root = document.createElement("div");
  root.innerHTML = renderPromptMarkdown(
    '<script>alert(1)</script>\n\n<img src="x" onerror="alert(1)">\n\n[bad](javascript:alert%281%29) [data](data:text/html,test) [safe](https://ui.kamod.ch/)\n\n![example](https://example.com/tracking.png)',
  );
  expect(root.querySelector("script, img, [onerror]")).toBeNull();
  expect(root.querySelectorAll("a")).toHaveLength(1);
  expect(root.querySelector("a")?.href).toBe("https://ui.kamod.ch/");
  expect(root.textContent).toContain("<script>alert(1)</script>");
  expect(root.textContent).toContain("example");
});

it("includes linked language metadata for anonymous fences and preserves named paths", () => {
  const root = document.createElement("div");
  root.innerHTML = renderPromptMarkdown(
    "```tsx\nexport const Demo = () => <div />;\n```\n\n```css src/theme.css\nbody { color: red; }\n```",
  );
  const link = root.querySelector(".docs-code-toolbar a")!;
  expect(link.textContent).toBe("TypeScript");
  expect(link.querySelectorAll("svg")).toHaveLength(2);
  expect(link.closest("code")).not.toBeNull();
  expect(root.querySelector(".docs-code-file-path")?.textContent).toBe("src/theme.css");
  expect(root.querySelectorAll("pre .token").length).toBeGreaterThan(0);
});
