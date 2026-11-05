import render from "preact-render-to-string";
import { describe, expect, it } from "vitest";
import { DocsComponentContent } from "./DocsComponentContent";

describe("DocsComponentContent slug resolution", () => {
  it("renders an unknown slug message instead of accordion content", () => {
    const requested = "not-a-registered-doc-slug";
    const html = render(<DocsComponentContent slug={requested} section="installation" />);
    expect(html).toContain(requested);
    expect(html).toContain("No documentation page is registered for slug");
    expect(html).not.toContain('id="component-preview"');
    expect(html.replace(/<[^>]+>/g, " ")).not.toMatch(/\bAccordion\b/);
  });

  it("renders a known component slug normally", () => {
    const html = render(<DocsComponentContent slug="button" section="installation" />);
    expect(html).toContain('id="component-preview"');
    expect(html).toContain('id="installation"');
    expect(html.replace(/<[^>]+>/g, " ")).toMatch(/\bButton\b/);
  });
});
