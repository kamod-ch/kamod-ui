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
    function unrelatedPreview() { const rows = [{ prop: "wrong", type: "number", defaultValue: "0" }]; return rows; }
    export const widgetDocPage = { slug: "widget", command: "pnpm add widget-dependency", usageImportSnippet: installation, sections: [{ id: "installation", text: "Use the source module." }] };
    function body(sectionId: string) {
      if (sectionId === "installation") return <CodeBlock code={installation} />;
      return <ApiReference sections={apiSections} />;
    }
    const skipped = createGenericDocPage(loadUntrustedConfig());
  `,
    "widget",
  );
  expect(sections[0]).toMatchObject({
    title: "Installation & usage",
    excerpts: [
      {
        title: "Installation",
        description: "Use the source module.",
        code: { value: "pnpm add widget-dependency" },
      },
      { title: "Usage", code: { value: 'import { Widget } from "@/components/kamod-ui/widget";' } },
    ],
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

it("preserves the real Dialog composition table, source ownership and both actual setup snippets", async () => {
  const directory = new URL("../../../../core/src/components/dialog/", import.meta.url);
  const sources = await Promise.all(
    (await readdir(directory))
      .filter((file) => file.endsWith(".tsx") && !file.includes(".test."))
      .map(async (file) => ({
        file: `packages/core/src/components/dialog/${file}`,
        source: await readFile(new URL(file, directory), "utf8"),
      })),
  );
  const source = await readFile(
    new URL("../../docs/pages/dialog-doc.tsx", import.meta.url),
    "utf8",
  );
  const module = createCodeReferenceSourceModule("dialog", sources, source);
  const helpFor = (name: string) =>
    describeCodeReference(
      {
        module: "@kamod-ch/ui/dialog",
        imported: name,
        label: name,
        href: "/docs/dialog/installation#api-reference",
      },
      catalog,
      module,
    );
  const help = helpFor("Dialog");
  const setup = help.sections!.find((section) => section.excerpts)!;
  expect(setup.excerpts).toHaveLength(2);
  expect(setup.excerpts![0]).toMatchObject({
    title: "Installation",
    description: expect.stringContaining('presentation="slot"'),
    code: { value: "pnpm add @kamod-ch/ui", language: "bash" },
    source: { href: "/docs/dialog/installation#installation" },
  });
  expect(setup.excerpts![1]).toMatchObject({
    title: "Usage",
    description: expect.stringContaining("two backdrops"),
    code: { value: 'import { Dialog } from "@/components/kamod-ui/dialog";', language: "tsx" },
    source: { href: "/docs/dialog/installation#usage" },
  });
  const props = help.sections!.find((section) => section.fields)!;
  expect(props.fields).toHaveLength(7);
  expect(props.fields!.map((field) => field.name)).toEqual([
    "Dialog lockBodyScroll",
    "open / onOpenChange",
    "defaultOpen",
    "DialogContent presentation",
    "DialogContent showCloseButton",
    "DialogContent forceMount",
    "DialogTrigger / DialogClose asChild",
  ]);
  expect(props.fields![3]).toMatchObject({
    type: '"modal" | "slot"',
    defaultValue: '"modal" — use "slot" if DialogContent has fixed inset-0 overlay',
    description: expect.stringContaining("one portaled element"),
    owners: [
      {
        label: "DialogContentProps",
        href: "/docs/dialog/installation#component-type-DialogContent-DialogContentProps",
      },
    ],
  });
  expect(props.fields![6].owners?.map(({ label }) => label)).toEqual([
    "DialogCloseProps",
    "DialogTriggerProps",
  ]);
  expect(props.fields![4].description).toContain(
    "[Usage Guidance](/docs/dialog/installation#usage)",
  );
  const contracts = help.sections!.find((section) => section.definitions)!;
  expect(contracts.definitions![0].name).toBe("DialogContextValue");
  expect(contracts).toMatchObject({
    title: "Data type reference",
    source: { href: "/docs/dialog/installation#component-data-types" },
  });
  expect(contracts.definitions?.map(({ name }) => name)).toEqual(
    expect.arrayContaining([
      "DialogProps",
      "DialogContentProps",
      "DialogContentPresentation",
      "DialogTriggerProps",
      "DialogCloseProps",
    ]),
  );
  expect(contracts.definitions?.find(({ name }) => name === "DialogContentProps")).toMatchObject({
    filePath: "packages/core/src/components/dialog/DialogContent.tsx",
    exported: true,
    fields: expect.arrayContaining([
      expect.objectContaining({ name: "presentation", type: "DialogContentPresentation" }),
    ]),
  });
  const content = helpFor("DialogContent");
  expect(
    content.sections!.find((section) => section.fields)?.fields!.map(({ name }) => name),
  ).toEqual([
    "DialogContent presentation",
    "DialogContent showCloseButton",
    "DialogContent forceMount",
  ]);
  expect(
    content.sections!.find((section) => section.definitions)?.definitions?.map(({ name }) => name),
  ).toEqual(["DialogContentProps", "DialogContentPresentation"]);
  const type = helpFor("DialogContentProps");
  expect(type.sections!.some((section) => section.fields || section.excerpts)).toBe(false);
  expect(
    type.sections!.find((section) => section.definitions)?.definitions?.map(({ name }) => name),
  ).toEqual(["DialogContentPresentation", "DialogContentProps"]);
});

it("reads explicit usage-import overrides outside a generic page configuration without evaluating page code", () => {
  const sections = extractCodeReferenceSections(
    `export const page = { ...createGenericDocPage({slug: "dialog", title: "Dialog", installationText: "Install it.", usageText: "Use it.", apiRows: []}), usageImportSnippet: 'import { Dialog } from "@kamod-ch/ui";' };`,
    "dialog",
  );
  expect(sections[0].excerpts![1].code?.value).toBe('import { Dialog } from "@kamod-ch/ui";');
});

it("keeps the real Pagination table's rich guidance and resolves its authored section links", async () => {
  const source = await readFile(
    new URL("../../docs/pages/pagination-doc.tsx", import.meta.url),
    "utf8",
  );
  const fields = extractCodeReferenceSections(source, "pagination").find(
    (section) => section.fields,
  )!.fields!;
  expect(fields).toHaveLength(5);
  expect(fields[0].description).toContain('**Mark the Current Page.** Sets `aria-current="page"`');
  expect(fields[0].description).toContain(
    "[Full Navigation Example](/docs/pagination/installation#pagination-demo)",
  );
  expect(fields[1].description).toContain(
    "[Button Size Tokens](/docs/button/installation#api-reference)",
  );
  expect(fields[2].description).toContain("translated `aria-label`");
  expect(fields[2].description).toContain(
    "[RTL Example](/docs/pagination/installation#pagination-rtl)",
  );
  expect(fields[4].description).toContain("**Alignment and Width**");
});

it("does not evaluate unknown JSX expressions or emit unsafe authored links", () => {
  const fields = extractCodeReferenceSections(
    `
    const page = createGenericDocPage({slug: "dialog", title: "Dialog", apiRows: [
      {prop: "unknown", type: "string", defaultValue: "undefined", description: <span>Before {runUnknownPageCode()} after</span>},
      {prop: "unsafe", type: "string", defaultValue: "undefined", description: <a href="javascript:alert(1)">Unsafe link</a>},
      {prop: "literal", type: "string", defaultValue: "undefined", description: <span>Known <strong>literal</strong> and <code>{"safe"}</code> text.</span>}
    ]});
  `,
    "dialog",
  ).find((section) => section.fields)!.fields!;
  expect(fields[0].description).toBe("");
  expect(fields[1].description).toBe("");
  expect(fields[2].description).toBe("Known **literal** and `safe` text.");
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

import { readdir, readFile } from "node:fs/promises";
