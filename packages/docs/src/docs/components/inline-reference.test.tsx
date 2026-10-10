/** @vitest-environment jsdom */
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, render } from "@testing-library/preact";
import { afterEach, describe, expect, it } from "vitest";
import { parseGuide } from "../../blocks/guides/guide-markdown";
import { renderPromptMarkdown } from "../../blocks/prompt-markdown";
import { inlineReferenceHelp } from "../../layout/tooltips/inline-reference-help";
import { BrandText } from "./brand/BrandText";
import { inlineReference, inlineReferences } from "./inline-reference-catalog";

afterEach(cleanup);

describe("documentation references", () => {
  it("links canonical component names, block variants, guides and third-party packages", () => {
    const { container, getByRole } = render(
      <BrandText>
        <p>
          Components use <code>button</code>, Input, <code>dialog</code> and Sidebar.
          <code>application-shell-3</code> uses <code>preact</code> and{" "}
          <code>@formisch/preact</code>.
        </p>
      </BrandText>,
    );
    for (const [label, href] of [
      ["Components", "/docs/components"],
      ["Button", "/docs/button/installation"],
      ["Input", "/docs/input/installation"],
      ["Dialog", "/docs/dialog/installation"],
      ["Sidebar", "/docs/sidebar/installation"],
      ["Application Shell 3", "/blocks/application-shell/application-shell-3"],
      ["Preact", "https://preactjs.com/"],
      ["@formisch/preact", "/docs/formisch/installation"],
    ]) {
      const link = getByRole("link", { name: label, exact: true });
      expect(link).toHaveAttribute("href", href);
      expect(link.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(2);
    }
    expect(container.querySelector("code code, a a")).toBeNull();
  });
  it("preserves explicit subsection destinations and their accessible labels", () => {
    const { getByRole, container } = render(
      <BrandText>
        <a href="/docs/button/installation#sizes">
          <code>button</code>
        </a>
        <a href="https://preactjs.com/guide/v10/hooks/">Preact</a>
      </BrandText>,
    );
    expect(getByRole("link", { name: "Button" })).toHaveAttribute(
      "href",
      "/docs/button/installation#sizes",
    );
    expect(getByRole("link", { name: "Preact" }).querySelectorAll("svg")).toHaveLength(2);
    expect(container.querySelector("a a, code code")).toBeNull();
  });
  it("links companion hooks to their implementations with two decorative icons and specific help", () => {
    const { getByRole, container } = render(
      <BrandText>
        <p>
          <code>useToggle</code>, useCounter and <code>useLocalStorageState</code> compose
          <code>useExampleState</code>.
        </p>
        <pre>
          <code>const [on] = useToggle(false);</code>
        </pre>
      </BrandText>,
    );
    for (const name of ["useToggle", "useCounter", "useLocalStorageState"]) {
      const href = `https://github.com/kamod-ch/kamod-hooks/blob/main/packages/core/src/${name}/index.ts`;
      const link = getByRole("link", { name, exact: true });
      expect(link).toHaveAttribute("href", href);
      expect(link.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(2);
      expect(inlineReferenceHelp(name)).toMatchObject({ path: { label: name, href }, href });
    }
    expect(container.querySelectorAll("a")).toHaveLength(3);
    expect(container.querySelector("pre a, a a, code code")).toBeNull();
    expect(container.querySelector("pre")?.textContent).toBe("const [on] = useToggle(false);");
    expect(inlineReference("useExampleState")).toBeUndefined();
  });
  it("does not reinterpret source, literal expressions, controls or ordinary nouns", () => {
    const { container } = render(
      <BrandText>
        <p>
          A button takes input. Keep state in the parent. <code>type="button"</code>
          <code>ButtonProps</code>
          <code>src/Button.tsx</code>
        </p>
        <pre>
          <code>const Input = "Button";</code>
        </pre>
        <button>Button</button>
        <h2>Input</h2>
      </BrandText>,
    );
    expect(container.querySelector("a")).toBeNull();
  });
  it("uses the same references in Markdown while preserving fences and authored links", () => {
    const source =
      "Use **Components**, `button`, Input and `TypeScript`. [Sidebar](https://example.com/sidebar#usage) and [`dialog`](https://example.com/dialog#usage).\n\n```tsx\n<Button>Input</Button>\n```";
    const container = document.createElement("div");
    container.innerHTML = renderPromptMarkdown(source);
    expect(container.querySelector('a[href="/docs/button/installation"]')).toHaveTextContent(
      "Button",
    );
    expect(
      container.querySelector('a[href="https://example.com/sidebar#usage"] svg'),
    ).not.toBeNull();
    expect(container.querySelector('a[href="https://example.com/dialog#usage"]')).toHaveTextContent(
      "Dialog",
    );
    expect(container.querySelector("a a, code code, pre a")).toBeNull();
    expect(container.querySelector("pre")?.textContent).toBe("<Button>Input</Button>\n");
    const guide = parseGuide(
      "## Choose\n\n**Components** are a `Button`, `Input`, `Dialog` or `Sidebar`.",
    );
    const html = guide[0].parts.find((part) => part.kind === "html");
    expect(html?.kind === "html" && html.html).toContain('href="/docs/button/installation"');
  });
  it("normalizes named references without changing package paths or inventing targets", () => {
    expect(inlineReference("sIdEbArPrOvIdEr")?.label).toBe("SidebarProvider");
    expect(inlineReference("Sidebar01")?.href).toBe("/blocks/sidebar/sidebar-01");
    expect(inlineReference("@formisch/preact")?.label).toBe("@formisch/preact");
    for (const label of [
      "SidebarProps",
      "Button.disabled",
      "<Button />",
      "UnknownWidget",
      "button.tsx",
    ]) {
      expect(inlineReference(label)).toBeUndefined();
    }
  });
  it("only advertises internal destinations that exist in the checked-in site", () => {
    for (const { href } of inlineReferences) {
      if (!href.startsWith("/")) continue;
      const path = resolve(import.meta.dirname, "../../..", href.slice(1).split("#")[0]);
      expect(existsSync(`${path}.md`) || existsSync(`${path}/index.md`), href).toBe(true);
    }
  });
  it("only advertises source folders and files present in this repository", () => {
    for (const { label } of inlineReferences) {
      const href = inlineReferenceHelp(label)?.path?.href;
      const source = href?.match(
        /^https:\/\/github.com\/kamod-ch\/kamod-ui\/(?:tree|blob)\/main\/(.+)$/,
      )?.[1];
      if (source)
        expect(existsSync(resolve(import.meta.dirname, "../../../../..", source)), label).toBe(
          true,
        );
    }
  });
});
