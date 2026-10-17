/** @vitest-environment jsdom */
import { cleanup, fireEvent, render } from "@testing-library/preact";
import { afterEach, expect, it, vi } from "vitest";
import type { CodeReferenceHelpField } from "../types";
import { hasReferenceContract, ReferenceContract } from "./reference-contract";
import { ReferenceDefinitions, ReferenceFields, ReferenceSnippet } from "./reference-miniatures";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it("preserves documented descriptions, defaults and exact owner links in the real props table", () => {
  const fields: CodeReferenceHelpField[] = [
    {
      name: "open",
      type: "boolean",
      required: false,
      description: "Controls the **visible state**; pair it with `onOpenChange`.",
      defaultValue: "false",
      owners: [{ label: "DialogProps", href: "/docs/dialog/installation#dialog-props" }],
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      required: true,
      description: "Receives the next open state.",
      defaultValue: "Required",
    },
    { name: "defaultOpen", type: "boolean", required: false, description: "Initial open state." },
    {
      name: "children",
      type: "ComponentChildren",
      required: false,
      description: "Dialog content.",
    },
  ];
  const source = { label: "Component props", href: "/docs/dialog/installation#component-props" };
  const { container, getByRole, getByText } = render(
    <ReferenceFields fields={fields} name="Dialog" source={source} />,
  );
  expect(container.querySelector(".blocks-api-props-table table")).not.toBeNull();
  expect(container.querySelectorAll("tbody tr")).toHaveLength(3);
  expect(getByText("visible state").tagName).toBe("STRONG");
  expect(container.querySelector("tbody tr:first-child td code")).toHaveTextContent("onOpenChange");
  expect(container.querySelector("tbody tr:first-child .component-api-default")).toHaveTextContent(
    "Defaultfalse",
  );
  expect(container.querySelector("tbody tr:nth-child(2) .component-api-default")).toHaveTextContent(
    "Usage requirementRequired",
  );
  expect(getByRole("button", { name: "Required prop: onOpenChange" })).toBeVisible();
  expect(getByRole("link", { name: "DialogProps" })).toHaveAttribute(
    "href",
    "/docs/dialog/installation#dialog-props",
  );
  expect(getByRole("link", { name: "DialogProps" })).toHaveClass("blocks-api-field-owner");
  const continuation = getByRole("link", {
    name: "Read the complete props and data table for Dialog",
  });
  expect(continuation).toHaveAttribute("href", source.href);
  expect(continuation).toHaveAttribute("target", "_top");
  expect(continuation.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  expect(container.textContent).not.toContain("3 of 4");
  expect(container.textContent).not.toContain("Optional in source");
});

it("does not fabricate defaults, owners or a continuation destination for source-only fields", () => {
  const { container, queryByRole } = render(
    <ReferenceFields
      name="LocalContract"
      fields={[{ name: "value", type: "string", required: false, description: "" }]}
    />,
  );
  expect(container.querySelector(".component-api-default")).toBeNull();
  expect(container.querySelector(".component-api-owners")).toBeNull();
  expect(container.textContent).toContain("Optional in source");
  expect(queryByRole("link")).toBeNull();
});

it("links a bounded literal-code excerpt to its complete source without mounting clipboard controls", () => {
  const lines = Array.from({ length: 12 }, (_, index) => `const value${index} = ${index};`);
  const source = { label: "Dialog usage", href: "/docs/dialog/installation#usage" };
  const { container, getByRole } = render(
    <ReferenceSnippet code={{ language: "typescript", value: lines.join("\n") }} source={source} />,
  );
  expect(container.querySelector("pre code")?.textContent).toBe(lines.slice(0, 9).join("\n"));
  expect(getByRole("link", { name: "Read the complete source: Dialog usage" })).toHaveAttribute(
    "href",
    source.href,
  );
  expect(container.querySelector(".docs-code-copy")).toBeNull();
  expect(container.textContent).not.toContain("linked below");
});

it("keeps source-card introductions and bounded closed disclosures without reader observers", () => {
  const resize = vi.fn();
  const intersection = vi.fn();
  vi.stubGlobal("ResizeObserver", resize);
  vi.stubGlobal("IntersectionObserver", intersection);
  const code =
    "export type DialogProps = {\n  /** Dialog contents. */\n  children: ComponentChildren;\n  open?: boolean;\n};";
  const source = {
    label: "DialogProps complete definition",
    href: "/docs/dialog/installation#dialog-props",
  };
  const { container, getByRole, getByText } = render(
    <ReferenceDefinitions
      source={{
        label: "Data type reference",
        href: "/docs/dialog/installation#component-data-types",
      }}
      definitions={[
        {
          name: "DialogProps",
          code,
          source,
          filePath: "packages/core/src/components/dialog/Dialog.tsx",
          exported: true,
          fields: [
            {
              name: "children",
              type: "ComponentChildren",
              required: true,
              description: "Dialog contents.",
            },
            { name: "open", type: "boolean", required: false, description: "" },
          ],
        },
        ...["DialogContentProps", "DialogCloseProps", "DialogTriggerProps"].map((name) => ({
          name,
          code: `export type ${name} = { children?: ComponentChildren };`,
        })),
      ]}
    />,
  );
  expect(container.querySelectorAll('[data-slot="type-definition"]')).toHaveLength(3);
  expect(getByRole("heading", { name: "Dialog props" })).toBeVisible();
  expect(getByText("2 declared fields")).toBeVisible();
  expect(getByText("Exported Source Declaration")).toBeVisible();
  expect(getByText("Dialog.tsx")).toBeVisible();
  expect(getByRole("group", { name: "Required fields of DialogProps" })).toHaveTextContent(
    "children",
  );
  expect(getByRole("link", { name: "Complete Definition" })).toHaveAttribute("href", source.href);
  expect(container.querySelector(".blocks-api-type-language")).not.toBeNull();
  expect(container.querySelector(".kamod-code")).toBeNull();
  expect(getByRole("link", { name: "Read the complete data type reference" })).toHaveAttribute(
    "href",
    "/docs/dialog/installation#component-data-types",
  );
  fireEvent.click(getByRole("button", { name: "View Definition and Field Docs: DialogProps" }));
  expect(container.querySelector(".kamod-code pre code")?.textContent).toBe(code);
  expect(container.querySelector(".docs-code-copy")).toBeNull();
  expect(resize).not.toHaveBeenCalled();
  expect(intersection).not.toHaveBeenCalled();
});

it("retains both authored installation and usage texts, snippets and section destinations in one chapter", () => {
  const section = {
    title: "Installation & usage",
    excerpts: [
      {
        title: "Installation",
        description: "Import the **existing component** after configuring its styles.",
        source: { label: "Installation", href: "/docs/dialog/installation#installation" },
        code: { language: "tsx", value: 'import { Dialog } from "@kamod-ch/ui/dialog";' },
      },
      {
        title: "Usage",
        description: "Wrap the trigger and content in one `Dialog` owner.",
        source: { label: "Usage", href: "/docs/dialog/installation#usage" },
        code: { language: "tsx", value: "<Dialog><DialogTrigger>Open</DialogTrigger></Dialog>" },
      },
    ],
  };
  const reference = {
    kind: "component" as const,
    name: "Dialog",
    module: "dialog",
    description: "",
    sections: [section],
  };
  expect(hasReferenceContract(reference)).toBe(true);
  expect(
    hasReferenceContract({
      ...reference,
      sections: [{ title: "Empty", excerpts: [{ title: "Usage" }] }],
    }),
  ).toBe(false);
  const { container, getByRole, getByText } = render(<ReferenceContract reference={reference} />);
  expect(container.querySelectorAll(".code-reference-help-section")).toHaveLength(1);
  expect(container.querySelectorAll(".code-reference-help-excerpt")).toHaveLength(2);
  expect(container.querySelectorAll(".kamod-code")).toHaveLength(2);
  expect(getByRole("link", { name: "Installation" })).toHaveAttribute(
    "href",
    "/docs/dialog/installation#installation",
  );
  expect(getByRole("link", { name: "Usage" })).toHaveAttribute(
    "href",
    "/docs/dialog/installation#usage",
  );
  expect(getByText("existing component").tagName).toBe("STRONG");
  expect(container.querySelectorAll("pre code")[0]).toHaveTextContent(
    'import { Dialog } from "@kamod-ch/ui/dialog";',
  );
  expect(container.querySelectorAll("pre code")[1]).toHaveTextContent(
    "<Dialog><DialogTrigger>Open</DialogTrigger></Dialog>",
  );
});
