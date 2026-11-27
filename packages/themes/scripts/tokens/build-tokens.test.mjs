import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  assertCssNameMap,
  checkTokens,
  mergeTokenDocuments,
  TokenBuildError,
  validateTokens,
} from "./build-tokens.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const color = (hex, components) => ({
  $type: "color",
  $value: { colorSpace: "srgb", components, hex },
});

const namesFor = (paths) =>
  new Map(paths.map((tokenPath) => [tokenPath, `--${tokenPath.split(".").at(-1)}`]));

describe("token build", () => {
  it("rejects two modes that define the same token path", () => {
    expect(() =>
      mergeTokenDocuments([
        {
          file: "semantic/kamod/light.json",
          data: { color: { background: color("#ffffff", [1, 1, 1]) } },
        },
        {
          file: "semantic/kamod/dark.json",
          data: { color: { background: color("#000000", [0, 0, 0]) } },
        },
      ]),
    ).toThrow(
      /Tokenpfad color\.background ist in semantic\/kamod\/light\.json und semantic\/kamod\/dark\.json/,
    );
  });

  it("rejects an unknown type with the token path", () => {
    const merged = mergeTokenDocuments([
      {
        file: "semantic/fixture.json",
        data: { color: { ink: { $type: "paint", $value: "#fff" } } },
      },
    ]);
    expect(() => validateTokens({ ...merged, cssNames: namesFor(["color.ink"]) })).toThrow(
      TokenBuildError,
    );
    expect(() => validateTokens({ ...merged, cssNames: namesFor(["color.ink"]) })).toThrow(
      /Tokenpfad color\.ink .* unbekannten Typ "paint"/,
    );
  });

  it("rejects a missing alias with the token path", () => {
    const merged = mergeTokenDocuments([
      {
        file: "semantic/fixture.json",
        data: { color: { action: { primary: { $type: "color", $value: "{color.missing}" } } } },
      },
    ]);
    expect(() =>
      validateTokens({ ...merged, cssNames: namesFor(["color.action.primary"]) }),
    ).toThrow(/Tokenpfad color\.action\.primary .* \{color\.missing\}/);
  });

  it("rejects an alias cycle with the token path", () => {
    const merged = mergeTokenDocuments([
      {
        file: "semantic/fixture.json",
        data: {
          color: {
            a: { $type: "color", $value: "{color.b}" },
            b: { $type: "color", $value: "{color.a}" },
          },
        },
      },
    ]);
    expect(() => validateTokens({ ...merged, cssNames: namesFor(["color.a", "color.b"]) })).toThrow(
      /Tokenpfad color\.a .* Zyklus: color\.a → color\.b → color\.a/,
    );
  });

  it("rejects two token paths that publish the same CSS name", () => {
    expect(() =>
      assertCssNameMap({
        "color.action.primary": "--primary",
        "color.other": "--primary",
      }),
    ).toThrow(/CSS-Name --primary ist color\.action\.primary und color\.other zugeordnet/);
  });

  it("keeps the generated primary declaration aligned with the token source", async () => {
    const css = readFileSync(path.join(packageRoot, "src/generated/default-light.css"), "utf8");
    expect(css).toContain("--primary: oklch(0.145 0 0);");
    expect(css).toContain("--button-height: 2rem;");
    expect(css).not.toContain("--button-foreground:");
    await expect(checkTokens()).resolves.toEqual([]);
  });
});
