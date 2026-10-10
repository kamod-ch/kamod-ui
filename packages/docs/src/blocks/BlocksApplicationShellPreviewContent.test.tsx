import { render } from "preact-render-to-string";
import { describe, expect, it, vi } from "vitest";
import { applicationShellBlockMetadata } from "../../../blocks/src/application-shell/metadata";
import { ApplicationShellBlocksPreviewContent } from "./BlocksApplicationShellPreviewContent";

// Importing the iframe entry must never evaluate the surrounding documentation app.
vi.mock("../docs/components/DocsShell", () => {
  throw new Error("Standalone shell previews must not load DocsShell");
});

describe("isolated application shell route", () => {
  for (const block of applicationShellBlockMetadata)
    it(`renders ${block.id} immediately on the server without article chrome or a loading boundary`, () => {
      const html = render(<ApplicationShellBlocksPreviewContent id={block.id} />);
      expect(html).toContain('data-slot="sidebar-wrapper"');
      expect(html).toContain("Kamod UI");
      expect(html).not.toContain("blocks-doc-body");
      expect(html).not.toContain("page-state-loading");
      expect(html).not.toContain("Block not found.");
    });

  it("retains the category recovery link for missing variants", () => {
    const html = render(<ApplicationShellBlocksPreviewContent id="missing" />);
    expect(html).toContain("Block not found.");
    expect(html).toContain('href="/blocks/application-shell"');
  });
});
