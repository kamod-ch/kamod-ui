import { describe, expect, it } from "vitest";
import typesSource from "../../../blocks/src/application-shell/application-shell-1/types.ts?raw";
import { propDescriptions } from "./application-shell-api-data";
import {
  applicationShellPropFields,
  applicationShellPropsSignature,
  applicationShellTypeFields,
  applicationShellTypeSources,
  readApplicationShellTypes,
} from "./application-shell-type-source";

describe("application shell type documentation", () => {
  it("covers all ten public contracts from types.ts exactly once", () => {
    const exportedNames = [...typesSource.matchAll(/^export type (\w+) = /gm)].map(
      (match) => match[1],
    );
    expect(exportedNames).toHaveLength(10);
    expect(Object.keys(applicationShellTypeSources)).toEqual(exportedNames);
    for (const [name, excerpt] of Object.entries(applicationShellTypeSources)) {
      expect(excerpt).toMatch(/^\/\*\*/);
      expect(excerpt).toContain(`export type ${name} = `);
      expect([...excerpt.matchAll(/^export type /gm)]).toHaveLength(1);
    }
  });

  it("preserves every declaration and JSDoc comment without rewriting the source", () => {
    const firstTypeIndex = typesSource.indexOf("export type ");
    const firstCommentIndex = typesSource.lastIndexOf("\n/**", firstTypeIndex) + 1;
    const completeContracts = typesSource.slice(firstCommentIndex).trim();

    expect(Object.values(applicationShellTypeSources).join("\n\n")).toBe(completeContracts);
    expect(applicationShellTypeSources.ApplicationShellNavigate).toContain("@param destination");
    expect(applicationShellTypeSources.ApplicationShell1Props).toContain(
      "/** Initial uncontrolled desktop state; defaults to `true`. Ignored when `open` is supplied. */",
    );
  });

  it("derives complete prop rows, required markers and type links from the declaration", () => {
    expect(applicationShellPropFields.map((field) => field.name)).toEqual(
      Object.keys(propDescriptions),
    );
    expect(
      applicationShellPropFields.filter((field) => field.required).map((field) => field.name),
    ).toEqual(["brand", "navigationGroups", "user", "breadcrumbs"]);
    expect(
      applicationShellPropFields.find((field) => field.name === "navigationGroups"),
    ).toMatchObject({
      type: "readonly ApplicationShellNavigationGroup[]",
      definition: "ApplicationShellNavigationGroup",
    });
    expect(applicationShellPropFields.find((field) => field.name === "onUserAction")).toMatchObject(
      {
        type: "(action: ApplicationShellUserAction) => void",
        definition: "ApplicationShellUserAction",
        required: false,
      },
    );
  });

  it("includes inherited required fields without marking optional or callback types as required", () => {
    const requiredFields = (name: keyof typeof applicationShellTypeFields) =>
      applicationShellTypeFields[name].filter((field) => field.required).map((field) => field.name);
    expect(requiredFields("ApplicationShellNavigationItem")).toEqual(["id", "label"]);
    expect(requiredFields("ApplicationShellUser")).toEqual(["name", "email"]);
    expect(requiredFields("ApplicationShellNavigationGroup")).toEqual(["id", "items"]);
    expect(requiredFields("ApplicationShellIcon")).toEqual([]);
    expect(requiredFields("ApplicationShellNavigate")).toEqual([]);
    expect(requiredFields("ApplicationShellUserAction")).toEqual([]);
  });

  it("removes comments only from the compact component signature", () => {
    expect(applicationShellPropsSignature).toMatch(/^export type ApplicationShell1Props = \{/);
    expect(applicationShellPropsSignature).not.toMatch(/\/\*|\*\/|\/\//);
    expect(applicationShellPropsSignature).toContain("defaultOpen?: boolean;");
    expect(applicationShellTypeSources.ApplicationShell1Props).toContain(
      "Initial uncontrolled desktop state",
    );
  });

  it("keeps source comments and field extraction intact with Windows line endings", () => {
    const windowsSource = typesSource.replaceAll("\n", "\r\n");
    const parsed = readApplicationShellTypes(windowsSource);
    expect(parsed.fields).toEqual(applicationShellTypeFields);
    expect(parsed.sources.ApplicationShellBrand).toContain("\r\n");
  });

  it.each([
    [
      "missing public type",
      typesSource.replace("export type ApplicationShellUser =", "type ApplicationShellUser ="),
    ],
    ["unsupported multiline field", typesSource.replace("name: string;", "name:\n    string;")],
    [
      "unknown inherited type",
      typesSource.replace("ApplicationShellDestination & {", "UnknownDestination & {"),
    ],
    [
      "circular inheritance",
      typesSource.replace("ApplicationShellDestination & {", "ApplicationShellNavigationItem & {"),
    ],
  ])("rejects %s rather than publishing incomplete type metadata", (_reason, source) => {
    expect(() => readApplicationShellTypes(source)).toThrow(
      "Application Shell type documentation is out of sync",
    );
  });
});
