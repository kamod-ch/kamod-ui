/** @vitest-environment jsdom */
import { cleanup, render } from "@testing-library/preact";
import { afterEach, expect, it } from "vitest";
import { connectInlineCode } from "./connect-inline-references";
import { InlineCodeReference } from "./InlineCodeReference";
import { inlineSourceReference } from "./inline-references";
import { ReferenceCode } from "./ReferenceCode";
import { sourceReferenceHelp } from "./source-reference-target";

afterEach(cleanup);

it("resolves current reference kinds from verified names without enabling proposed categories", () => {
  for (const [label, module, imported] of [
    ["Button", "@kamod-ch/ui", "Button"],
    ["DirectionProviderProps", "@kamod-ch/ui", "DirectionProviderProps"],
    ["useCounter", "@kamod-ch/hooks", "useCounter"],
    ["useState", "preact/hooks", "useState"],
    ["@kamod-ch/hooks", "@kamod-ch/hooks", undefined],
    ["@/components/kamod-ui/direction", "@/components/kamod-ui/direction", undefined],
    ["preact/hooks", "preact/hooks", undefined],
    ["packages/core/src/components/button/Button.tsx", "./Button.tsx", undefined],
  ]) {
    const reference = inlineSourceReference(label!);
    expect(reference?.module).toBe(module);
    expect(reference?.imported).toBe(imported);
  }
  for (const label of [
    "unknownPackage",
    "@unknown/package",
    "constructor",
    "npm add preact",
    "--primary",
    "aria-label",
    "package.json",
    "window",
    "Application Shell 3",
  ])
    expect(inlineSourceReference(label)).toBeUndefined();
  expect(inlineSourceReference("Button", "javascript:alert(1)")).toBeUndefined();
});

it("keeps explicit destinations and exact text with no decorative icons or nested anchors", () => {
  const { container, getByRole } = render(
    <InlineCodeReference href="#local-contract" size="compact">
      DirectionProvider
    </InlineCodeReference>,
  );
  const link = getByRole("link", { name: "DirectionProvider" });
  expect(link).toHaveAttribute("href", "#local-contract");
  expect(sourceReferenceHelp(link)).toMatchObject({
    module: "@kamod-ch/ui",
    imported: "DirectionProvider",
    label: "DirectionProvider",
  });
  expect(container.querySelector("svg, a a")).toBeNull();
  expect(link.querySelector("code")).toHaveAttribute("data-inline-code-size", "compact");
});

it("uses the private resolver while preserving complete source and an explicit opt-out", () => {
  const source =
    'import { Button as Action } from "@kamod-ch/ui/button";\nconst App = () => <Action />;';
  const { container, rerender } = render(
    <ReferenceCode
      code={source}
      language="tsx"
      highlight={false}
      showToolbar={false}
      showWrapControl={false}
    />,
  );
  expect(container.querySelector("pre code")?.textContent).toBe(source);
  expect(container.querySelectorAll("a.kamod-code-reference")).toHaveLength(4);
  rerender(
    <ReferenceCode
      code={source}
      language="tsx"
      resolveReference={null}
      showToolbar={false}
      showWrapControl={false}
    />,
  );
  expect(container.querySelector("a.kamod-code-reference")).toBeNull();
});

it("enhances raw JSX/Markdown terms without rewriting DOM, and restores detached terms on teardown", async () => {
  const { container } = render(
    <>
      <p>
        <code>Button</code>
        <a href="#mine">
          <code>@kamod-ch/hooks</code>
        </a>
      </p>
      <pre>
        <code>Button</code>
      </pre>
      <button>
        <code>Button</code>
      </button>
      <code data-code-help="off">Button</code>
    </>,
  );
  const before = container.textContent;
  const stop = connectInlineCode(document);
  const code = container.querySelector<HTMLElement>("p code")!;
  const link = container.querySelector<HTMLAnchorElement>("p a")!;
  expect(sourceReferenceHelp(code)).toMatchObject({ imported: "Button" });
  expect(sourceReferenceHelp(link)).toMatchObject({ module: "@kamod-ch/hooks", href: "#mine" });
  expect(container.querySelectorAll(".kamod-code-reference")).toHaveLength(2);
  expect(container.textContent).toBe(before);
  code.textContent = "unknownName";
  await Promise.resolve();
  expect(code).not.toHaveAttribute("data-code-module");
  expect(code).not.toHaveAttribute("role");
  stop();
  expect(link).not.toHaveAttribute("data-code-module");
  expect(link).toHaveAttribute("href", "#mine");
});
