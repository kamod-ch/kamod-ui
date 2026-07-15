import { createPackageTeaserDoc } from "./kamod-package-doc-factory";

export const iconsDocPage = createPackageTeaserDoc({
  slug: "icons-package",
  title: "Icons",
  packagePath: "@kamod-ch/icons",
  command: "pnpm add @kamod-ch/icons preact",
  eyebrow: "kamod-icons · Typed SVG · Multiple icon sets",
  headline: "Find, copy, and ship production-ready icons faster",
  lead: "Lightweight, tree-shakeable Preact icon components across shadcn, Lucide, Heroicons, Tabler, Iconoir, and Reicon — preferred by Kamod UI blocks over lucide-preact.",
  stats: [
    { value: "16k+", label: "typed icons" },
    { value: "6", label: "icon families" },
    { value: "MIT", label: "license" },
  ],
  features: [
    {
      title: "Typed components",
      text: "Every icon is a Preact SVG component with size, class, style, title, and currentColor support.",
    },
    {
      title: "Stable subpaths",
      text: "Import from @kamod-ch/icons/shadcn, /lucide, or outline/solid variants so production builds stay explicit.",
    },
    {
      title: "Design-token friendly",
      text: "Icons inherit color via currentColor and fit cleanly into Kamod UI themes and blocks.",
    },
  ],
  quickStart: {
    import: `import { SearchIcon } from "@kamod-ch/icons/shadcn";`,
    usage: `export function Example() {\n  return <SearchIcon size={20} aria-hidden />;\n}`,
  },
  installationText:
    "Install @kamod-ch/icons with Preact as a peer dependency. There is no React runtime dependency.",
  usageText:
    "Prefer explicit set imports (for example @kamod-ch/icons/shadcn). The package root currently defaults to the shadcn set.",
  apiReferenceText:
    "This page is a Kamod UI overview. Browse every set, search icons, and copy imports from the dedicated kamod-icons docs.",
  accessibilityText:
    "Decorative icons should use aria-hidden. Meaningful icons need a title or an accessible name on the surrounding control (for example aria-label on an icon-only button).",
  externalDocsUrl: "https://kamod-ch.github.io/kamod-icons/",
  githubUrl: "https://github.com/kamod-ch/kamod-icons",
  npmUrl: "https://www.npmjs.com/package/@kamod-ch/icons",
  externalCtaTitle: "Browse the full icon catalog",
  externalCtaDescription:
    "Open the kamod-icons docs for set tables, usage guides, and a searchable icon browser.",
});
