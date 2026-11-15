/** @vitest-environment jsdom */
import { describe, expect, it } from "vitest";
import {
  applyPreviewAppearance,
  previewAppearanceFromSearch,
  previewAppearanceUrl,
} from "./preview-appearance";

describe("preview appearance links", () => {
  it("round-trips explicit appearance without losing a deployment prefix", () => {
    const appearance = { preset: "ocean", scheme: "dark" } as const;
    const href = previewAppearanceUrl("/kamod-ui/blocks/signup/signup-01/preview", appearance);
    const url = new URL(href, "https://example.com");
    expect(url.pathname).toBe("/kamod-ui/blocks/signup/signup-01/preview");
    expect(previewAppearanceFromSearch(url.search)).toEqual(appearance);
  });

  it("scopes a nested demo so its preset and scheme do not inherit the page", () => {
    const demo = document.createElement("div");
    document.body.append(demo);
    applyPreviewAppearance(demo, { preset: "ocean", scheme: "light", dir: "rtl" });
    expect(demo).toHaveAttribute("data-theme-scope", "");
    expect(demo).toHaveAttribute("data-theme", "ocean");
    expect(demo).not.toHaveClass("dark");
    expect(demo).toHaveAttribute("dir", "rtl");
    expect(demo).toHaveStyle({ colorScheme: "light" });

    applyPreviewAppearance(document.documentElement, { preset: "kamod", scheme: "dark" });
    expect(document.documentElement.hasAttribute("data-theme-scope")).toBe(false);
    expect(document.documentElement).toHaveAttribute("data-theme", "kamod");
    expect(document.documentElement).toHaveClass("dark");
    demo.remove();
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.classList.remove("dark", "theme-switching");
    document.documentElement.style.colorScheme = "";
  });

  it.each([
    "",
    "?previewTheme=ocean",
    "?previewTheme=unknown&previewScheme=dark",
    "?previewTheme=kamod&previewScheme=system",
  ])("ignores incomplete or unrecognized overrides: %s", (search) => {
    expect(previewAppearanceFromSearch(search)).toBeUndefined();
  });
});
