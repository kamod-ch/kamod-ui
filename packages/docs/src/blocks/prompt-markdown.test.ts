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
