import { describe, expect, it } from "vitest";
import { getShowcaseCodeTarget } from "./ShowcaseCodeLink";
import { parseShowcasePreferences } from "./useShowcasePreferences";

describe("showcase preference validation", () => {
  it("keeps supported selections", () => {
    const preferences = {
      view: "prompt",
      promptMode: "adapt",
      promptDisplay: "markdown",
      viewport: "tablet",
      appearance: { preset: "ocean", scheme: "dark" },
    };
    expect(parseShowcasePreferences(JSON.stringify(preferences))).toEqual(preferences);
  });
  it.each(["invalid", "null", "[]", "42"])("ignores invalid saved data: %s", (raw) => {
    expect(parseShowcasePreferences(raw)).toEqual({});
  });
  it("retains valid fields when other settings are obsolete", () => {
    expect(
      parseShowcasePreferences(
        JSON.stringify({
          view: "code",
          promptMode: "obsolete",
          promptDisplay: "obsolete",
          viewport: "wide",
          appearance: { preset: "removed", scheme: "dark" },
        }),
      ),
    ).toEqual({ view: "code" });
  });
});

it("only treats registered source fragments as overrides for the saved view", () => {
  const files = [{ label: "components/nav.tsx" }];
  expect(getShowcaseCodeTarget("sidebar-05", files, "#sidebar-05-code")).toEqual({});
  expect(
    getShowcaseCodeTarget("sidebar-05", files, "#sidebar-05-code/components%2Fnav.tsx"),
  ).toEqual({ file: "components/nav.tsx" });
  for (const hash of [
    "#sidebar-05-code/unknown.tsx",
    "#sidebar-05-code/%invalid",
    "#other-code",
    "#sidebar-05-copy",
  ]) {
    expect(getShowcaseCodeTarget("sidebar-05", files, hash)).toBeUndefined();
  }
});
