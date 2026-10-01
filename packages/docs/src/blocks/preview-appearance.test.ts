import { describe, expect, it } from "vitest";
import { previewAppearanceFromSearch, previewAppearanceUrl } from "./preview-appearance";

describe("preview appearance links", () => {
  it("round-trips explicit appearance without losing a deployment prefix", () => {
    const appearance = { preset: "ocean", scheme: "dark" } as const;
    const href = previewAppearanceUrl("/kamod-ui/blocks/signup/signup-01/preview", appearance);
    const url = new URL(href, "https://example.com");
    expect(url.pathname).toBe("/kamod-ui/blocks/signup/signup-01/preview");
    expect(previewAppearanceFromSearch(url.search)).toEqual(appearance);
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
