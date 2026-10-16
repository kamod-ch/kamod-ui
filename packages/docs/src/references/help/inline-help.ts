import { basePrefix, withBasePath } from "../../base-path";
import { parseCommand } from "../command-reference";
import type {
  CodeReferenceHelp,
  CodeReferenceHelpCatalog,
  CodeReferenceHelpRequest,
} from "../types";

const families = new Map<string, Promise<Record<string, CodeReferenceHelp>>>();
const localLink = (href: string) =>
  href.startsWith("/") && !href.startsWith(`${basePrefix()}/`) ? withBasePath(href) : href;
const operations: Record<string, string> = {
  run: "Runs a script defined by the selected project’s package.json. The working directory and workspace flags determine which project owns it.",
  add: "Adds dependencies to the selected project. Check the package names and workspace selection before running it.",
  install:
    "Installs project dependencies, or adds named packages when supported by this tool. Flags and the working directory affect the result.",
  exec: "Runs an executable in the tool’s package context. Follow the tool documentation for dependency resolution and argument handling.",
  dlx: "Fetches a package to run its executable without adding it as a project dependency.",
  status: "With Git, displays working-tree and index status without creating a commit.",
};

/** At most one shared promise per family; failed chunks are evicted so opening again can retry. */
export async function loadInlineReferenceHelp(
  data: CodeReferenceHelpCatalog,
  request: CodeReferenceHelpRequest,
): Promise<CodeReferenceHelp> {
  const id = request.referenceId!;
  const kind = id.split(":", 1)[0];
  const load =
    data.inlineLoaders && Object.hasOwn(data.inlineLoaders, kind)
      ? data.inlineLoaders[kind]
      : undefined;
  if (!load) throw new Error("Unknown inline-reference family");
  let pending = families.get(kind);
  if (!pending) {
    pending = load().catch((error) => {
      families.delete(kind);
      throw error;
    });
    families.set(kind, pending);
  }
  const entries = await pending;
  if (!Object.hasOwn(entries, id)) throw new Error("Unknown inline-reference identity");
  const facts = entries[id];
  const result: CodeReferenceHelp = {
    ...facts,
    name: request.label,
    source: facts.source && { ...facts.source, href: localLink(facts.source.href) },
    docs: facts.docs && { ...facts.docs, href: localLink(facts.docs.href) },
    related: facts.related?.map((link) => ({ ...link, href: localLink(link.href) })),
    sections: facts.sections?.map((section) => ({
      ...section,
      source: section.source && { ...section.source, href: localLink(section.source.href) },
      definitions: section.definitions?.map((definition) => ({
        ...definition,
        source: definition.source && {
          ...definition.source,
          href: localLink(definition.source.href),
        },
      })),
    })),
  };
  if (kind === "command") {
    const command = parseCommand(request.label);
    if (!command || command.tool !== request.module || id !== `command:${command.tool}`)
      throw new Error("Mismatched command identity");
    const manager = ["pnpm", "npm", "yarn", "bun"].includes(command.tool);
    const operation = command.operation;
    const description =
      operation &&
      ((manager && operation !== "status") || (command.tool === "git" && operation === "status")) &&
      Object.hasOwn(operations, operation)
        ? operations[operation]
        : undefined;
    result.description = description ?? facts.description;
    result.signature = request.label;
    result.detail =
      "Shown for reference only. No command is executed and no package is downloaded by this tooltip.";
    result.facts = [
      ...(operation
        ? [
            {
              label: ["npx", "pnpx", "bunx"].includes(command.tool)
                ? "Executable"
                : "Operation / script",
              value: operation,
            },
          ]
        : []),
      ...(command.workspace ? [{ label: "Workspace selector", value: command.workspace }] : []),
      ...(command.wrapped ? [{ label: "Launcher", value: "Corepack" }] : []),
    ];
  } else if (kind === "page") {
    const section = request.href.split("#")[1];
    if (section) {
      result.originLabel = "Section";
      result.facts = [{ label: "Section ID", value: section }];
    }
    result.docs = { label: section ? "Read the section" : facts.docs!.label, href: request.href };
  }
  return result;
}
