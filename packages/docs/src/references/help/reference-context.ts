import type { CodeReferenceHelp } from "../types";

/** Compact purpose labels for verified core entrypoints, shared by their exports and types. */
const coreContexts: Record<string, string> = Object.fromEntries(
  (
    [
      ["Expandable content", ["accordion", "collapsible"]],
      ["Status feedback", ["alert", "badge"]],
      ["Confirmation dialogs", ["alert-dialog"]],
      ["Media layout", ["aspect-ratio", "image", "video"]],
      ["Identity display", ["avatar"]],
      ["Interface actions", ["button", "button-group", "copy-button"]],
      ["Navigation trails", ["breadcrumb"]],
      ["Date selection", ["calendar", "date-picker"]],
      ["Content surfaces", ["card", "item"]],
      ["Sliding content", ["carousel"]],
      ["Data visualization", ["chart"]],
      [
        "Selection controls",
        ["checkbox", "radio-group", "selectable-card", "switch", "toggle", "toggle-group"],
      ],
      ["Source display", ["code", "type-definition"]],
      ["Searchable choices", ["combobox", "command"]],
      ["Contextual actions", ["context-menu", "dropdown", "menubar"]],
      ["Tabular data", ["data-table", "table"]],
      ["Overlay content", ["dialog", "drawer", "sheet"]],
      ["Layout direction", ["direction"]],
      ["File selection", ["dropzone"]],
      ["Empty states", ["empty"]],
      ["Form structure", ["field", "input-group", "label"]],
      ["Contextual information", ["hover-card", "popover", "tooltip"]],
      ["Text entry", ["input", "input-otp", "textarea"]],
      ["Keyboard shortcuts", ["kbd"]],
      ["Locale selection", ["locale-segment-group"]],
      ["Option selection", ["native-select", "select"]],
      ["Interface navigation", ["navigation-menu", "pagination", "sidebar", "tabs", "tree"]],
      ["Loading feedback", ["progress", "skeleton", "spinner"]],
      ["Content typography", ["prose", "typography"]],
      ["Scrollable content", ["scroll-area"]],
      ["Content separation", ["separator"]],
      ["Range selection", ["slider"]],
      ["Transient notifications", ["sonner", "toast"]],
      ["Appearance controls", ["theme-toggle"]],
      ["Class composition", ["utils"]],
    ] satisfies [string, string[]][]
  ).flatMap(([context, slugs]) => slugs.map((slug) => [slug, context])),
);

/** Use an exact known owner or short authored role; never truncate a sentence into a label. */
export function referenceContext(reference: CodeReferenceHelp, fallback: string): string {
  const { module, kind, docs, facts } = reference;
  if (module.endsWith(".css")) return "Stylesheet entrypoint";
  if (kind === "page" && docs?.href.includes("#")) return "Documentation section";
  const entry = module.match(/^(?:@\/components\/kamod-ui\/|@kamod-ch\/ui\/)([^/]+)$/)?.[1];
  if (entry && Object.hasOwn(coreContexts, entry)) return coreContexts[entry];
  if (module === "@/lib/utils") return coreContexts.utils;
  const role =
    kind === "technology" ? facts?.find(({ label }) => label === "Role")?.value : undefined;
  const words = role?.trim().split(/\s+/).length ?? 0;
  return role && words >= 1 && words <= 3 ? role : fallback;
}
