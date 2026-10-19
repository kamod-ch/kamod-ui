import { referencePackages } from "../../../references/catalog/packages.ts";

const github = "https://github.com/kamod-ch/";
// Match actual core folders, not arbitrary consumer aliases or executable expressions.
const components = new Set(
  "accordion alert alert-dialog aspect-ratio avatar badge breadcrumb button button-group calendar card carousel chart checkbox collapsible combobox command context-menu data-table date-picker dialog direction drawer dropdown dropzone empty field hover-card image input input-group input-otp item kbd label locale-segment-group menubar native-select navigation-menu pagination popover progress prose radio-group scroll-area select selectable-card separator sheet sidebar skeleton slider sonner spinner switch table tabs textarea theme-toggle toast toggle toggle-group tooltip tree type-definition typography video".split(
    " ",
  ),
);
const sourceFiles: Record<string, string> = {
  utils: "utils.ts",
  "lib/utils": "lib/utils.ts",
  "lib/interactive": "lib/interactive",
  "lib/signals": "lib/signals",
  "theme.css": "theme.css",
  "code/styles.css": "components/code/code-styles.css",
};
const coreSource = (path: string) => {
  if (components.has(path))
    return `${github}kamod-ui/tree/main/packages/core/src/components/${path}`;
  const file = Object.hasOwn(sourceFiles, path) ? sourceFiles[path] : undefined;
  return file
    ? `${github}kamod-ui/${file.endsWith(".ts") || file.endsWith(".css") ? "blob" : "tree"}/main/packages/core/src/${file}`
    : undefined;
};

/** Resolve authored package references without inventing repository names. */
export function kamodReferenceHref(text: string): string | undefined {
  const match = text.match(/^@kamod-ch\/([a-z][a-z0-9-]*)(?:\/([\w./-]+))?$/);
  if (!match || !Object.hasOwn(referencePackages, `@kamod-ch/${match[1]}`)) return undefined;
  const [, name, path] = match;
  if (path?.split("/").some((segment) => segment === ".." || segment === ".")) return undefined;
  const origin = referencePackages[`@kamod-ch/${name}`];
  return (
    (name === "ui" && path ? coreSource(path) : undefined) ??
    (origin.directory ? `${origin.repository}/tree/main/${origin.directory}` : origin.repository)
  );
}

export const kamodReferencePattern =
  /(?<![\w@/])@kamod-ch\/[a-z][a-z0-9-]*(?:\/[\w/-]+(?:\.[\w-]+)*)*(?![\w/-])/g;

/** Icon recognition is deliberately broader than safe repository-link resolution. */
export const hasKamodNamespace = (text: string) => /kamod-ch/i.test(text);
