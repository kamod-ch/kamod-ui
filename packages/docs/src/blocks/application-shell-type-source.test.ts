import { describe, expect, it } from "vitest";
import typesSource from "../../../blocks/src/application-shell/application-shell-1/types.ts?raw";
import { applicationShellTypeSources } from "./application-shell-type-source";

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
});
