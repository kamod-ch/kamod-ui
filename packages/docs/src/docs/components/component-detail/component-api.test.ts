import { describe, expect, it } from "vitest";
import {
  componentApiCatalogModule,
  extractComponentTypes,
} from "../../../../.preactpress/component-api-plugin";
import {
  componentApiOwner,
  componentApiRowOwners,
  componentApiTypes,
  componentTypeId,
} from "./component-api";

describe("component API source extraction", () => {
  it("keeps declarations out of the browser entry while preserving synchronous SSR", () => {
    const browser = componentApiCatalogModule(["accordion", "button"], false);
    expect(browser).toContain("export const sources = {};");
    expect(browser).not.toMatch(/import\s+\w+\s+from/);
    expect(browser).toContain('import("virtual:kamod-component-api/accordion")');
    const server = componentApiCatalogModule(["accordion", "button"], true);
    expect(server).toContain('from "virtual:kamod-component-api/accordion"');
    expect(server).toContain('from "virtual:kamod-component-api/button"');
    expect(server).toContain("export const loaders = {};");
  });
  it("resolves qualified rows to their helper types instead of the enclosing component", () => {
    const owners = (prop: string) =>
      componentApiRowOwners("pagination", "Pagination", prop).map(({ name }) => name);
    expect(owners("PaginationLink isActive")).toEqual(["PaginationLinkProps"]);
    expect(owners("PaginationPrevious / PaginationNext text").sort()).toEqual([
      "PaginationNextProps",
      "PaginationPreviousProps",
    ]);
    expect(owners("class")).toEqual(["PaginationProps"]);
    expect(componentApiRowOwners("missing", "Missing", "value")).toEqual([]);
  });
  it("preserves declarations, optional callbacks and direct required fields without flattening inheritance", () => {
    const source = `type Hidden = string;
/** A configured control. */
export type ControlProps<T> = Base<T> & {
  /** The current record. */
  value: T;
  onChange?: (value: T) => void | Promise<void>;
};
export interface Actions extends Parent { reset(): void; cancel?(): void; }
export type Choice = { left: string } | { right: number };
type ExampleProps = { idPrefix: string };
const example = "export type NotADeclaration = string";`;
    const entries = extractComponentTypes(source, "src/Control.tsx");
    expect(entries.map(({ name }) => name)).toEqual([
      "ControlProps",
      "Actions",
      "Choice",
      "ExampleProps",
    ]);
    expect(entries[0].source).toContain("export type ControlProps<T> = Base<T> &");
    expect(entries[0].description).toBe("A configured control.");
    expect(entries[0].fields).toEqual([
      { name: "value", type: "T", required: true, description: "The current record." },
      {
        name: "onChange",
        type: "(value: T) => void | Promise<void>",
        required: false,
        description: "",
      },
    ]);
    expect(entries[1].fields.map(({ name, required }) => [name, required])).toEqual([
      ["reset", true],
      ["cancel", false],
    ]);
    expect(entries[2].fields).toEqual([]);
    expect(entries[3].exported).toBe(false);
  });

  it("loads actual Progress and Formisch types with unique links and truthful optional markers", () => {
    const progress = componentApiOwner("progress", "Progress");
    expect(progress?.name).toBe("ProgressProps");
    expect(progress?.source).toContain("value?: number | null");
    expect(progress?.fields.every(({ required }) => !required)).toBe(true);
    const forms = componentApiTypes("formisch");
    expect(forms.find(({ name }) => name === "ExampleProps")?.fields).toContainEqual({
      name: "idPrefix",
      type: "string",
      required: true,
      description: "",
    });
    expect(forms.find(({ name }) => name === "BugReportOutput")?.source).toContain(
      "v.InferOutput<typeof BugReportSchema>",
    );
    expect(new Set(forms.map(componentTypeId)).size).toBe(forms.length);
    expect(componentApiTypes("missing")).toBe(componentApiTypes("missing"));
  });
});
