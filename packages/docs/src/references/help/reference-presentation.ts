import { rootPackageName } from "../catalog/packages";
import type { CodeReferenceHelp, CodeReferenceHelpLink } from "../types";

const owners: Record<string, string> = {
  "@kamod-ch/ui": "Core",
  "@kamod-ch/ui-motion": "UI Motion",
  "@kamod-ch/themes": "Themes",
  "@kamod-ch/openui": "OpenUI",
  "@preact/signals": "Preact",
  "lucide-preact": "Lucide",
};

const notes: Record<CodeReferenceHelp["kind"], string> = {
  component: "Compare with your installed version.",
  type: "Full definitions may include inherited fields.",
  function: "Check overloads in the full reference.",
  constant: "Runtime values may differ from declarations.",
  export: "Confirm the export in your installed package.",
  icon: "Sizing and accessible labels belong to the caller.",
  module: "Check the entrypoint before importing.",
  package: "Match the version in your lockfile.",
  file: "Repository paths may differ in your app.",
  command: "Shown as text; never executed here.",
  block: "Keep the complete copy-file list together.",
  technology: "Check the official docs for version support.",
  page: "Continue reading in its original context.",
};

function referenceOwner({ module, kind, facts }: CodeReferenceHelp) {
  if (module.startsWith("@/")) return "Local";
  if (kind === "page") return module.startsWith("/blocks") ? "Blocks" : "Docs";
  if (kind === "technology")
    return facts?.find(({ label }) => label === "Role")?.value ?? "Official";
  if (kind === "command") return module;
  if (module.startsWith(".") || module.startsWith("/")) return "Repository";
  const root = rootPackageName(module);
  if (Object.hasOwn(owners, root)) return owners[root];
  return root.startsWith("@kamod-ch/") ? root.slice("@kamod-ch/".length) : root || "Source";
}

/** Derive navigation and reading context from verified facts; never manufacture a destination. */
export function referencePresentation(reference: CodeReferenceHelp) {
  const { module, kind, docs, source, related = [], fields = [] } = reference;
  const sourceFirst =
    kind === "package" ||
    (kind === "module" && !module.startsWith("@/") && !module.startsWith("."));
  const primary = sourceFirst ? (source ?? docs) : (docs ?? source);
  const owner = referenceOwner(reference);
  const shortcuts: (CodeReferenceHelpLink & { text: string })[] = [];
  const add = (link: CodeReferenceHelpLink | undefined, text: string) => {
    if (link && link.href !== primary?.href && !shortcuts.some(({ href }) => href === link.href))
      shortcuts.push({ ...link, text });
  };
  add(sourceFirst ? docs : source, sourceFirst ? "Guide" : "Source");
  for (const link of related) {
    if (shortcuts.length === 2) break;
    add(
      link,
      link.kind === "props"
        ? "Props"
        : link.kind === "type"
          ? "Types"
          : link.kind === "source"
            ? "Repository"
            : "Guide",
    );
  }
  return {
    owner,
    primary,
    shortcuts,
    note: notes[kind],
    caption:
      reference.detail ||
      (fields.length
        ? "A focused view of declared fields. The full reference includes the surrounding contract."
        : reference.signature
          ? "Signature from the declaration; this preview does not execute code."
          : kind === "module" || kind === "package"
            ? "Use the source to inspect the entrypoint and the guide to connect it to your app."
            : undefined),
  };
}
