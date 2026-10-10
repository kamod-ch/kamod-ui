const github = "https://github.com/kamod-ch/";
const repositories: Record<string, string> = {
  ui: "kamod-ui",
  blocks: "kamod-ui",
  themes: "kamod-ui",
  typeset: "kamod-ui",
  "ui-motion": "kamod-ui",
  openui: "kamod-ui",
  icons: "kamod-icons",
  signals: "kamod-signals",
  hooks: "kamod-hooks",
  state: "kamod-state",
  i18n: "kamod-i18n",
  motion: "kamod-motion",
  charts: "kamod-charts",
  preactpress: "preactpress",
};
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
};
const coreSource = (path: string) => {
  if (components.has(path))
    return `${github}kamod-ui/tree/main/packages/core/src/components/${path}`;
  const file = Object.hasOwn(sourceFiles, path) ? sourceFiles[path] : undefined;
  return file
    ? `${github}kamod-ui/${file.endsWith(".ts") || file.endsWith(".css") ? "blob" : "tree"}/main/packages/core/src/${file}`
    : undefined;
};

/** Resolve authored package references and known local aliases without inventing repository names. */
export function kamodReferenceHref(text: string): string | undefined {
  const alias = text.match(/^@\/components\/kamod-ui\/(.+)$/)?.[1];
  if (alias)
    return alias === "…"
      ? `${github}kamod-ui/tree/main/packages/core/src/components`
      : coreSource(alias);
  const match = text.match(/^@kamod-ch\/([a-z][a-z0-9-]*)(?:\/([\w./-]+))?$/);
  if (!match || !Object.hasOwn(repositories, match[1])) return undefined;
  const [, name, path] = match;
  if (path?.split("/").some((segment) => segment === ".." || segment === ".")) return undefined;
  return (name === "ui" && path ? coreSource(path) : undefined) ?? `${github}${repositories[name]}`;
}

export const kamodReferencePattern =
  /(?<![\w@/])(?:@kamod-ch\/[a-z][a-z0-9-]*(?:\/[\w/-]+(?:\.[\w-]+)*)*|@\/components\/kamod-ui\/(?:[a-z][a-z-]*|…))(?![\w/-])/g;

/** Icon recognition is deliberately broader than safe repository-link resolution. */
export const hasKamodNamespace = (text: string) => /kamod-ch/i.test(text);
