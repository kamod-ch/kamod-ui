import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";
import {
  createCodeReferenceSourceModule,
  extractCodeReferenceGuide,
  extractCodeReferenceSymbols,
  extractPackageReferenceSymbols,
} from "../../../.preactpress/code-reference-help";
import { withBasePath } from "../../base-path";
import { componentPropsId } from "../../docs/components/component-detail/component-api-id";
import { inlineSourceReference } from "../inline-references";
import type { CodeReferenceHelpCatalog, CodeReferenceHelpRequest } from "../types";
import { describeCodeReference, loadCodeReferenceHelp } from "./loader";

const empty: CodeReferenceHelpCatalog = { packages: {}, loaders: {} };
const directionRequest: CodeReferenceHelpRequest = {
  module: "@/components/kamod-ui/direction",
  imported: "DirectionProvider",
  label: "DirectionProvider",
  href: "/docs/direction/installation#api-reference",
};

it("classifies declared callable values by their function type, preserving ordinary constants", () => {
  const symbols = extractPackageReferenceSymbols(
    "export declare const useTheme: () => ThemeContextValue; export declare const version: string;",
    "index.d.ts",
  );
  expect(symbols.find(({ name }) => name === "useTheme")).toMatchObject({
    kind: "function",
    signature: "useTheme: () => ThemeContextValue",
  });
  expect(symbols.find(({ name }) => name === "version")?.kind).toBe("constant");
});

it("loads the verified theme hook declaration for its parenthesized inline reference", async () => {
  const request = inlineSourceReference("useTheme()")!;
  const help = await loadCodeReferenceHelp(request);
  expect(help).toMatchObject({ kind: "function", name: "useTheme()", module: "@kamod-ch/themes" });
  expect(help.signature).toContain("ThemeContextValue");
  expect(help.docs?.href).toBe("/docs/theming/installation#read-and-change-appearance");
});

it("extracts declaration kinds, actual JSDoc and only directly declared fields", () => {
  const symbols = extractCodeReferenceSymbols(
    `
    /** Public contract. */
    export type WidgetProps = HTMLAttributes<HTMLDivElement> & {
      /** Display label. */ label: string;
      expanded?: boolean;
    };
    /** Displays the widget. */
    export const Widget = ({label}: WidgetProps) => <div>{label}</div>;
    export function useWidget(value: number): number { return value; }
    export const MATCH = /^widget$/;
  `,
    "packages/core/src/components/widget/Widget.tsx",
  );
  expect(symbols.find(({ name }) => name === "Widget")).toMatchObject({
    kind: "component",
    description: "Displays the widget.",
    signature: "WidgetProps",
    typeNames: ["WidgetProps"],
    fields: [
      { name: "label", type: "string", required: true, description: "Display label." },
      { name: "expanded", type: "boolean", required: false },
    ],
  });
  expect(symbols.find(({ name }) => name === "WidgetProps")?.typeId).toBe(
    "component-type-Widget-WidgetProps",
  );
  expect(symbols.find(({ name }) => name === "useWidget")?.kind).toBe("function");
  expect(symbols.find(({ name }) => name === "MATCH")?.kind).toBe("constant");
});

it("reads real API table titles and generic guide metadata without evaluating page code", () => {
  expect(
    extractCodeReferenceGuide(
      `
    const doc = createGenericDocPage({ slug: "direction", title: "Direction", usageLabel: "**Directional** context.", apiRows: [] });
    const other = <ApiReference sections={[{ title: "DirectionProvider", rows: [] }]} />;
  `,
      "direction",
    ),
  ).toEqual({
    title: "Direction",
    description: "**Directional** context.",
    propsTitles: ["Direction", "DirectionProvider"],
  });
  expect(
    extractCodeReferenceGuide('const heading = { title: "Invented props" };', "widget").propsTitles,
  ).toEqual([]);
});

