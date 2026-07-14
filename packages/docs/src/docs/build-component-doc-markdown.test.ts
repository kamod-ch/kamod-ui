import { describe, expect, it } from "vitest";
import { buildComponentDocMarkdown } from "./build-component-doc-markdown";

describe("buildComponentDocMarkdown", () => {
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
