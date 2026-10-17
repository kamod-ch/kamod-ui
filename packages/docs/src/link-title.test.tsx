// @vitest-environment jsdom
import { render } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { linkTitle, linkTitleChildren } from "./link-title";

describe("documentation link titles", () => {
  it.each([
    ["sources and design references", "Sources and Design References"],
    ["a guide inside the library", "A Guide inside the Library"],
    ["read this because it matters", "Read This because It Matters"],
    ["CSS setup and GitHub examples", "CSS Setup and GitHub Examples"],
    ["shadcn/ui Formisch forms", "shadcn/ui Formisch Forms"],
    ["cn utility", "cn Utility"],
    ["useState and import type", "useState and Import Type"],
    ["src/components/button.tsx", "src/components/button.tsx"],
    ["@kamod-ch/ui and pnpm", "@kamod-ch/ui and pnpm"],
    ["icon-only navigation", "Icon-Only Navigation"],
    ["  setup\n and integration  ", "  Setup\n and Integration  "],
  ])("formats %s without changing technical spelling", (input, expected) => {
    expect(linkTitle(input)).toBe(expected);
    expect(linkTitle(expected)).toBe(expected);
  });

  it("preserves code and custom component content in rich headings", () => {
    const Identifier = () => <span>useState</span>;
    const { container } = render(
      <a href="#setup">
        {linkTitleChildren([
          "configure ",
          <>
            <strong>shared styles</strong>
          </>,
          " with ",
          <code>theme.css</code>,
          <Identifier />,
        ])}
      </a>,
    );
    expect(container.textContent).toBe("Configure Shared Styles with theme.cssuseState");
    expect(container.querySelector("strong")?.textContent).toBe("Shared Styles");
    expect(container.querySelector("code")?.textContent).toBe("theme.css");
    expect(container.querySelector("span")?.textContent).toBe("useState");
    expect(container.querySelector("a")?.getAttribute("href")).toBe("#setup");
  });
});
