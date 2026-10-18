import { basePrefix, withBasePath } from "../../base-path";
import type { CodeReferenceHelp } from "../types";
import { referenceContext } from "./reference-context";

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

/** Short context is authored metadata, never a truncated fragment of a source description. */
const contexts: Record<CodeReferenceHelp["kind"], [string, string]> = {
  component: [
    "Interface component",
    "Compose it with its **props and children**; the full reference covers supported options and examples.",
  ],
  type: [
    "Type contract",
    "Use the complete definition to check **required fields**, unions and inherited members before adapting it.",
  ],
  function: [
    "Reusable logic",
    "Check the full signature for **arguments, return values and overloads** before calling it.",
  ],
  constant: [
    "Shared value",
    "Inspect the source for the actual value and how it is exported; a declaration describes its type.",
  ],
  export: [
    "Module export",
    "Confirm the named export and its supported contract in the linked source before using it.",
  ],
  icon: [
    "Interface icon",
    "Import the symbol from its documented icon family. Set size and an accessible label in the surrounding control.",
  ],
  module: [
    "Import entrypoint",
    "Use the source to inspect its exports and the related guide to connect the entrypoint to your app.",
  ],
  package: [
    "Package dependency",
    "Check its exports and dependency requirements in the source, then follow the local guide for integration.",
  ],
  file: [
    "Source implementation",
    "Read the surrounding imports and supporting definitions before copying or adapting this file.",
  ],
  command: [
    "Terminal invocation",
    "The working directory, workspace flags and installed tool version determine how this command behaves.",
  ],
  block: [
    "Interface composition",
    "Start with the complete source-file list, then connect its navigation, state and content to your application.",
  ],
  technology: [
    "Development tool",
    "Follow the official documentation for setup and supported APIs; related reading shows its place in Kamod.",
  ],
  page: [
    "Documentation page",
    "Open the original page for the complete examples and surrounding sections; this card is a short reading preview.",
  ],
};

/** Derive navigation and reading context from verified facts; never manufacture a destination. */
export function referencePresentation(reference: CodeReferenceHelp) {
  const { module, kind, docs, source, related = [], fields = [] } = reference;
  const sourceFirst =
    kind === "package" ||
    (kind === "module" && !module.startsWith("@/") && !module.startsWith("."));
  const primary = sourceFirst ? (source ?? docs) : (docs ?? source);
  const secondary = sourceFirst ? docs : source;
  const page = kind === "page" && primary ? pageDestination(module, primary.href) : undefined;
  const reading: NonNullable<CodeReferenceHelp["related"]> = [];
  for (const link of [
    ...(secondary
      ? [{ ...secondary, kind: sourceFirst ? ("guide" as const) : ("source" as const) }]
      : []),
    ...related,
  ]) {
    if (link.href !== primary?.href && !reading.some(({ href }) => href === link.href))
      reading.push(link);
  }
  const resources: NonNullable<CodeReferenceHelp["related"]> = primary
    ? [{ ...primary, kind: primary === source ? "source" : "guide" }]
    : [];
  for (const link of reading) {
    if (!resources.some(({ href }) => href === link.href)) resources.push(link);
  }
  if (page?.parentHref && !resources.some(({ href }) => href === page.parentHref))
    resources.push({ label: "Full page", href: page.parentHref, kind: "guide" });
  for (const section of reference.sections ?? []) {
    const { source } = section;
    if (source && !resources.some(({ href }) => href === source.href))
      resources.push({
        ...source,
        kind: source.href.includes("github.com/") ? "source" : "guide",
      });
    for (const { source } of section.excerpts ?? [])
      if (source && !resources.some(({ href }) => href === source.href))
        resources.push({
          ...source,
          kind: source.href.includes("github.com/") ? "source" : "guide",
        });
    for (const { name, source } of section.definitions ?? [])
      if (source && !resources.some(({ href }) => href === source.href))
        resources.push({ ...source, label: name, kind: "type" });
  }
  const [fallback, detail] = contexts[kind];
  return {
    primary,
    page,
    location: primary ? referenceLocation(reference, primary.href) : undefined,
    context: referenceContext(reference, fallback),
    reading,
    resources,
    note: notes[kind],
    caption:
      reference.detail ||
      (kind === "component" && reference.sections?.some((section) => section.fields?.length)
        ? "Documented options and source declarations, kept together. Follow the full sections for additional rows, inherited contracts and examples."
        : fields.length
          ? "A focused view of declared fields. Follow the linked types for the complete contract, inherited members and supporting definitions."
          : reference.signature
            ? "Signature from the declaration; this preview does not execute code. Open the full definition for overloads and surrounding types."
            : detail),
  };
}

/** Both hash links and indexed section redirects retain their verified owning page. */
function pageDestination(module: string, href: string) {
  if (!module.startsWith("/")) return;
  const parent = module.startsWith(`${basePrefix()}/`) ? module : withBasePath(module);
  const url = new URL(href, "https://reference.local");
  const canonical = new URL(parent, url);
  const section =
    !!url.hash || url.pathname.replace(/\/$/, "") !== canonical.pathname.replace(/\/$/, "");
  return {
    href,
    label: section ? "Section" : "Page",
    path: `${url.pathname}${url.search}`,
    anchor: url.hash,
    parentHref: section ? parent : undefined,
  };
}

/** Pick a fact specific to this reference, without another badge or repeated destination. */
function referenceLocation(reference: CodeReferenceHelp, href: string) {
  const url = new URL(href, "https://reference.local");
  const version = reference.facts?.find(({ label }) => /version|license/i.test(label));
  const required = reference.fields?.filter(({ required }) => required).map(({ name }) => name);
  const branch =
    url.hostname === "github.com" && /\/(?:blob|tree)\/([^/]+)/.exec(url.pathname)?.[1];
  const detail = version
    ? `${version.label}: ${version.value}`
    : required?.length
      ? `Required: ${required.slice(0, 2).join(", ")}${required.length > 2 ? "…" : ""}`
      : branch
        ? `${branch} branch`
        : reference.sections?.length
          ? `${reference.sections.length} reference chapters`
          : url.hash
            ? "Section permalink"
            : url.origin === "https://reference.local"
              ? "Local documentation"
              : "External reference";
  return { detail };
}
