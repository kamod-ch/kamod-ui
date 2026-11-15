import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const shellFiles = [
  "src/docs/DocsComponentContent.tsx",
  "src/docs/components/component-detail/ComponentExample.tsx",
  "src/docs/components/component-detail/ComponentExampleLinks.tsx",
  "src/docs/components/component-detail/ComponentReferences.tsx",
  "src/home/HomePage.tsx",
  "src/home/HomeExamples.tsx",
  "src/docs/overview/OverviewPreviews.tsx",
  "src/layout/navigation/NavigationDirectory.tsx",
  "src/layout/navigation/SiteNavigation.tsx",
  "src/layout/navigation/NavigationEntryLink.tsx",
  "src/layout/navigation/NavigationMenuFooter.tsx",
  "src/layout/navigation/NavigationMenuHeader.tsx",
  "src/layout/tooltips/ApplicationTooltips.tsx",
  "src/theme/SiteColorSchemeMenu.tsx",
  "src/theme/ColorModeMenuParts.tsx",
];

function runtimeSource(source: string) {
  return source.replace(/`(?:\\[\s\S]|[^`])*`/g, "``");
}

describe("docs shell imports", () => {
  it("keeps the homepage and shared docs shell off the @kamod-ch/ui barrel", () => {
    for (const file of shellFiles) {
      const source = runtimeSource(readFileSync(new URL(`../../${file}`, import.meta.url), "utf8"));
      expect(source, file).not.toMatch(/from "@kamod-ch\/ui"/);
    }
  });

  it("loads each docs page through a client-only dynamic import", () => {
    const plugin = readFileSync(
      new URL("../../.preactpress/block-pages-plugin.ts", import.meta.url),
      "utf8",
    );
    expect(plugin).toContain("export const docs = {}; export const loaders = {");
    expect(plugin).toContain("() => import(");
  });
});
