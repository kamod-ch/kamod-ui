import render from "preact-render-to-string";
import { expect, it } from "vitest";
import { docsPages } from "../../registry";
import { ComponentRelatedComponents } from "./ComponentRelatedComponents";
import { componentCompanions } from "./component-companions";
import { componentGuidance } from "./component-guidance";

it("provides a real destination and complete guidance for every recommended companion", () => {
  const related = new Set(docsPages.flatMap(({ slug }) => componentGuidance(slug).related));
  for (const slug of related) {
    const profile = componentCompanions[slug];
    expect(profile, slug).toBeDefined();
    expect(
      docsPages.some((doc) => doc.slug === slug),
      slug,
    ).toBe(true);
    expect(
      render(<>{profile.description}</>)
        .replace(/<[^>]+>/g, "")
        .trim(),
      slug,
    ).not.toBe("");
    expect(
      render(<>{profile.connection}</>)
        .replace(/<[^>]+>/g, "")
        .trim(),
      slug,
    ).not.toBe("");
  }
});

it("omits self references and repeated companions while preserving linked subsection targets", () => {
  const doc = docsPages.find(({ slug }) => slug === "cn")!;
  const html = render(
    <ComponentRelatedComponents doc={doc} related={["cn", "badge", "badge", "button", "card"]} />,
  );
  expect(html).not.toContain('id="compose-with-cn"');
  expect(html.match(/id="compose-with-badge"/g)).toHaveLength(1);
  for (const slug of ["badge", "button", "card"]) {
    expect(html).toContain(`href="#compose-with-${slug}"`);
    expect(html).toContain(`href="/docs/${slug}/installation"`);
    expect(html).toContain(`aria-labelledby="compose-with-${slug}"`);
  }
  expect(html).toContain('id="composition-next-step"');
  expect(html).toContain('href="/docs/getting-started#verify-the-whole-journey"');
});
