/** @vitest-environment jsdom */
import { CircuitBoardIcon } from "@kamod-ch/icons/lucide";
import { BrandReactIcon, BrandTailwindIcon } from "@kamod-ch/icons/tabler/outline";
import { cleanup, fireEvent, render, waitFor, within } from "@testing-library/preact";
import renderToString from "preact-render-to-string";
import { afterEach, expect, it } from "vitest";
import type { CodeReferenceHelp } from "../types";
import { CodeReferenceHelpContent } from "./code-reference-help";
import {
  CodeReferenceHelpLoading,
  CodeReferenceHelpUnavailable,
} from "./code-reference-help-loading";

afterEach(cleanup);

const reference: CodeReferenceHelp = {
  kind: "component",
  name: "DirectionProvider",
  module: "@/components/kamod-ui/direction",
  description: "Provides `dir` to its **nested controls**.",
  source: {
    label: "Read source",
    href: "https://github.com/kamod-ch/kamod-ui/blob/main/packages/core/src/components/direction/Direction.tsx",
  },
  docs: { label: "API reference", href: "/kamod-ui/docs/direction/installation#api-reference" },
  related: [
    {
      label: "DirectionProviderProps",
      href: "/kamod-ui/docs/direction/installation#component-type-Direction-DirectionProviderProps",
      kind: "type",
    },
  ],
  fields: [
    { name: "dir", type: '"ltr" | "rtl"', required: true, description: "Reading direction." },
  ],
};

it("preserves exact copyable origins, linked headings and top-frame navigation", () => {
  const { container, getByRole } = render(<CodeReferenceHelpContent reference={reference} />);
  const path = container.querySelector(".code-reference-help-path")!;
  expect(path.textContent).toBe(reference.module);
  expect(path.querySelector('[data-path-part="root"]')).toHaveTextContent("@/");
  expect(path.querySelector('[data-path-part="end"]')).toHaveTextContent("/direction");
  expect(
    getByRole("link", { name: "View DirectionProvider reference", exact: true }),
  ).toHaveAttribute("href", reference.docs!.href);
  expect(container.querySelector("a.code-reference-help-title")).toHaveAttribute(
    "href",
    reference.docs!.href,
  );
  expect(container.querySelector(".code-reference-help-location")).toHaveTextContent(
    reference.docs!.href,
  );
  expect(container.querySelector(".code-reference-help-location")).toHaveTextContent(
    "Required: dir",
  );
  for (const link of container.querySelectorAll("a"))
    expect(link).toHaveAttribute("target", "_top");
});

it("renders source-derived prose safely, with only supported emphasis and destinations", () => {
  const { container } = render(
    <CodeReferenceHelpContent
      reference={{
        ...reference,
        description: `${reference.description} [Guide](/docs/direction/installation) [unsafe](javascript:alert) <img src=x onerror=alert(1)>`,
      }}
    />,
  );
  const summary = container.querySelector(".code-reference-help-summary")!;
  expect(summary.querySelector("code")).toHaveTextContent("dir");
  expect(summary.querySelector("strong")).toHaveTextContent("nested controls");
  expect(summary.querySelector("img")).toBeNull();
  expect(summary.querySelectorAll("a")).toHaveLength(1);
  expect(summary.querySelector("a")).toHaveAttribute("href", "/docs/direction/installation");
  expect(summary.textContent).toContain("[unsafe](javascript:alert)");
});

it("uses a single badge, short origin context, and one ending index for all verified resources", () => {
  const { container } = render(<CodeReferenceHelpContent reference={reference} />);
  const header = container.querySelector("header")!;
  expect(header.querySelectorAll('[data-slot="badge"]')).toHaveLength(1);
  expect(
    within(header).getByRole("link", { name: "Open API reference for DirectionProvider" }),
  ).toHaveAttribute("href", reference.docs!.href);
  const origin = container.querySelector(".code-reference-help-origin")!;
  expect(origin.querySelectorAll("a")).toHaveLength(1);
  expect(origin.querySelector(".code-reference-help-context")).toHaveTextContent(
    "Layout direction",
  );
  const index = container.querySelector(".code-reference-help-related")!;
  expect(index).toHaveTextContent("Reference index");
  expect(index.querySelectorAll("a")).toHaveLength(3);
  expect(within(index as HTMLElement).getByRole("link", { name: "API reference" })).toHaveAttribute(
    "href",
    reference.docs!.href,
  );
  expect(within(index as HTMLElement).getByRole("link", { name: "Read source" })).toHaveAttribute(
    "href",
    reference.source!.href,
  );
  expect(index.querySelectorAll(".code-reference-help-related-kind")).toHaveLength(3);
  expect(container.querySelector("footer")).toBeNull();
});

