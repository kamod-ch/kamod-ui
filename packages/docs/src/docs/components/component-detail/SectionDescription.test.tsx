import render from "preact-render-to-string";
import { describe, expect, it } from "vitest";
import { withBasePath } from "../../../base-path";
import { SectionDescription } from "./SectionDescription";

describe("section description prose", () => {
  it("renders separate paragraphs with emphasis, code and base-aware documentation links", () => {
    const html = render(
      <SectionDescription
        text={
          "A `value` with **one state owner**.\n\nRead [Select](/docs/select/installation) or [More](#multiple)."
        }
      />,
    );
    expect(html.match(/<p /g)).toHaveLength(2);
    expect(html).toContain("<code>value</code>");
    expect(html).toContain("<strong>one state owner</strong>");
    expect(html).toContain(`href="${withBasePath("/docs/select/installation")}"`);
    expect(html).toContain('href="#multiple"');
  });

  it("preserves existing bare prop formatting and the shared path renderer", () => {
    const html = render(
      <SectionDescription text={'Use size="sm" with `src/components/Example.tsx`.'} />,
    );
    expect(html).toContain("<code>size=&quot;sm&quot;</code>");
    expect(html).toContain('data-path-part="root"');
    expect(html).toContain('data-path-part="end"');
  });

  it("keeps markup and non-local link syntax as text, including inside code", () => {
    const html = render(
      <SectionDescription
        text={"<img src=x> [Run](javascript:alert) [Remote](//example.com) `[Literal](#id)`"}
      />,
    );
    expect(render(<SectionDescription text="[Run](javascript:alert)" />)).not.toContain("<a ");
    expect(html).not.toContain("<img");
    expect(html).not.toContain("<a ");
    expect(html).toContain("&lt;img src=x>");
    expect(html).toContain("<code>[Literal](#id)</code>");
  });
});
