/** @vitest-environment jsdom */
import { cleanup, render } from "@testing-library/preact";
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