it("links DirectionProvider to actual implementation, related contracts and a stable props table", async () => {
  const file = "packages/core/src/components/direction/Direction.tsx";
  const source = await readFile(
    new URL("../../../../core/src/components/direction/Direction.tsx", import.meta.url),
    "utf8",
  );
  const guide = await readFile(
    new URL("../../docs/pages/direction-doc.tsx", import.meta.url),
    "utf8",
  );
  const module = createCodeReferenceSourceModule("direction", [{ file, source }], guide);
  const help = describeCodeReference(directionRequest, empty, module);
  expect(help.kind).toBe("component");
  expect(help.description).toContain("HTML `dir` attribute");
  expect(help.description).not.toContain("React context");
  expect(help.source?.href).toBe(`https://github.com/kamod-ch/kamod-ui/blob/main/${file}`);
  expect(help.related).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        label: "DirectionProviderProps",
        href: "/docs/direction/installation#component-type-Direction-DirectionProviderProps",
      }),
      expect.objectContaining({
        label: "DirectionProps",
        href: "/docs/direction/installation#component-type-Direction-DirectionProps",
      }),
      expect.objectContaining({
        label: "Props & defaults",
        href: `/docs/direction/installation#${componentPropsId("direction", "Direction")}`,
      }),
    ]),
  );
  expect(help.fields?.find(({ name }) => name === "direction")).toMatchObject({
    type: "DirectionValue",
    required: false,
  });
});

it("keeps aliases tied to original exports and legacy anchors recover source metadata", async () => {
  const help = await loadCodeReferenceHelp({
    ...directionRequest,
    local: "ReadingDirection",
    label: "ReadingDirection",
  });
  expect(help.name).toBe("ReadingDirection");
  expect(help.detail).toContain("DirectionProvider as ReadingDirection");
  const legacy = await loadCodeReferenceHelp({
    ...directionRequest,
    module: "",
    imported: undefined,
  });
  expect(legacy.source?.href).toContain("/direction/Direction.tsx");
  const unknown = await loadCodeReferenceHelp({
    module: "@kamod-ch/ui/card",
    imported: "Button",
    label: "Button",
    href: "https://github.com/kamod-ch/kamod-ui",
  });
  expect(unknown.fields).toBeUndefined();
  expect(unknown.related).toEqual([]);
});

it("keeps unresolved exports distinct from their verified owning module", async () => {
  const module = {
    ...directionRequest,
    imported: undefined,
    label: "@/components/kamod-ui/direction",
  };
  expect((await loadCodeReferenceHelp(module)).kind).toBe("module");
  const unknown = await loadCodeReferenceHelp({
    ...module,
    imported: "UnlistedDirection",
    label: "UnlistedDirection",
  });
  expect(unknown.kind).toBe("export");
  expect(unknown.fields).toBeUndefined();
});

it("module source links use the scanned folder or utility file rather than a guide slug or repository root", () => {
  const component = createCodeReferenceSourceModule("renamed-button", [
    {
      file: "packages/core/src/components/button/Button.tsx",
      source: "export const Button = () => null;",
    },
  ]);
  for (const module of ["@/components/kamod-ui/button", "@kamod-ch/ui/button"]) {
    const help = describeCodeReference(
      { module, label: module, href: "/docs/button/installation" },
      empty,
      component,
    );
    expect(help.source).toEqual({
      label: "Source directory",
      href: "https://github.com/kamod-ch/kamod-ui/tree/main/packages/core/src/components/button",
    });
  }
  const utility = createCodeReferenceSourceModule("cn", [
    { file: "packages/core/src/lib/utils.ts", source: "export function cn() {}" },
  ]);
  expect(
    describeCodeReference(
      { module: "@/lib/utils", label: "@/lib/utils", href: "/docs/cn" },
      empty,
      utility,
    ).source,
  ).toEqual({
    label: "Implementation",
    href: "https://github.com/kamod-ch/kamod-ui/blob/main/packages/core/src/lib/utils.ts",
  });
});

it("recognizes relative component imports only when the checkout path and destination both match", async () => {
  const request: CodeReferenceHelpRequest = {
    module: "./components/button/Button",
    filePath: "packages/core/src/index.ts",
    imported: "Button",
    label: "Button",
    href: withBasePath("/docs/button/installation#api-reference"),
  };
  const help = await loadCodeReferenceHelp(request);
  expect(help.kind).toBe("component");
  expect(help.docs?.href).toBe(request.href);
  expect(help.source?.href).toBe(
    "https://github.com/kamod-ch/kamod-ui/blob/main/packages/core/src/components/button/Button.tsx",
  );
  expect((await loadCodeReferenceHelp({ ...request, module: "./components/card/Card" })).kind).toBe(
    "file",
  );
  expect(
    (
      await loadCodeReferenceHelp({
        ...request,
        href: withBasePath("/docs/card/installation#api-reference"),
      })
    ).kind,
  ).toBe("file");
  expect((await loadCodeReferenceHelp({ ...request, filePath: "src/index.ts" })).kind).toBe("file");
  const github = await loadCodeReferenceHelp({ ...request, href: help.source!.href });
  expect(github.kind).toBe("component");
});

