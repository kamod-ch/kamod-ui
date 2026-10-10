import { IconsGuideEnding } from "../components/package-teaser/IconsGuideEnding";
import type { DocPageModule } from "../types";
import { createPackageTeaserDoc } from "./kamod-package-doc-factory";

const resources = {
  externalDocsUrl: "https://kamod-ch.github.io/kamod-icons/",
  githubUrl: "https://github.com/kamod-ch/kamod-icons",
  npmUrl: "https://www.npmjs.com/package/@kamod-ch/icons",
};

const iconsGuide = createPackageTeaserDoc({
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
    "**Add the icons to your existing Preact app.** Install `@kamod-ch/icons` in the workspace that renders them and keep Preact available as its peer dependency. The SVG components can sit inside your existing buttons and links; choosing an icon family does not require another UI framework.\n\n**Pick the family before copying an import.** The family is a subpath of this package, such as `@kamod-ch/icons/shadcn`, rather than a separate installation. Use the [Icon Catalog](#api-reference) to find an exact exported name, then follow the [Usage Example](#usage) to check its size and alignment in context.",
  usageText:
    "**Make the chosen family visible in the import.** An explicit set path such as `@kamod-ch/icons/shadcn` keeps related controls consistent and makes later replacements easier to review. The example renders `SearchIcon` with a deliberate `size`; its `currentColor` follows the surrounding text color.\n\n**Let the control own the action.** Keep a decorative SVG hidden from assistive technology with `aria-hidden`, and give an icon-only button an `aria-label` that describes what it does. Continue with the [Search Action Example](#put-it-to-work) to connect an actual callback, then compare the finished controls using the [Integration Review](#icons-integration-review) and [Accessibility Notes](#accessibility).",
  apiReferenceText:
    "This page is a Kamod UI overview. Browse every set, search icons, and copy imports from the dedicated kamod-icons docs.",
  accessibilityText:
    "Decorative icons should use aria-hidden. Meaningful icons need a title or an accessible name on the surrounding control (for example aria-label on an icon-only button).",
  ...resources,
  externalCtaTitle: "Browse the full icon catalog",
  externalCtaDescription:
    "Open the kamod-icons docs for set tables, usage guides, and a searchable icon browser.",
});

export const iconsDocPage: DocPageModule = {
  ...iconsGuide,
  guideContents: [
    ...(iconsGuide.guideContents ?? []),
    { id: "icons-next-steps", label: "Make It Your Own" },
  ],
  renderFooter: () => <IconsGuideEnding {...resources} />,
};
