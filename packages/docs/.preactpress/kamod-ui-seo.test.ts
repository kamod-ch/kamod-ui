import { describe, expect, it } from "vitest";
import { kamodUiStructuredDataHead } from "./kamod-ui-seo";

const site = {
  url: "https://ui.kamod.ch",
  base: "/",
  title: "Kamod UI",
  description: "Preact UI components and blocks for Tailwind.",
};

function parseJsonLd(tag: ReturnType<typeof kamodUiStructuredDataHead>[number]): unknown {
  expect(tag[0]).toBe("script");
  return JSON.parse(tag[2] as string);
}

describe("kamodUiStructuredDataHead", () => {
  it("emits WebSite and SoftwareApplication on the home route", () => {
    const tags = kamodUiStructuredDataHead({
      route: "/",
      title: "Kamod UI — Preact UI components & blocks",
      description: site.description,
      site,
    });
    expect(tags).toHaveLength(2);
    const types = tags.map((tag) => (parseJsonLd(tag) as { "@type": string })["@type"]);
    expect(types).toEqual(["WebSite", "SoftwareApplication"]);
    const app = parseJsonLd(tags[1]) as { applicationSubCategory: string };
    expect(app.applicationSubCategory).toContain("Preact UI");
  });

  it("emits SoftwareApplication and TechArticle on getting started", () => {
    const tags = kamodUiStructuredDataHead({
      route: "/docs/getting-started",
      title: "Getting Started with Kamod UI",
      description: "Preact UI setup guide.",
      site,
    });
    expect(tags).toHaveLength(2);
    const types = tags.map((tag) => (parseJsonLd(tag) as { "@type": string })["@type"]);
    expect(types).toEqual(["SoftwareApplication", "TechArticle"]);
  });

  it("returns no extra tags on other routes", () => {
    expect(
      kamodUiStructuredDataHead({
        route: "/docs/button",
        title: "Button",
        description: "Button component.",
        site,
      }),
    ).toEqual([]);
  });
});