it("distinguishes package, submodule, icon and helper cards using verified package facts", () => {
  const data: CodeReferenceHelpCatalog = {
    loaders: {},
    packages: {
      preact: {
        name: "preact",
        description: "Fast component rendering.",
        repository: "https://github.com/preactjs/preact",
        license: "MIT",
      },
      "lucide-preact": {
        name: "lucide-preact",
        description: "SVG icon components.",
        repository: "https://github.com/lucide-icons/lucide",
      },
    },
  };
  const help = (module: string, imported?: string) =>
    describeCodeReference(
      { module, imported, label: imported || module, href: "https://github.com/preactjs/preact" },
      data,
    );
  expect(help("preact").kind).toBe("package");
  expect(help("preact/hooks").kind).toBe("module");
  expect(help("lucide-preact", "ChevronUp").kind).toBe("icon");
  expect(help("@kamod-ch/hooks", "useCounter").description).toContain(
    "increment, decrement, set and reset",
  );
  expect(help("@kamod-ch/hooks", "useCounter").source?.href).toContain(
    "kamod-hooks/blob/main/packages/core/src/useCounter/index.ts",
  );
});

it("reads locally re-exported declaration kinds without publishing private definitions", () => {
  const symbols = extractPackageReferenceSymbols(
    `
    /** Base value contract. */
    interface PublicValue { value: string; }
    interface PrivateValue { secret: string; }
    /** Flush all updates together. */
    declare function batch<T>(callback: () => T): T;
    export { batch, PublicValue };
  `,
    "signals.d.ts",
  );
  expect(symbols.find(({ name }) => name === "batch")).toMatchObject({
    kind: "function",
    description: "Flush all updates together.",
    signature: "function batch<T>(callback: () => T): T",
  });
  expect(symbols.find(({ name }) => name === "PublicValue")).toMatchObject({
    kind: "type",
    fields: [{ name: "value", type: "string", required: true }],
  });
  expect(symbols.some(({ name }) => name === "PrivateValue")).toBe(false);
});

it("loads bounded installed Preact and Signals declarations for accurate type and hook cards", async () => {
  const help = (module: string, imported: string) =>
    loadCodeReferenceHelp({
      module,
      imported,
      label: imported,
      href: "https://github.com/preactjs/preact",
    });
  const state = await help("preact/hooks", "useState");
  expect(state.kind).toBe("function");
  expect(state.description).toContain("stateful value");
  expect(state.signature).toContain("initialState");
  const children = await help("preact", "ComponentChildren");
  expect(children.kind).toBe("type");
  expect(children.signature).toBe("ComponentChild[] | ComponentChild");
  const signal = await help("@preact/signals", "Signal");
  expect(signal.kind).toBe("type");
  expect(signal.description).toContain("base class for plain and computed signals");
  const batch = await help("@preact/signals", "batch");
  expect(batch.kind).toBe("function");
  expect(batch.description).toContain("Combine multiple value updates");
  expect(batch.source?.href).toBe("https://github.com/preactjs/signals");
});

it("does not mistake a namespace member for an aliased import", async () => {
  const help = await loadCodeReferenceHelp({
    module: "@kamod-ch/ui/direction",
    imported: "DirectionProvider",
    local: "UI",
    label: "DirectionProvider",
    href: "/docs/direction/installation#api-reference",
  });
  expect(help.kind).toBe("component");
  expect(help.detail).toBeUndefined();
});

it("does not guess an unindexed export's kind from capitalization", () => {
  const help = describeCodeReference(
    {
      module: "@kamod-ch/themes",
      imported: "THEME_PRESETS",
      label: "THEME_PRESETS",
      href: "/docs/theming/installation",
    },
    empty,
  );
  expect(help.kind).toBe("export");
  expect(help.fields).toBeUndefined();
  expect(help.signature).toBeUndefined();
});
