/**
 * @file Documented type excerpts for the Application Shell 1 API reference.
 * Raw source keeps every declaration and field comment in sync with the block.
 */
import type { ApplicationShell1Props } from "@kamod-ch/blocks/application-shell";
import typesSource from "../../../blocks/src/application-shell/application-shell-1/types.ts?raw";

export const applicationShellTypeNames = [
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
export type ApplicationShellTypeName = (typeof applicationShellTypeNames)[number];

/** A documented object field; intersections include the inherited fields too. */
export type ApplicationShellTypeField = {
  name: string;
  type: string;
  required: boolean;
};

function invalidSource(detail: string): never {
  throw new Error(`Application Shell type documentation is out of sync with types.ts: ${detail}`);
}

const withoutComments = (source: string) =>
  source.replace(/^[\t ]*(?:\/\*[\s\S]*?\*\/|\/\/[^\r\n]*)[\t ]*(?:\r?\n|$)/gm, "").trim();

/**
 * Split this file's documented top-level declarations, retaining nested JSDoc.
 * This deliberately follows types.ts's layout instead of parsing TypeScript;
 * reject changed layouts rather than silently showing incomplete contracts.
 */
export function readApplicationShellTypes(source: string) {
  const [preamble, ...sections] = source.trim().split(/\r?\n(?=\/\*\*)/);
  const exports = [...source.matchAll(/^export type (\w+) = /gm)];
  if (
    sections.length !== applicationShellTypeNames.length ||
    exports.length !== applicationShellTypeNames.length ||
    preamble?.includes("export type ")
  ) {
    invalidSource("each public type needs one top-level JSDoc and one exported declaration.");
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
      invalidSource(`invalid or duplicate declaration ${name ?? "(unnamed)"}.`);
    }
    excerpts.set(name, excerpt);
  }

  const sources = Object.fromEntries(
    applicationShellTypeNames.map((name) => {
      const excerpt = excerpts.get(name);
      if (!excerpt) invalidSource(`missing ${name}.`);
      return [name, excerpt];
    }),
  ) as Record<ApplicationShellTypeName, string>;

  // The public data shapes use one field per line and single-type intersections.
  // Keep this reader deliberately small; fail clearly if that source convention changes.
  const fields = {} as Record<ApplicationShellTypeName, readonly ApplicationShellTypeField[]>;
  const reading = new Set<ApplicationShellTypeName>();
  const readFields = (name: ApplicationShellTypeName): readonly ApplicationShellTypeField[] => {
    if (fields[name]) return fields[name];
    if (reading.has(name)) invalidSource(`circular inheritance in ${name}.`);
    reading.add(name);
    const declaration = withoutComments(sources[name]);
    const object = declaration.match(/^export type \w+ = (?:(\w+) & )?\{\r?\n([\s\S]*)\r?\n\};$/);
    if (!object) {
      if (declaration.includes(" & ") || /^export type \w+ = \{/.test(declaration)) {
        invalidSource(`unsupported object declaration for ${name}.`);
      }
      reading.delete(name);
      return (fields[name] = []);
    }
    const ownFields = object[2]
      .split(/\r?\n/)
      .filter((line) => line.trim())
      .map((line) => {
        const field = line.trimEnd().match(/^[\t ]+(\w+)(\?)?: (.+);$/);
        if (!field) invalidSource(`expected a single-line field in ${name}: ${line.trim()}`);
        return { name: field[1], type: field[3], required: !field[2] };
      });
    const parent = object[1];
    if (parent && !applicationShellTypeNames.some((type) => type === parent)) {
      invalidSource(`unknown inherited type ${parent} in ${name}.`);
    }
    fields[name] = [
      ...ownFields,
      ...(parent ? readFields(parent as ApplicationShellTypeName) : []),
    ];
    reading.delete(name);
    return fields[name];
  };
  for (const name of applicationShellTypeNames) readFields(name);
  return { sources, fields };
}

const definitions = readApplicationShellTypes(typesSource);

/** Exact types.ts declarations, including their type-level and field-level JSDoc. */
export const applicationShellTypeSources = definitions.sources;

/** Source-derived fields keep prop types and required markers aligned with the actual API. */
export const applicationShellTypeFields = definitions.fields;

/** Public component props in declaration order, with links to their referenced shell types. */
export const applicationShellPropFields = applicationShellTypeFields.ApplicationShell1Props.map(
  (field) => ({
    ...field,
    name: field.name as keyof ApplicationShell1Props,
    definition: applicationShellTypeNames.find((name) =>
      new RegExp(`\\b${name}\\b`).test(field.type),
    ),
  }),
);

/**
 * Compact component signature for display and copying. This declaration keeps its
 * comments on separate lines; remove those blocks/lines without rewriting fields.
 * The full source above remains available to the documented type reference.
 */
export const applicationShellPropsSignature = withoutComments(
  applicationShellTypeSources.ApplicationShell1Props,
);
