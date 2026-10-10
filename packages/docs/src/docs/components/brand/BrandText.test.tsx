/** @vitest-environment jsdom */
import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";
import { cleanup, render } from "@testing-library/preact";
import renderToString from "preact-render-to-string";
import { afterEach, describe, expect, it } from "vitest";
import { parseGuide } from "../../../blocks/guides/guide-markdown";
import { renderPromptMarkdown } from "../../../blocks/prompt-markdown";
import { InlineCodeLink } from "../InlineCodeLink";
import { InlineCode, PathDisplay } from "../PathDisplay";
import { BrandText } from "./BrandText";
import { kamodReferenceHref } from "./kamod-references";

afterEach(cleanup);

const githubMarkup = document.createElement("div");
githubMarkup.innerHTML = renderToString(<BrandGithubIcon />);
const githubPath = githubMarkup.querySelector("path")!.getAttribute("d");
const githubIcons = (root: Element) =>
  [...root.querySelectorAll("svg")].filter(
    (icon) => icon.querySelector("path")?.getAttribute("d") === githubPath,
  );

describe("inline brand references", () => {
  it("links Kamod packages and aliases with inherited icon styling and unchanged text", () => {
    const alias = "@/components/kamod-ui/accordion";
    const { container, getByRole } = render(
      <>
        <BrandText>
          Use @kamod-ch/signals with <code>@kamod-ch/icons</code>.
        </BrandText>
        <InlineCode>{alias}</InlineCode>
        <PathDisplay path="@kamod-ch/ui" />
      </>,
    );
    expect(getByRole("link", { name: "@kamod-ch/signals" })).toHaveAttribute(
      "href",
      "https://github.com/kamod-ch/kamod-signals",
    );
    expect(getByRole("link", { name: alias })).toHaveAttribute(
      "href",
      "https://github.com/kamod-ch/kamod-ui/tree/main/packages/core/src/components/accordion",
    );
    expect(getByRole("link", { name: "@kamod-ch/ui" })).toHaveAttribute(
      "href",
      "https://github.com/kamod-ch/kamod-ui",
    );
    expect(container.textContent).toBe(
      `Use @kamod-ch/signals with @kamod-ch/icons.${alias}@kamod-ch/ui`,
    );
    for (const link of container.querySelectorAll("a")) {
      expect(link.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(2);
      expect(link.querySelector("svg")).toHaveAttribute("viewBox", "0 0 24 24");
      expect(link.querySelector("svg")).toHaveAttribute("fill", "currentColor");
      expect(githubIcons(link)).toHaveLength(1);
    }
    expect(container.querySelector('[data-path-part="end"]')).toHaveTextContent("/accordion");
  });
  it.each([
    "@kamod-ch",
    "@/kamod-ch/anything/deep/file.ts",
    "@kamod-ch/ui@next",
    "@kamod-ch/unknown/many/more/segments",
    "pnpm add @kamod-ch/ui @kamod-ch/themes",
    'import { Button } from "@kamod-ch/ui";',
    "https://github.com/kamod-ch/another-project/tree/main/README.md",
    "before kamod-ch and any amount of text afterwards",
  ])("adds one GitHub mark to the complete inline value %s without guessing a link", (label) => {
    const { container } = render(<InlineCode>{label}</InlineCode>);
    expect(container.textContent).toBe(label);
    expect(githubIcons(container)).toHaveLength(1);
    expect(container.querySelector("a")).toBeNull();
    expect(container.querySelector(".docs-kamod-arrow")).toBeNull();
  });
  it("preserves custom link destinations and adds GitHub marks in both inline renderers", () => {
    const label = "install @/kamod-ch/unknown@next then continue";
    const { container } = render(
      <>
        <BrandText>
          <a href="/chosen">
            <code>{label}</code>
          </a>
        </BrandText>
        <InlineCodeLink href="/another">kamod-ch/source.ts</InlineCodeLink>
      </>,
    );
    expect(githubIcons(container)).toHaveLength(2);
    expect(container.querySelectorAll("a")).toHaveLength(2);
    expect(container.querySelector("a a")).toBeNull();
    expect(container.querySelector('a[href="/chosen"]')).toHaveTextContent(label);
    expect(container.querySelector('a[href="/another"]')).toHaveTextContent("kamod-ch/source.ts");
  });
  it("decorates broad Markdown inline matches while preserving escaping and fenced code", () => {
    const label = 'pnpm add @/kamod-ch/unknown && echo "<ready>"';
    const html = renderPromptMarkdown(
      `\`${label}\` and [\`kamod-ch/custom@next\`](https://example.com/chosen)\n\n\`\`\`sh\n${label}\n\`\`\``,
    );
    const container = document.createElement("div");
    container.innerHTML = html;
    expect(container.querySelector("p code")?.textContent).toBe(label);
    expect(githubIcons(container.querySelector("p")!)).toHaveLength(2);
    expect(container.querySelector('a[href="https://example.com/chosen"]')).toHaveTextContent(
      "kamod-ch/custom@next",
    );
    expect(container.querySelector("a a, ready, pre svg, pre a")).toBeNull();
    expect(container.querySelector("pre")?.textContent).toBe(`${label}\n`);
  });
  it("does not guess unknown repositories, aliases or command destinations", () => {
    for (const value of [
      "@kamod-ch/unknown",
      "@/components/kamod-ui/missing",
      "@/components/kamod-ui/constructor",
      "@kamod-ch/ui/../private",
      "npm add @kamod-ch/ui",
    ]) {
      expect(kamodReferenceHref(value)).toBeUndefined();
    }
    expect(kamodReferenceHref("@kamod-ch/i18n")).toBe("https://github.com/kamod-ch/kamod-i18n");
    expect(kamodReferenceHref("@kamod-ch/ui/utils")).toBe(
      "https://github.com/kamod-ch/kamod-ui/blob/main/packages/core/src/utils.ts",
    );
  });
  it("preserves existing links and fenced source when decorating Markdown package references", () => {
    const html = renderPromptMarkdown(
      '`@kamod-ch/ui` and [`@kamod-ch/icons`](https://example.com/guide)\n\n```ts\nimport { Button } from "@kamod-ch/ui";\n```',
    );
    const container = document.createElement("div");
    container.innerHTML = html;
    // Fenced snippets have their own linked language label; count prose separately.
    expect(container.querySelectorAll("a:not(.docs-code-label a)")).toHaveLength(2);
    expect(container.querySelector(".docs-code-label a")).toHaveTextContent("TypeScript");
    expect(container.querySelector("a a")).toBeNull();
    expect(container.querySelector('a[href="https://example.com/guide"]')).toHaveTextContent(
      "@kamod-ch/icons",
    );
    expect(container.querySelector("pre a")).toBeNull();
    expect(container.querySelector("pre")?.textContent).toBe(
      'import { Button } from "@kamod-ch/ui";\n',
    );
  });
  it("preserves prose, version suffixes, emphasis and code styling", () => {
    const { container, getByRole } = render(
      <BrandText>
        <p>
          Use <code>Tailwind CSS v4</code> with <strong>Preact</strong> and TypeScript.
        </p>
      </BrandText>,
    );
    expect(container.textContent).toBe("Use Tailwind CSS v4 with Preact and TypeScript.");
    expect(getByRole("link", { name: "Tailwind CSS v4" })).toHaveAttribute(
      "href",
      "https://tailwindcss.com/",
    );
    expect(container.querySelector("code > a > svg")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector("strong code > a")).toHaveAttribute(
      "href",
      "https://preactjs.com/",
    );
    expect(getByRole("link", { name: "TypeScript" })).toHaveAttribute(
      "href",
      "https://www.typescriptlang.org/",
    );
  });
  it("does not link paths, identifiers, executable code or nested controls", () => {
    const { container } = render(
      <BrandText>
        <p>
          preact/hooks @unknown/signals ReactNode TypeScript.ts <code>npm add preact</code>
        </p>
        <pre>Preact</pre>
        <button>React</button>
        <a href="/docs">Tailwind Guide</a>
      </BrandText>,
    );
    expect(container.querySelectorAll(".docs-brand-link")).toHaveLength(0);
    expect(container.querySelectorAll("a")).toHaveLength(1);
  });
  it("is idempotent when prose components are composed", () => {
    const { container } = render(
      <BrandText>
        <BrandText>Preact</BrandText>
      </BrandText>,
    );
    expect(container.querySelectorAll("a")).toHaveLength(1);
    expect(container.querySelectorAll("svg")).toHaveLength(2);
  });
  it("brands Markdown prose without nested anchors or changes to code and escaping", () => {
    const source =
      'Use **Preact** and `Tailwind CSS v4`. [TypeScript guide](https://www.typescriptlang.org/docs/)\n\n```tsx\nconst name = "Preact";\n```\n\n<img src=x> & text';
    const html = renderPromptMarkdown(source);
    const container = document.createElement("div");
    container.innerHTML = html;
    expect(container.querySelectorAll(".docs-brand-link:not(.docs-code-label *)")).toHaveLength(2);
    expect(container.querySelector(".docs-code-label a")).toHaveTextContent("TypeScript");
    expect(container.querySelector("a a")).toBeNull();
    expect(container.querySelector("pre")?.textContent).toBe('const name = "Preact";\n');
    expect(container.querySelector("img")).toBeNull();
    const guide = parseGuide("## Intro\n\nUse `Preact` and **TypeScript**.");
    expect(guide[0].parts[0]).toMatchObject({
      kind: "html",
      html: expect.stringContaining('class="docs-brand-link"'),
    });
  });
});
