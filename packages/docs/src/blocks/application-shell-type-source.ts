/**
 * @file Documented type excerpts for the Application Shell 1 API reference.
 * Raw source keeps every declaration and field comment in sync with the block.
 */
import typesSource from "../../../blocks/src/application-shell/application-shell-1/types.ts?raw";

const typeNames = [
  "ApplicationShellIcon",
  "ApplicationShellDestination",
  "ApplicationShellNavigationLink",
  "ApplicationShellNavigationItem",
  "ApplicationShellNavigationGroup",
  "ApplicationShellBrand",
  "ApplicationShellUser",
  "ApplicationShellUserAction",
  "ApplicationShellNavigate",
  "ApplicationShell1Props",
] as const;

/** Public type names supported by the shell's documentation reference. */
export type ApplicationShellTypeName = (typeof typeNames)[number];

/**
 * Split this file's documented top-level declarations, retaining nested JSDoc.
 * This deliberately follows types.ts's layout instead of parsing TypeScript;
 * reject changed layouts rather than silently showing incomplete contracts.
 */
function readTypeSources(): Record<ApplicationShellTypeName, string> {
  const fail = () => {
    throw new Error(
      "Application Shell type documentation is out of sync with types.ts. " +
        "Each listed type must have its own top-level JSDoc followed by one exported type declaration.",
    );
  };
  const [preamble, ...sections] = typesSource.trim().split(/\r?\n(?=\/\*\*)/);
  const exports = [...typesSource.matchAll(/^export type (\w+) = /gm)];
  if (
    sections.length !== typeNames.length ||
    exports.length !== typeNames.length ||
    preamble?.includes("export type ")
  ) {
    fail();
  }

  const excerpts = new Map<string, string>();
  for (const section of sections) {
    const excerpt = section.trim();
    const commentEnd = excerpt.indexOf("*/");
    const declaration = excerpt.slice(commentEnd + 2).trimStart();
    const name = declaration.match(/^export type (\w+) = /)?.[1];
    if (
      !excerpt.startsWith("/**") ||
      commentEnd < 0 ||
      !name ||
      excerpts.has(name) ||
      !declaration.endsWith(";") ||
      [...declaration.matchAll(/^export type /gm)].length !== 1
    ) {
      fail();
    }
    excerpts.set(name!, excerpt);
  }

  return Object.fromEntries(
    typeNames.map((name) => {
      const excerpt = excerpts.get(name);
      if (!excerpt) fail();
      return [name, excerpt];
    }),
  ) as Record<ApplicationShellTypeName, string>;
}

/** Exact types.ts declarations, including their type-level and field-level JSDoc. */
export const applicationShellTypeSources = readTypeSources();

/**
 * Compact component signature for display and copying. This declaration keeps its
 * comments on separate lines; remove those blocks/lines without rewriting fields.
 * The full source above remains available to the documented type reference.
 */
export const applicationShellPropsSignature =
  applicationShellTypeSources.ApplicationShell1Props.replace(
    /^[\t ]*(?:\/\*[\s\S]*?\*\/|\/\/[^\r\n]*)[\t ]*(?:\r?\n|$)/gm,
    "",
  ).trim();
