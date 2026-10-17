/** @vitest-environment jsdom */
import { cleanup, render, within } from "@testing-library/preact";
import { afterEach, expect, it } from "vitest";
import type { CodeReferenceHelp } from "../types";
import { ReferenceRelated } from "./reference-related";

afterEach(cleanup);

const reference: CodeReferenceHelp = {
  kind: "component",
  name: "Dialog",
  module: "@kamod-ch/ui/dialog",
  description: "A dialog composition.",
  docs: { label: "API reference", href: "/docs/dialog/installation#api-reference" },
  source: {
    label: "Implementation",
    href: "https://github.com/kamod-ch/kamod-ui/blob/main/packages/core/src/components/dialog/Dialog.tsx",
  },
};
const contract = {
  label: "DialogProps",
  href: "/docs/dialog/installation#component-type-Dialog-DialogProps",
  kind: "type" as const,
};
const props = {
  label: "Props and defaults",
  href: "/docs/dialog/installation#component-props",
  kind: "props" as const,
};

it("places the chosen reference first while keeping every other unique destination in incoming order", () => {
  const links = [
    contract,
    { ...reference.source!, kind: "source" as const },
    { ...reference.docs!, kind: "guide" as const },
    props,
    { ...contract, label: "Duplicate contract" },
  ];
  const view = render(
    <ReferenceRelated reference={reference} links={links} primary={reference.docs!.href} />,
  );
  const nav = view.getByRole("navigation", { name: "Related references" });
  const anchors = within(nav).getAllByRole("link");
  expect(anchors.map((anchor) => anchor.getAttribute("href"))).toEqual([
    reference.docs!.href,
    contract.href,
    reference.source!.href,
    props.href,
  ]);
  expect(anchors[0]).toHaveClass("code-reference-help-primary-link");
  expect(anchors[0]).toHaveAttribute("data-reference-primary", "true");
  expect(nav.querySelectorAll("[data-reference-primary]")).toHaveLength(1);
  expect(within(nav).getAllByRole("list")).toHaveLength(1);
  expect(within(nav).getAllByRole("listitem")).toHaveLength(4);
  expect(nav.querySelector(".code-reference-help-reading-group")).toBeNull();
  expect(nav).toHaveTextContent("Useful resources");
  expect(nav.querySelector(".code-reference-help-reading-count strong")).toHaveTextContent("4");
  expect(nav.querySelector(".code-reference-help-reading-detail")).toHaveAttribute(
    "title",
    "contracts · resources · guides · references · third party",
  );
  for (const anchor of anchors) {
    expect(anchor).toHaveAttribute("target", "_top");
    expect(anchor.querySelector("code")).not.toBeNull();
    expect(anchor.querySelector(".code-reference-help-related-kind")).toHaveTextContent("/");
  }
});

it("includes the verified main destination even when a supplied reading list omits it", () => {
  const view = render(
    <ReferenceRelated
      reference={reference}
      links={[contract, props]}
      primary={reference.docs!.href}
    />,
  );
  const links = view.getAllByRole("link");
  expect(links.map((link) => link.getAttribute("href"))).toEqual([
    reference.docs!.href,
    contract.href,
    props.href,
  ]);
  expect(links[0]).toHaveAccessibleName("API reference");
});

it("uses the same source-first package destination when the caller supplies no presentation", () => {
  const value: CodeReferenceHelp = {
    ...reference,
    kind: "package",
    name: "@kamod-ch/ui",
    module: "@kamod-ch/ui",
    related: [contract],
  };
  const view = render(<ReferenceRelated reference={value} />);
  const links = view.getAllByRole("link");
  expect(links[0]).toHaveAttribute("href", reference.source!.href);
  expect(links[0]).toHaveAttribute("data-reference-primary", "true");
  expect(links.map((link) => link.getAttribute("href"))).toEqual([
    reference.source!.href,
    reference.docs!.href,
    contract.href,
  ]);
});

it("keeps one verified main link without manufacturing destinations for an empty reference", () => {
  const view = render(
    <ReferenceRelated reference={reference} links={[]} primary={reference.docs!.href} />,
  );
  expect(view.getAllByRole("link")).toHaveLength(1);
  expect(view.container.querySelector(".code-reference-help-reading-count")).toHaveTextContent(
    "1 reference",
  );
  view.rerender(
    <ReferenceRelated
      reference={{ ...reference, source: undefined, docs: undefined, related: [] }}
    />,
  );
  expect(view.queryByRole("navigation")).toBeNull();
});

it("does not manufacture a missing preferred destination or label a third-party guide official", () => {
  const external = {
    label: "Integration notes",
    href: "https://example.com/integration",
    kind: "guide" as const,
  };
  const view = render(
    <ReferenceRelated
      reference={{ ...reference, source: undefined, docs: undefined }}
      links={[external]}
      primary="/unknown-reference"
    />,
  );
  const link = view.getByRole("link", { name: "Integration notes" });
  expect(link).toHaveAttribute("href", external.href);
  expect(view.container.querySelector("[data-reference-primary]")).toBeNull();
  expect(link.title).toContain("linked documentation");
  expect(link.title).not.toContain("official");
});
