import { render, screen } from "@testing-library/preact";
import { renderToString } from "preact-render-to-string";
import { describe, expect, it } from "vitest";
import { Alert } from "./Alert";
import { AlertCallout } from "./AlertCallout";

describe("AlertCallout", () => {
  it("labels persistent guidance without announcing an urgent alert", () => {
    const { container } = render(
      <AlertCallout title="Check the source" icon={<svg />}>
        <p>
          Keep <strong>related files</strong> together.
        </p>
      </AlertCallout>,
    );
    expect(screen.getByRole("note")).toHaveAccessibleName("Check the source");
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.queryByRole("heading")).toBeNull();
    expect(container.querySelector('[data-slot="callout-icon"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(container.querySelector('[data-slot="callout-footer"]')).toBeNull();
  });

  it("preserves heading anchors and exposes footer links in document order", () => {
    render(
      <AlertCallout
        title="Connect your styles"
        headingId="styles"
        headingLevel={4}
        eyebrow="Foundation"
        meta="01"
        footer={<a href="/styles">CSS setup</a>}
      >
        <p>Load the stylesheet.</p>
      </AlertCallout>,
    );
    expect(screen.getByRole("heading", { level: 4 })).toHaveAttribute("id", "styles");
    expect(screen.getByRole("note")).toHaveAttribute("aria-labelledby", "styles");
    expect(screen.getByRole("link", { name: "CSS setup" })).toHaveAttribute("href", "/styles");
  });

  it("keeps ordinary alerts urgent and supports server rendering", () => {
    render(<Alert variant="destructive">Could not save</Alert>);
    expect(screen.getByRole("alert")).toHaveAttribute("data-variant", "destructive");
    const html = renderToString(
      <AlertCallout title="Source reference" headingId="source">
        Read the types.
      </AlertCallout>,
    );
    expect(html).toContain('data-variant="callout"');
    expect(html).toContain('aria-labelledby="source"');
    expect(html).toContain("<h3");
  });
});
