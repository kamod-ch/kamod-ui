import { describe, expect, it } from "vitest";
import { codeLanguageForFile, normalizeCodeLanguage, resolveCodeLanguage } from "./code-language";

describe("snippet language inference", () => {
  it.each([
    ['const message = "<script>";', "javascript"],
    ['import "./theme.css";', "javascript"],
    ['export { Button } from "./button";', "javascript"],
    ['export default { content: ["./src/**/*.tsx"] };', "javascript"],
    ["return { value: true };", "javascript"],
    ["type Props = { children: ComponentChildren };", "typescript"],
    ["export interface Item { title: string; }", "typescript"],
    ["type Value<T> = Array<T>;", "typescript"],
    ["export function Demo() { return <button>Save</button>; }", "jsx"],
    ["const Demo = (props: Props) => <Button onClick={props.save} />;", "tsx"],
    ['<Button variant="outline">Save</Button>', "jsx"],
    ["<div>{value}</div>", "jsx"],
    ['<svg viewBox="0 0 16 16"><path d="M0 0" /></svg>', "markup"],
    ["<!doctype html><html><script>const x = 1;</script></html>", "markup"],
    ['{"private": true, "scripts": {"dev": "vite"}}', "json"],
    ['{ "private": true, // JSON with comments\n}', "json"],
    [":root { --primary: #123456; }", "css"],
    ["button { color: red; }", "css"],
    ['@import "tailwindcss";', "css"],
    ["pnpm add @kamod-ch/ui", "bash"],
    ["export NODE_ENV=production", "bash"],
    ['#!/usr/bin/env bash\necho "$value"', "bash"],
    ["name: build\njobs:\n  test:\n    runs-on: ubuntu-latest", "yaml"],
    ["diff --git a/a.ts b/a.ts\n--- a/a.ts\n+++ b/a.ts\n@@ -1 +1 @@\n-old\n+new", "diff"],
    ["# Setup\n\nUse **shared styles**.", "markdown"],
  ])("recognizes source without metadata: %s", (source, language) => {
    expect(resolveCodeLanguage(source)).toBe(language);
    expect(resolveCodeLanguage(source, "text")).toBe(language);
    expect(resolveCodeLanguage(source, "unrecognized-label")).toBe(language);
  });

  it.each([
    "Keep shared styles at the app entry point.",
    "MIT License\nCopyright (c) Kamod",
    "src/components/\n  app.tsx\n  types.ts",
    "README\n├── src\n└── package.json",
    "Warning: optional dependencies were skipped.",
    "Use an import statement before rendering your component.",
    "",
  ])("leaves non-code content as plain text: %s", (source) => {
    expect(resolveCodeLanguage(source)).toBe("text");
  });

  it("prefers a recognized explicit grammar, then the file, then the content", () => {
    expect(resolveCodeLanguage("const value = 1;", "ts", "file.js")).toBe("typescript");
    expect(resolveCodeLanguage("const value = 1;", "text", "file.ts")).toBe("typescript");
    expect(resolveCodeLanguage("const value = 1;", undefined, "LICENSE")).toBe("javascript");
    expect(resolveCodeLanguage("<Button />", "ts")).toBe("tsx");
    expect(resolveCodeLanguage("type Values<T> = Array<T>;", "ts")).toBe("typescript");
  });

  it.each([
    [" TS ", "typescript"],
    ["js", "javascript"],
    ["language-tsx", "tsx"],
    ["shell", "bash"],
    ["yml", "yaml"],
    ["diff", "diff"],
    ["html", "markup"],
    ["src/App.tsx", "tsx"],
    ['json title="package.json"', "json"],
    ["constructor", "text"],
  ])("normalizes %s", (label, language) => expect(normalizeCodeLanguage(label)).toBe(language));

  it("understands source positions and URL suffixes without confusing folder extensions", () => {
    expect(codeLanguageForFile("src/file.ts?raw")).toBe("typescript");
    expect(codeLanguageForFile("file.ts:12:4")).toBe("typescript");
    expect(codeLanguageForFile("folder.ts/README")).toBe("text");
  });
});
