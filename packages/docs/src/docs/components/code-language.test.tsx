/** @vitest-environment jsdom */
import { cleanup, render, waitFor } from "@testing-library/preact";
import { afterEach, expect, it } from "vitest";
import { codeLanguageForFile } from "./code-language";
import { ShowcaseCodePane } from "./ShowcaseCodePane";

afterEach(cleanup);

it.each([
  ["types.d.ts", "export type Values<T> = { value: T };", "typescript"],
  ["button.tsx", "export const Button = () => <button>Save</button>;", "tsx"],
  ["app.mjs", "export const name = 'Kamod';", "javascript"],
  ["button.jsx", "export const Button = () => <button>Save</button>;", "jsx"],
  ["package.json", '{"name": "kamod", "private": true}', "json"],
  ["theme.css", ":root { --primary: #123456; }", "css"],
  ["logo.SVG", '<svg viewBox="0 0 24 24"><path d="M0 0h24" /></svg>', "markup"],
  ["README.md", "# Setup\n\nUse `Preact`.", "markdown"],
  ["setup.sh", 'echo "$HOME"', "bash"],
])(
  "highlights %s with its own grammar without changing source text",
  async (path, source, language) => {
    const { container } = render(
      <ShowcaseCodePane filename={path} filePath={`src/${path}`} code={source} />,
    );
    const pre = container.querySelector("pre")!;
    expect(pre.dataset.language).toBe(language);
    await waitFor(() => expect(pre.querySelector(".token")).not.toBeNull());
    expect(pre.textContent).toBe(source);
    expect(pre.querySelector("svg, button")).toBeNull();
  },
);

it("ignores dotted folder names and unknown extensions instead of guessing TSX", () => {
  for (const path of [
    "LICENSE",
    "folder.ts/README",
    "notes.txt",
    "file.constructor",
    "file.unknown",
  ])
    expect(codeLanguageForFile(path)).toBe("text");
  expect(codeLanguageForFile("src\\types.d.TS")).toBe("typescript");
});
