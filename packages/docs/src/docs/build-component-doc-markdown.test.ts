import { describe, expect, it } from "vitest";
import { buildComponentDocMarkdown } from "./build-component-doc-markdown";

describe("buildComponentDocMarkdown", () => {
  it("exports the component-specific guidance and source example instead of the old short blurb", () => {
    const markdown = buildComponentDocMarkdown(
      "Progress",
      "pnpm add @kamod-ch/ui",
      [{ id: "accessibility", title: "Accessibility Notes", text: "Legacy short description." }],
      "progress",
    );
    expect(markdown).not.toContain("Legacy short description.");
    expect(markdown).toContain("### Built-in behavior and defaults");
    expect(markdown).toContain('role="progressbar"');
    expect(markdown).toContain("```tsx");
    expect(markdown).toContain("### Verify the complete interaction");
    expect(markdown).toContain("3. Enable reduced motion");
  });
  it("puts the alias note before section content", () => {
    const markdown = buildComponentDocMarkdown("Button", "pnpm add @kamod-ch/ui", [
      { id: "installation", title: "Installation", text: "Install the package." },
      { id: "usage", title: "Usage", text: "Use the component." },
    ]);

    expect(markdown).toContain(
      "> Demo snippets in this app use the local `@/components/kamod-ui/*` alias. For real app code, install `@kamod-ch/ui` and import from that package.",
    );
    expect(markdown.indexOf("alias")).toBeLessThan(markdown.indexOf("## Installation"));
    expect(markdown.indexOf("## Installation")).toBeLessThan(
      markdown.indexOf("pnpm add @kamod-ch/ui"),
    );
  });
});
