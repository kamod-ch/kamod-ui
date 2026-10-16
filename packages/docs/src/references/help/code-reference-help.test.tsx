/** @vitest-environment jsdom */
import { cleanup, render, waitFor, within } from "@testing-library/preact";
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

it("preserves exact path text and existing base prefixes while its reading links escape preview frames", () => {
  const { container, getByRole } = render(<CodeReferenceHelpContent reference={reference} />);
  const path = container.querySelector(".code-reference-help-path")!;
  expect(path.textContent).toBe(reference.module);
  expect(path.querySelector('[data-path-part="root"]')?.textContent).toBe("@/");
  expect(path.querySelector('[data-path-part="end"]')?.textContent).toBe("/direction");
  expect(getByRole("link", { name: "API reference" })).toHaveAttribute(
    "href",
    reference.docs!.href,
  );
  expect(getByRole("link", { name: "DirectionProviderProps" })).toHaveAttribute(
    "href",
    reference.related![0].href,
  );
  for (const link of container.querySelectorAll("a"))
    expect(link).toHaveAttribute("target", "_top");
});

it("renders source-derived code and emphasis safely without interpreting HTML", () => {
  const { container } = render(
    <CodeReferenceHelpContent
      reference={{
        ...reference,
        description: `${reference.description} <img src=x onerror=alert(1)>`,
      }}
    />,
  );
  const summary = container.querySelector(".code-reference-help-summary")!;
  expect(summary.querySelector("code")).toHaveTextContent("dir");
  expect(summary.querySelector("strong")).toHaveTextContent("nested controls");
  expect(summary.querySelector("img")).toBeNull();
  expect(summary).toHaveTextContent("<img src=x onerror=alert(1)>");
});

it("uses origin shortcuts for secondary destinations and leaves one main action in the footer", () => {
  const { container } = render(<CodeReferenceHelpContent reference={reference} />);
  const header = container.querySelector("header")!;
  expect(header.querySelectorAll('[data-slot="badge"]')).toHaveLength(1);
  expect(
    within(header).getByRole("link", { name: "Open API reference for DirectionProvider" }),
  ).toHaveAttribute("href", reference.docs!.href);
  const origin = container.querySelector(".code-reference-help-origin")!;
  expect(
    within(origin as HTMLElement).getByRole("link", { name: /Read source for/ }),
  ).toHaveAttribute("href", reference.source!.href);
  const footer = container.querySelector(".code-reference-help-footer")!;
  expect(footer.querySelectorAll("a")).toHaveLength(1);
  expect(footer.querySelector("a")).toHaveAttribute("href", reference.docs!.href);
  expect(footer.querySelector(".code-reference-help-note")).toHaveTextContent("installed version");
});

it("keeps package source primary and its local integration accessible in the origin row", () => {
  const value = {
    ...reference,
    kind: "module" as const,
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
  expect(container.querySelector(".code-reference-help-open")).toHaveAttribute(
    "href",
    value.source.href,
  );
  expect(container.querySelector(".code-reference-help-primary-link")).toHaveAttribute(
    "href",
    value.source.href,
  );
  expect(container.querySelector(".code-reference-help-shortcut a")).toHaveAttribute(
    "href",
    value.docs.href,
  );
});

it("deduplicates origin destinations and never invents resources for missing facts", () => {
  const { container, rerender } = render(
    <CodeReferenceHelpContent
      reference={{
        ...reference,
        source: reference.docs,
        related: [{ ...reference.docs!, kind: "guide" }],
      }}
    />,
  );
  expect(container.querySelectorAll(".code-reference-help-shortcut")).toHaveLength(0);
  rerender(
    <CodeReferenceHelpContent
      reference={{ ...reference, source: undefined, docs: undefined, related: [] }}
    />,
  );
  expect(container.querySelector(".code-reference-help-footer a")).toBeNull();
  expect(container.querySelector(".code-reference-help-open")).toBeNull();
});

it("formats small declarations with the shared grammar while retaining their exact text", async () => {
  const signature = '(props: DirectionProviderProps) => VNode<"div">';
  const { container } = render(
    <CodeReferenceHelpContent reference={{ ...reference, signature }} />,
  );
  expect(container.querySelector("pre code")?.textContent).toBe(signature);
  await waitFor(() => expect(container.querySelector("pre code .token")).not.toBeNull());
  expect(container.querySelector(".code-reference-help-fields dd code")?.textContent).toBe(
    '"ltr" | "rtl"',
  );
  expect(container.querySelector("pre div, .kamod-code")).toBeNull();
});

it("supports safe prose links but leaves executable URLs and HTML as literal text", () => {
  const { container } = render(
    <CodeReferenceHelpContent
      reference={{
        ...reference,
        description:
          "[Guide](/docs/direction/installation) and [unsafe](javascript:alert) and [external](//example.com) and <script>alert(1)</script>.",
      }}
    />,
  );
  const summary = container.querySelector(".code-reference-help-summary")!;
  expect(summary.querySelectorAll("a")).toHaveLength(1);
  expect(summary.querySelector("a")).toHaveAttribute("href", "/docs/direction/installation");
  expect(summary.querySelector("script")).toBeNull();
  expect(summary.textContent).toContain("[unsafe](javascript:alert)");
});

it("bounds detailed fields and related reading so a large export inventory stays compact", () => {
  const { container, getByText } = render(
    <CodeReferenceHelpContent
      reference={{
        ...reference,
        fields: Array.from({ length: 8 }, (_, index) => ({
          name: `prop${index}`,
          type: "string",
          required: false,
          description: "",
        })),
        related: Array.from({ length: 8 }, (_, index) => ({
          label: `Related${index}`,
          href: `/docs/types#type${index}`,
          kind: "type" as const,
        })),
      }}
    />,
  );
  expect(container.querySelectorAll(".code-reference-help-fields dt")).toHaveLength(3);
  expect(container.querySelectorAll(".code-reference-help-related-link")).toHaveLength(4);
  expect(getByText("Selected fields")).toBeVisible();
});

it("does not invent a contract when a package has no source-derived fields", () => {
  const { container } = render(
    <CodeReferenceHelpContent
      reference={{
        kind: "package",
        name: "preact",
        module: "preact/hooks",
        description: "Preact hooks.",
        fields: [],
        related: [],
      }}
    />,
  );
  expect(container.querySelector(".code-reference-help-contract")).toBeNull();
  expect(container.querySelector(".code-reference-help-related")).toBeNull();
  expect(container.textContent).not.toContain("0");
});

it("announces actual pending work and keeps a usable link after optional metadata fails", () => {
  const loading = render(
    <CodeReferenceHelpLoading name={reference.name} module={reference.module} />,
  );
  expect(loading.getByRole("status")).toHaveTextContent("Bringing the reference");
  expect(loading.container.firstElementChild).toHaveAttribute("aria-busy", "true");
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
