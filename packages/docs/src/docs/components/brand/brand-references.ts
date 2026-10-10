import { kamodReferenceHref } from "./kamod-references";

const reference = (href: string, description: string, linkLabel = href) => ({
  href,
  description,
  linkLabel,
});

/** Shared, icon-free metadata keeps inline links and their explanations on the same destination. */
export const brandReferences = {
  Preact: reference(
    "https://preactjs.com/",
    "The UI library Kamod uses to render components and manage their state.",
  ),
  React: reference(
    "https://react.dev/",
    "A library for building interfaces from components. Kamod components use Preact.",
  ),
  TypeScript: reference(
    "https://www.typescriptlang.org/",
    "Adds type checking to JavaScript so mismatched values can be caught before runtime.",
  ),
  Tailwind: reference(
    "https://tailwindcss.com/",
    "Builds CSS from utility class names used in your source files.",
  ),
  JavaScript: reference(
    "https://tc39.es/ecma262/",
    "The programming language used for browser interactions and application logic.",
    "Read the Language Specification",
  ),
  GitHub: reference("https://github.com/", "Hosts source repositories, issues and pull requests."),
  Git: reference(
    "https://git-scm.com/",
    "Tracks changes to files and helps teams work with branches and commits.",
  ),
  Vite: reference(
    "https://vite.dev/",
    "Provides a development server and production builds for web applications.",
  ),
  pnpm: reference(
    "https://pnpm.io/",
    "Installs packages and runs scripts, with support for multi-package workspaces.",
  ),
  npm: reference(
    "https://www.npmjs.com/",
    "A JavaScript package registry and package-management tool.",
  ),
  Yarn: reference(
    "https://yarnpkg.com/",
    "Installs dependencies and manages JavaScript project workspaces.",
  ),
  "Node.js": reference(
    "https://nodejs.org/",
    "Runs JavaScript outside the browser, including build tools and server applications.",
  ),
  "Next.js": reference(
    "https://nextjs.org/",
    "A React framework for routing, server rendering and application builds.",
  ),
  Figma: reference(
    "https://www.figma.com/",
    "A collaborative tool for interface design and prototypes.",
  ),
  Docker: reference(
    "https://www.docker.com/",
    "Packages applications and their dependencies into containers.",
  ),
};

// Keep version suffixes with the name; exclude package paths, filenames and identifiers.
export const industryBrandPattern =
  /(?<![\w@/.])(?:Tailwind(?: CSS)?|TypeScript|Preact|React|JavaScript|GitHub|Git|Vite|pnpm|npm|Yarn|Node\.js|Next\.js|Figma|Docker)(?: v?\d+(?:\.\d+)*)?(?![\w/]|\.[\w])/gi;
// Case-insensitive brand names in prose without relaxing component-name matching.
const brandNamesPattern = Object.keys(brandReferences)
  .map((name) =>
    [...name]
      .map((letter) =>
        /[a-z]/i.test(letter)
          ? `[${letter.toLowerCase()}${letter.toUpperCase()}]`
          : letter === "."
            ? "\\."
            : letter,
      )
      .join(""),
  )
  .join("|");
export const industryProsePattern = `(?<![\\w@/.])(?:${brandNamesPattern})(?: [Cc][Ss][Ss])?(?: v?\\d+(?:\\.\\d+)*)?(?![\\w/:]|\\.[\\w])`;
export type BrandName = keyof typeof brandReferences;
export function brandName(label: string): BrandName | undefined {
  if (![...label.matchAll(industryBrandPattern)].some(([match]) => match === label)) return;
  const name = label.replace(/(?: CSS)?(?: v?\d+(?:\.\d+)*)?$/i, "").toLowerCase();
  return (Object.keys(brandReferences) as BrandName[]).find((key) => key.toLowerCase() === name);
}

export function brandLabel(label: string): string {
  const name = brandName(label);
  return name ? name + label.slice(name.length).replace(/^ css/i, " CSS") : label;
}

const packages: Record<string, string> = {
  ui: "Kamod’s Preact component package. Configure its CSS before using the components.",
  blocks: "Complete Kamod layouts you can copy and connect to your application.",
  themes: "Shared theme presets and tokens for Kamod interfaces.",
  typeset: "Typography and prose styles for structured content.",
  "ui-motion": "Motion-enabled compositions built around Kamod UI components.",
  openui: "Kamod’s integration for rendering interfaces described with OpenUI.",
  icons: "Kamod’s SVG icon library, with multiple icon families and styles.",
  signals: "Persistence utilities built around Preact signals.",
  hooks: "Reusable Preact hooks for state and browser behavior.",
  state: "State-management tools for actions, reducers and stores.",
  i18n: "Translation and locale-formatting tools for applications.",
  motion: "Animation tools for Preact interfaces.",
  charts: "Visualization components for Preact.",
  preactpress: "The Preact documentation framework used by this site.",
};

/** Explain only recognized references; source links reuse the exact inline-link resolver. */
export function brandReferenceHelp(term: string) {
  const name = brandName(term);
  if (name) return brandReferences[name];
  const href = kamodReferenceHref(term);
  if (!href) return;
  const alias = term.startsWith("@/");
  const packageName = term.match(/^@kamod-ch\/([^/]+)/)?.[1] ?? "ui";
  const description = alias
    ? "A local component import. Opens the original Kamod source; your app must provide the alias and files."
    : term === "@kamod-ch/ui/utils"
      ? "The entry point for cn and its class-value type. Opens the utility’s source file."
      : href.includes("/packages/core/src/components/")
        ? "A focused Kamod component entry point. Opens its implementation and exports."
        : href.includes("/packages/core/src/")
          ? "A Kamod UI source reference. Opens the matching file or folder in the repository."
          : packages[packageName];
  return {
    description,
    path: { label: term, href },
    href,
    linkLabel: href.includes("/blob/")
      ? "View Source File on GitHub"
      : href.includes("/tree/")
        ? "Browse Source on GitHub"
        : "Open Repository on GitHub",
  };
}
