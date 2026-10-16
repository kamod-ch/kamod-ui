/** @vitest-environment jsdom */
import { cleanup, fireEvent, render } from "@testing-library/preact";
import { afterEach, expect, it, vi } from "vitest";
import { ReferenceDefinitions, ReferenceFields, ReferenceSnippet } from "./reference-miniatures";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it("reuses the actual props table with documented defaults, source requirements and a bounded row count", () => {
  const { container, getByRole, getByText } = render(
    <ReferenceFields
      name="WidgetProps"
      fields={[
        {
          name: "label",
          type: "string",
          required: true,
          description: "Visible label.",
          defaultValue: '"untitled"',
        },
        { name: "disabled", type: "boolean", required: false, description: "Disables activation." },
        { name: "class", type: "string", required: false, description: "Additional classes." },
        { name: "omitted", type: "string", required: false, description: "Outside the excerpt." },
      ]}
    />,
  );
  expect(getByRole("table").parentElement).toHaveClass(
    "blocks-doc-table",
    "blocks-api-props-table",
  );
  expect(container.querySelectorAll("tbody tr")).toHaveLength(3);
  expect(getByRole("button", { name: "Required prop: label" })).toBeVisible();
  expect(getByText('"untitled"')).toBeVisible();
  expect(container.textContent).not.toContain("Outside the excerpt");
  expect(getByText("3 of 4 documented fields · complete table linked below")).toBeVisible();
});

it("uses the real code reader shell without allocating reader observers or controls", () => {
  const intersection = vi.fn();
  const resize = vi.fn();
  vi.stubGlobal("IntersectionObserver", intersection);
  vi.stubGlobal("ResizeObserver", resize);
  const value = Array.from({ length: 20 }, (_, index) => `const value${index} = ${index};`).join(
    "\n",
  );
  const { container, queryByRole } = render(
    <ReferenceSnippet code={{ language: "typescript", value }} />,
  );
  expect(container.querySelector("[data-slot=code]")).toHaveClass("kamod-code");
  expect(container.querySelector("pre code")!.textContent).toBe(
    value.split("\n").slice(0, 9).join("\n"),
  );
  expect(container.querySelector("[data-reference-truncated=true]")).not.toBeNull();
  expect(queryByRole("button")).toBeNull();
  expect(intersection).not.toHaveBeenCalled();
  expect(resize).not.toHaveBeenCalled();
});

it("uses the existing type disclosure and mounts source only when the reader expands it", () => {
  const { container, getByRole } = render(
    <ReferenceDefinitions
      definitions={[
        {
          name: "WidgetProps",
          code: "export type WidgetProps = { label: string };",
          source: { label: "Complete WidgetProps", href: "/docs/widget/installation#widget-props" },
        },
      ]}
    />,
  );
  expect(container.querySelector("[data-slot=type-definition]")).not.toBeNull();
  expect(container.querySelector("[data-slot=code]")).toBeNull();
  fireEvent.click(getByRole("button", { name: "View Definition: WidgetProps" }));
  expect(container.querySelector("pre code")).toHaveTextContent(
    "export type WidgetProps = { label: string };",
  );
});
