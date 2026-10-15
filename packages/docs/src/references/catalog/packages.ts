const github = "https://github.com/kamod-ch/";

/** Verified repository owners; package names do not always match their repository names. */
export const referencePackages: Record<
  string,
  { repository: string; directory?: string; guide?: string }
> = Object.fromEntries(
  [
    ["ui", "kamod-ui", "packages/core", "/docs/components"],
    ["blocks", "kamod-ui", "packages/blocks", "/blocks"],
    ["ui-docs", "kamod-ui", "packages/docs", "/docs/getting-started"],
    ["themes", "kamod-ui", "packages/themes", "/docs/theming/installation"],
    ["typeset", "kamod-ui", "packages/typeset", "/docs/ecosystem#build-the-interface-foundation"],
    ["ui-motion", "kamod-ui", "packages/motion", "/docs/ui-motion/installation"],
    ["openui", "kamod-ui", "packages/openui", "/docs/ecosystem#explore-the-wider-toolkit"],
    ["icons", "kamod-icons", "packages/core", "/docs/icons-package/installation"],
    ["hooks", "kamod-hooks", "packages/core", "/docs/hooks-package/installation"],
    ["signals", "kamod-signals", "packages/core", "/docs/signals-package/installation"],
    ["state", "kamod-state", "packages/core", "/docs/state-package/installation"],
    ["i18n", "kamod-i18n", "packages/core", "/docs/i18n-package/installation"],
    ["motion", "kamod-motion", "packages/core", "/docs/ui-motion/installation"],
    ["charts", "kamod-charts", "packages/core", "/docs/ecosystem#explore-the-wider-toolkit"],
    ["preactpress", "preactpress", "", "/docs/getting-started"],
  ].map(([name, repository, directory, guide]) => [
    `@kamod-ch/${name}`,
    { repository: `${github}${repository}`, directory: directory || undefined, guide },
  ]),
);

/** Unambiguous product/package labels; conceptual guide names remain page references. */
export const packageLabels: Record<string, string> = {
  "kamod ui": "@kamod-ch/ui",
  "kamod icons": "@kamod-ch/icons",
  "kamod hooks": "@kamod-ch/hooks",
  "kamod signals": "@kamod-ch/signals",
  "kamod state": "@kamod-ch/state",
  "kamod i18n": "@kamod-ch/i18n",
  "kamod motion": "@kamod-ch/motion",
  "kamod charts": "@kamod-ch/charts",
  "ui motion": "@kamod-ch/ui-motion",
  typeset: "@kamod-ch/typeset",
  openui: "@kamod-ch/openui",
  formisch: "@formisch/preact",
};

export const rootPackageName = (module: string) =>
  module.startsWith("@") ? module.split("/").slice(0, 2).join("/") : module.split("/")[0];

const integrationGuides: Record<string, string> = {
  preact: "/docs/getting-started#set-up-your-app",
  "@preact/preset-vite": "/docs/getting-started#set-up-your-app",
  "@preact/signals": "/docs/theming/installation#api-reference",
  "@formisch/preact": "/docs/formisch/installation",
  clsx: "/docs/cn/installation#api-reference",
  "tailwind-merge": "/docs/cn/installation#api-reference",
  prismjs: "/docs/code/installation#code-prism-pipeline",
  tailwindcss: "/docs/theming/installation#css-setup",
  "@tailwindcss/vite": "/docs/theming/installation#css-setup",
  motion: "/docs/ui-motion/installation",
  "@openuidev/react-lang": "/docs/ecosystem#explore-the-wider-toolkit",
  valibot: "/docs/forms",
  zod: "/docs/forms",
};

/** A related local explanation, separate from the package/source navigation destination. */
export function packageGuide(module: string): string | undefined {
  const root = rootPackageName(module);
  if (["@kamod-ch/ui/utils", "@kamod-ch/ui/lib/utils"].includes(module))
    return "/docs/cn/installation#api-reference";
  if (root === "@kamod-ch/ui" && module.endsWith(".css"))
    return module === "@kamod-ch/ui/code/styles.css"
      ? "/docs/code/installation#code-css-ownership"
      : "/docs/theming/installation#css-setup";
  if (root === "@kamod-ch/themes" && module.endsWith(".css")) {
    const preset = module.match(/\/brands\/([\w-]+)\.css$/)?.[1];
    if (
      preset &&
      [
        "kamod",
        "shadcn",
        "ocean",
        "sunset",
        "cursor-warm",
        "voltage",
        "watson",
        "professional",
      ].includes(preset)
    )
      return `/docs/theming/installation#color-theme-${preset}`;
    if (module.endsWith("/brands.css")) return "/docs/theming/installation#color-theme-presets";
    if (module.endsWith("/tokens.css")) return "/docs/theming/installation#token-overrides";
    return "/docs/theming/installation#css-setup";
  }
  if (Object.hasOwn(integrationGuides, root)) return integrationGuides[root];
  return Object.hasOwn(referencePackages, root) ? referencePackages[root].guide : undefined;
}
