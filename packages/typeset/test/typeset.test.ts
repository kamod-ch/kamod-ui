import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import pkg from "../package.json" with { type: "json" };
import { generateTypesetPresetsCss, typesetPresets } from "../src/presets";

const css = readFileSync(new URL("../src/typeset.css", import.meta.url), "utf8");

it("defines package CSS and JS exports", () => {
  expect(pkg.exports["."]).toBe("./dist/typeset.css");
  expect(pkg.exports["./typeset.css"]).toBe("./dist/typeset.css");
  expect(pkg.exports["./presets.css"]).toBe("./dist/presets.css");
  expect(pkg.exports["./generator"]).toBeTruthy();
});

it("ships all required presets with complete metadata", () => {
  expect(typesetPresets.map((preset) => preset.id)).toEqual([
    "default",
    "docs",
    "reading",
    "chat",
    "compact",
    "large",
  ]);
  for (const preset of typesetPresets) {
    expect(preset.label).toBeTruthy();
    expect(preset.description).toBeTruthy();
    expect(preset.className).toMatch(/^typeset/);
    expect(preset.values.size).toBeTruthy();
    expect(preset.values.leading).toBeGreaterThanOrEqual(1);
    expect(preset.values.flow).toBeTruthy();
  }
});

it("generates preset CSS from metadata", () => {
  const presetsCss = generateTypesetPresetsCss();
  for (const id of ["docs", "reading", "chat", "compact", "large"]) {
    expect(presetsCss).toContain(`.typeset-${id}`);
  }
});

it("contains default rhythm variables and Kamod theme tokens", () => {
  for (const token of [
    "--typeset-size",
    "--typeset-leading",
    "--typeset-flow",
    "--typeset-measure",
  ]) {
    expect(css).toContain(token);
  }
  for (const token of [
    "--background",
    "--foreground",
    "--muted",
    "--muted-foreground",
    "--primary",
    "--border",
    "--card",
    "--card-foreground",
    "--accent",
    "--ring",
    "--radius",
  ]) {
    expect(css).toContain(token);
  }
});

it("supports opt-out and responsive tables", () => {
  expect(css).toContain(".not-typeset");
  expect(css).toContain("[data-not-typeset]");
  expect(css).toContain(".typeset-scroll");
  expect(css).toContain("overflow-x: auto");
});

it("keeps selectors streaming-stable", () => {
  expect(css).not.toMatch(/:last-child|:has\(|:empty/);
  expect(css).not.toContain("!important");
  expect(css).toContain("margin-block-start");
});

it("scopes element styling to the typeset container", () => {
  const forbidden = css
    .split("\n")
    .filter((line) => /^(\s*)(p|h1|ul|ol|table|pre|blockquote|body|html)\b.*\{/.test(line));
  expect(forbidden).toEqual([]);
});