it("keeps exact package source primary while retaining its local integration destination", () => {
  const value: CodeReferenceHelp = {
    ...reference,
    kind: "module",
    module: "@kamod-ch/ui/theme.css",
    fields: [],
    related: [],
    source: {
      label: "Stylesheet source",
      href: "https://github.com/kamod-ch/kamod-ui/blob/main/packages/core/src/theme.css",
    },
    docs: { label: "In this documentation", href: "/docs/theming/installation#css-setup" },
  };
  const { container } = render(<CodeReferenceHelpContent reference={value} />);
  for (const selector of [
    ".code-reference-help-open",
    "a.code-reference-help-kind-icon",
    "a.code-reference-help-title",
    ".code-reference-help-primary-link",
  ])
    expect(container.querySelector(selector)).toHaveAttribute("href", value.source!.href);
  expect(container.querySelector(".code-reference-help-location")).toHaveTextContent("main branch");
  expect(
    container.querySelector(`.code-reference-help-related a[href='${value.docs!.href}']`),
  ).not.toBeNull();
});

it("deduplicates every ending destination and does not manufacture missing resources", () => {
  const { container, rerender } = render(
    <CodeReferenceHelpContent
      reference={{
        ...reference,
        source: reference.docs,
        related: [{ ...reference.docs!, kind: "guide" }],
      }}
    />,
  );
  expect(container.querySelectorAll(".code-reference-help-related-link")).toHaveLength(1);
  rerender(
    <CodeReferenceHelpContent
      reference={{ ...reference, source: undefined, docs: undefined, related: [] }}
    />,
  );
  expect(container.querySelector(".code-reference-help-related")).toBeNull();
  expect(container.querySelector(".code-reference-help-open")).toBeNull();
  expect(container.querySelector("a.code-reference-help-kind-icon")).toBeNull();
  expect(container.querySelector("span.code-reference-help-kind-icon")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
});

it("reuses the actual props table, preserving documented defaults and bounded rows", () => {
  const fields = Array.from({ length: 8 }, (_, index) => ({
    name: `prop${index}`,
    type: "string",
    required: index === 0,
    description: `Meaning of prop ${index}.`,
    defaultValue: index === 1 ? "Required" : '"value"',
  }));
  const { container } = render(
    <CodeReferenceHelpContent
      reference={{
        ...reference,
        sections: [
          {
            title: "Props & data",
            detail: "Documented defaults",
            source: reference.docs,
            fields,
            contractName: "DirectionProviderProps",
          },
        ],
      }}
    />,
  );
  const table = container.querySelector(
    ".code-reference-help-miniature .blocks-api-props-table table",
  )!;
  expect(table.querySelectorAll("tbody tr")).toHaveLength(3);
  expect(table.querySelector("thead")).toHaveTextContent("Prop / type");
  expect(table.querySelector("tbody th code")).toHaveTextContent("prop0");
  expect(table.querySelector(".component-api-default")).toHaveTextContent('Default"value"');
  expect(table.querySelector("tbody tr:nth-child(2) .component-api-default")).toHaveTextContent(
    "Usage requirementRequired",
  );
  expect(container.querySelector(".code-reference-help-truncation")).toHaveTextContent("3 of 8");
  expect(container.querySelector(".code-reference-help-fields")).toBeNull();
});

it("uses the real code reader with optional grammar while retaining exact literal source", async () => {
  const signature = '(props: DirectionProviderProps) => VNode<"div">';
  const { container } = render(
    <CodeReferenceHelpContent reference={{ ...reference, signature }} />,
  );
  expect(container.querySelector(".kamod-code pre code")?.textContent).toBe(signature);
  await waitFor(() =>
    expect(container.querySelector(".kamod-code pre code .token")).not.toBeNull(),
  );
  expect(container.querySelector(".blocks-api-prop-type")?.textContent).toBe('"ltr" | "rtl"');
  expect(container.querySelector(".docs-code-copy")).toBeNull();
});

it("keeps section sources inside borderless-preview structure and centered source notes", () => {
  const { container } = render(<CodeReferenceHelpContent reference={reference} />);
  for (const section of container.querySelectorAll(".code-reference-help-section")) {
    const heading = section.querySelector(".code-reference-help-section-label")!;
    const panel = section.querySelector(".code-reference-help-panel")!;
    expect(heading.querySelector(".code-reference-help-section-open")).toBeNull();
    expect(panel.querySelector(".code-reference-help-section-open")).toHaveAttribute(
      "href",
      reference.docs!.href,
    );
    expect(section.querySelector(".code-reference-help-section-note a")).toHaveAttribute(
      "href",
      reference.docs!.href,
    );
  }
});

it("reuses source type disclosures and mounts their miniature code only when expanded", () => {
  const code = "export interface DirectionProviderProps {\n  dir: 'ltr' | 'rtl';\n}";
  const { container, getByRole } = render(
    <CodeReferenceHelpContent
      reference={{
        ...reference,
        sections: [
          {
            title: "Local definitions",
            source: reference.docs,
            definitions: [{ name: "DirectionProviderProps", code, source: reference.related![0] }],
          },
        ],
      }}
    />,
  );
  expect(container.querySelector('[data-slot="type-definition"]')).not.toBeNull();
  expect(container.querySelector(".kamod-code")).toBeNull();
  fireEvent.click(getByRole("button", { name: "View Definition: DirectionProviderProps" }));
  expect(container.querySelector(".kamod-code pre code")?.textContent).toBe(code);
});

it("keeps every distinct related contract without duplicating links in a second footer", () => {
  const related = Array.from({ length: 8 }, (_, index) => ({
    label: `Related${index}`,
    href: `/docs/types#type${index}`,
    kind: "type" as const,
  }));
  const { container } = render(
    <CodeReferenceHelpContent
      reference={{
        ...reference,
        related,
        sections: [
          {
            title: "Local definitions",
            definitions: [
              {
                name: "IndependentProps",
                code: "type IndependentProps = string;",
                source: { label: "Full definition", href: "/docs/types#IndependentProps" },
              },
            ],
          },
        ],
      }}
    />,
  );
  const links = [...container.querySelectorAll(".code-reference-help-related-link")];
  expect(links).toHaveLength(11);
  expect(new Set(links.map((link) => link.getAttribute("href"))).size).toBe(11);
  expect(
    container.querySelector(
      '.code-reference-help-related-link[href="/docs/types#IndependentProps"] code',
    ),
  ).toHaveTextContent("IndependentProps");
  expect(container.querySelector("footer")).toBeNull();
});

it("omits fabricated contracts and empty stages when only summary facts exist", () => {
  const { container } = render(
    <CodeReferenceHelpContent
      reference={{
        ...reference,
        fields: [],
        signature: "DirectionProviderProps",
        facts: [{ label: "Role", value: "Reading direction" }],
        related: [],
        source: undefined,
        docs: undefined,
      }}
    />,
  );
  expect(container.querySelector(".code-reference-help-content")).toBeNull();
  expect(container.querySelector(".code-reference-help-facts")).toHaveTextContent(
    "Reading direction",
  );
  expect(container.querySelector(".code-reference-help-related")).toBeNull();
});

it("announces pending work once, removes the duplicate module row, and preserves navigation on failure", () => {
  const loading = render(
    <CodeReferenceHelpLoading name={reference.name} module={reference.module} />,
  );
  expect(loading.getByText("Following the reference...")).toBeVisible();
  expect(loading.getByRole("status")).toHaveTextContent("Bringing the reference");
  expect(loading.container.firstElementChild).toHaveAttribute("aria-busy", "true");
  expect(loading.container.querySelector(".code-reference-help-loading-spinner")).not.toBeNull();
  expect(loading.container.querySelector(".code-reference-help-loading-module")).toBeNull();
  loading.unmount();
  const unavailable = render(
    <CodeReferenceHelpUnavailable
      name={reference.name}
      module={reference.module}
      href={reference.docs!.href}
    />,
  );
  expect(unavailable.getByRole("link", { name: "Open the reference" })).toHaveAttribute(
    "href",
    reference.docs!.href,
  );
});

it.each([
  ["Tailwind", "Tailwind CSS v4", BrandTailwindIcon],
  ["React", "React", BrandReactIcon],
  ["Preact", "preact v11", BrandReactIcon],
  ["Valibot", "Valibot", CircuitBoardIcon],
] as const)(
  "uses the canonical %s logo only for the main linked icon",
  (module, name, MainIcon) => {
    const { container } = render(
      <CodeReferenceHelpContent
        reference={{
          kind: "technology",
          module,
          name,
          description: "Technology details.",
          docs: { label: "Official documentation", href: "https://example.com/docs" },
        }}
      />,
    );
    const expected = document.createElement("div");
    expected.innerHTML = renderToString(<MainIcon />);
    expect(container.querySelector(".code-reference-help-kind-icon svg")!.innerHTML).toBe(
      expected.querySelector("svg")!.innerHTML,
    );
    expected.innerHTML = renderToString(<CircuitBoardIcon />);
    expect(container.querySelector(".code-reference-help-kind svg")!.innerHTML).toBe(
      expected.querySelector("svg")!.innerHTML,
    );
  },
);
