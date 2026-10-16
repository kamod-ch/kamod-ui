import { expect, it } from "vitest";
import { createCodeReferenceSourceModule } from "../../../.preactpress/code-reference-help";
import { extractCodeReferenceSections } from "../../../.preactpress/code-reference-sections";
import type { CodeReferenceHelpCatalog } from "../types";
import { describeCodeReference } from "./loader";

const catalog: CodeReferenceHelpCatalog = { packages: {}, loaders: {} };

it("extracts exact local guide rows, defaults and installation literals without evaluating page code", () => {
  const sections = extractCodeReferenceSections(
    `
    const installation = 'import { Widget } from "@/components/kamod-ui/widget";';
    const rows = [{ prop: "label", type: "string", defaultValue: "untitled", description: "Visible label." }];
    const apiSections = [{ title: "Widget", rows }] as const;
    export const widgetDocPage = { slug: "widget", command: "pnpm add widget-dependency", sections: [{ id: "installation", text: "Use the source module." }] };
    function body(sectionId: string) {
      if (sectionId === "installation") return <CodeBlock code={installation} />;
      return <ApiReference sections={apiSections} />;
    }
    const skipped = createGenericDocPage(loadUntrustedConfig());
  `,
    "widget",
  );
  expect(sections[0]).toMatchObject({
    title: "Install & import",
    code: { value: 'import { Widget } from "@/components/kamod-ui/widget";' },
    rows: [{ label: "Install", value: "`pnpm add widget-dependency`" }],
  });
  expect(sections[1]).toMatchObject({
    contractName: "Widget",
    fields: [
      { name: "label", type: "string", defaultValue: "untitled", description: "Visible label." },
    ],
  });
  expect(extractCodeReferenceSections('const unused = { command: "invented" };', "widget")).toEqual(
    [],
  );
});

it("keeps aggregate guide rows relevant to the exact component and preserves its complete local declaration", () => {
  const module = createCodeReferenceSourceModule(
    "direction",
    [
      {
        file: "packages/core/src/components/direction/Direction.tsx",
        source: `export type DirectionProviderProps = {
      /** Reading direction. */
      direction?: "ltr" | "rtl";
    };
      export const DirectionProvider = (props: DirectionProviderProps) => <div />;
      export type DirectionProps = DirectionProviderProps & { dir?: "ltr" | "rtl" };
      export const Direction = (props: DirectionProps) => <div />;`,
      },
    ],
    `const page = createGenericDocPage({ slug: "direction", title: "Direction", apiRows: [
    {prop: "DirectionProvider direction", type: '"ltr" | "rtl"', defaultValue: '"ltr"'},
    {prop: "Direction dir", type: '"ltr" | "rtl"', defaultValue: '"ltr"'},
    {prop: "useDirection()", type: "DirectionValue", defaultValue: '"ltr"'}
  ] });`,
  );
  const help = describeCodeReference(
    {
      module: "@kamod-ch/ui/direction",
      imported: "DirectionProvider",
      label: "DirectionProvider",
      href: "/docs/direction/installation#api-reference",
    },
    catalog,
    module,
  );
  const props = help.sections!.find((section) => section.fields)!;
  expect(props.fields).toHaveLength(1);
  expect(props.fields!.map((field) => field.name)).not.toContain("Direction dir");
  expect(props.fields![0]).toMatchObject({
    name: "DirectionProvider direction",
    description: "Reading direction.",
    defaultValue: '"ltr"',
  });
  expect(help.sections!.find((section) => section.definitions)?.definitions![0]).toMatchObject({
    name: "DirectionProviderProps",
    code: expect.stringContaining('direction?: "ltr" | "rtl"'),
    source: {
      href: "/docs/direction/installation#component-type-Direction-DirectionProviderProps",
    },
  });
  expect(
    help.sections!.flatMap((section) => section.definitions ?? []).map(({ name }) => name),
  ).not.toContain("DirectionProps");
  expect(help.related!.map(({ label }) => label)).toContain("DirectionProps");
});

it("does not use a sibling component's API table when no documented table matches", () => {
  const module = createCodeReferenceSourceModule(
    "accordion",
    [
      {
        file: "packages/core/src/components/widget/Widget.tsx",
        source:
          "export type WidgetItemProps = { value: string }; export const WidgetItem = (props: WidgetItemProps) => <div />;",
      },
    ],
    `const widgetDocPage = { slug: "accordion", title: "Widget" }; const table = <ApiReference sections={[{ title: "Widget", rows: [{prop: "open", type: "boolean", defaultValue: "false"}] }]} />;`,
  );
  const help = describeCodeReference(
    {
      module: "@kamod-ch/ui/widget",
      imported: "WidgetItem",
      label: "WidgetItem",
      href: "/docs/widget/installation#api-reference",
    },
    catalog,
    module,
  );
  expect(help.sections!.find((section) => section.fields)?.fields).toEqual([
    expect.objectContaining({ name: "value", required: true }),
  ]);
  expect(
    help
      .sections!.flatMap((section) => section.fields ?? [])
      .some((field) => field.name === "open"),
  ).toBe(false);
});
