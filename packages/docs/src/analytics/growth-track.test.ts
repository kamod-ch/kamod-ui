/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from "vitest";
import { createMatomoGrowthAdapter } from "./growth-adapter";
import { resetGrowthDedupeForTests } from "./growth-dedupe";
import { sanitizeGrowthMeta } from "./growth-meta";
import { setGrowthAnalyticsAdapterForTests, trackGrowthEvent } from "./growth-track";

describe("growth analytics track", () => {
  afterEach(() => {
    resetGrowthDedupeForTests();
    setGrowthAnalyticsAdapterForTests(null);
    vi.restoreAllMocks();
  });

  it("uses the injected adapter and swallows adapter errors", () => {
    const track = vi.fn(() => {
      throw new Error("network");
    });
    setGrowthAnalyticsAdapterForTests({ track });
    expect(() =>
      trackGrowthEvent("code_copy_success", { exampleId: "docs/button-doc.tsx" }),
    ).not.toThrow();
    expect(track).toHaveBeenCalledOnce();
    trackGrowthEvent("code_copy_success", { exampleId: "docs/button-doc.tsx" });
    expect(track).toHaveBeenCalledOnce();
  });

  it("dedupes rapid duplicate keys", () => {
    const track = vi.fn();
    setGrowthAnalyticsAdapterForTests({ track });
    trackGrowthEvent("template_download_click", { templateId: "saas-team-demo" });
    trackGrowthEvent("template_download_click", { templateId: "saas-team-demo" });
    expect(track).toHaveBeenCalledOnce();
  });

  it("matomo adapter builds a pixel URL without code content", () => {
    const images: { src?: string }[] = [];
    vi.stubGlobal(
      "Image",
      class {
        width = 1;
        height = 1;
        referrerPolicy = "";
        alt = "";
        set src(value: string) {
          images.push({ src: value });
        }
      },
    );
    createMatomoGrowthAdapter({ endpoint: "https://matomo.example/matomo.php", siteId: "3" }).track(
      "demo_open",
      {
        location: "landing",
        templateId: "saas-team-demo",
        exampleId: "src/docs/button.tsx",
        displayMode: "package",
      },
    );
    expect(images[0]?.src).toMatch(/e_a=demo_open/);
    expect(images[0]?.src).toMatch(/dimension1=landing/);
    expect(images[0]?.src).not.toMatch(/import/);
  });
});

describe("sanitizeGrowthMeta", () => {
  it("drops query strings from example ids", () => {
    expect(
      sanitizeGrowthMeta({ exampleId: "path/file.tsx?token=secret" }).exampleId,
    ).toBeUndefined();
  });
});
