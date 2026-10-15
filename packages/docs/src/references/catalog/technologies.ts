import { brandReferences } from "../../docs/components/brand/brand-references";

type Technology = {
  name: string;
  aliases?: string[];
  href: string;
  description: string;
  category: string;
  guide?: string;
};

/** Authored product/language labels, separate from import paths and exported symbol names. */
export const technologies: Technology[] = [
  ...Object.entries(brandReferences).map(([name, value]) => ({
    name,
    ...value,
    category: ["TypeScript", "JavaScript"].includes(name) ? "Language" : "Development technology",
    aliases:
      name === "Tailwind"
        ? ["Tailwind CSS", "tailwindcss", "tailwind-css"]
        : name === "Node.js"
          ? ["Node", "nodejs"]
          : name === "Next.js"
            ? ["Nextjs"]
            : [],
    guide:
      name === "Tailwind"
        ? "/docs/theming/css-setup"
        : name === "Preact"
          ? "/docs/getting-started"
          : undefined,
  })),
  {
    name: "Valibot",
    href: "https://valibot.dev/",
    category: "Schema validation",
    description:
      "Validates unknown data against schemas and returns typed results and validation issues.",
    guide: "/docs/formisch/installation",
  },
  {
    name: "Zod",
    href: "https://zod.dev/",
    category: "Schema validation",
    description: "Defines schemas that validate data at runtime and infer TypeScript types.",
  },
  {
    name: "shadcn/ui",
    aliases: ["shadcn", "Shadcn UI"],
    href: "https://ui.shadcn.com/docs",
    category: "Component system",
    description:
      "Provides component source and conventions for building a design system. Kamod implements its own Preact components.",
    guide: "/docs/theming/installation",
  },
  {
    name: "Prism.js",
    aliases: ["Prism", "prismjs"],
    href: "https://prismjs.com/",
    category: "Syntax highlighting",
    description:
      "Tokenizes source with language grammars. CSS assigns colors to the resulting token classes.",
    guide: "/docs/code/installation#code-prism-pipeline",
  },
  {
    name: "Formisch",
    href: "https://formisch.dev/",
    category: "Form library",
    description: "Provides form state and schema-based validation with a Preact integration.",
    guide: "/docs/formisch/installation",
  },
  {
    name: "PreactPress",
    href: "https://github.com/kamod-ch/preactpress",
    category: "Documentation framework",
    description:
      "The Preact documentation framework used to build and serve this documentation site.",
  },
  {
    name: "Lucide",
    aliases: ["lucide-preact"],
    href: "https://lucide.dev/",
    category: "Icon collection",
    description: "An open SVG icon collection with consistent stroke-based shapes.",
    guide: "/docs/icons-package/installation",
  },
  {
    name: "Tabler",
    aliases: ["Tabler Icons"],
    href: "https://tabler.io/icons",
    category: "Icon collection",
    description: "A collection of SVG icons with outline and filled styles.",
    guide: "/docs/icons-package/installation",
  },
  {
    name: "Heroicons",
    href: "https://heroicons.com/",
    category: "Icon collection",
    description: "A collection of SVG interface icons with several sizes and weights.",
  },
  {
    name: "Iconoir",
    href: "https://iconoir.com/",
    category: "Icon collection",
    description: "An open SVG icon library with a consistent outline style.",
  },
  {
    name: "Reicon",
    href: "https://github.com/kamod-ch/kamod-icons",
    category: "Icon tooling",
    description:
      "An icon collection exposed through Kamod Icons’ Reicon entry points. Follow the package source for available exports.",
  },
  {
    name: "Motion",
    href: "https://motion.dev/",
    category: "Animation library",
    description:
      "Animation tools for interfaces. Check the framework-specific entry point before using an example.",
    guide: "/docs/ui-motion/installation",
  },
  {
    name: "OpenUI",
    href: "https://github.com/thesysdev/openui",
    category: "UI generation",
    description:
      "Describes interfaces with a structured UI language. Kamod’s adapter renders supported descriptions with Preact components.",
  },
  {
    name: "Preact Signals",
    aliases: ["Signals"],
    href: "https://preactjs.com/guide/v10/signals/",
    category: "Reactive state",
    description: "Reactive values that update the parts of a Preact interface that read them.",
    guide: "/docs/signals-package/installation",
  },
  {
    name: "HTML",
    href: "https://html.spec.whatwg.org/",
    category: "Web language",
    description: "Defines the elements and semantics of a web document.",
  },
  {
    name: "CSS",
    href: "https://www.w3.org/Style/CSS/",
    category: "Web language",
    description: "Styles document layout, typography, colors and interaction states.",
    guide: "/docs/theming/css-setup",
  },
  {
    name: "JSX",
    href: "https://preactjs.com/guide/v10/getting-started/",
    category: "Source syntax",
    description:
      "An XML-like syntax transformed into calls that construct UI elements. It is syntax, not a separate runtime.",
  },
  {
    name: "TSX",
    href: "https://www.typescriptlang.org/docs/handbook/jsx.html",
    category: "Source syntax",
    description:
      "TypeScript source containing JSX. Use the .tsx extension when a TypeScript file includes JSX.",
  },
  {
    name: "JSON",
    href: "https://www.json.org/",
    category: "Data format",
    description: "A text format for structured data using objects, arrays and primitive values.",
  },
  {
    name: "SVG",
    href: "https://www.w3.org/Graphics/SVG/",
    category: "Vector graphics",
    description: "A vector image format whose shapes and styling can be embedded in web documents.",
  },
  {
    name: "Markdown",
    href: "https://spec.commonmark.org/",
    category: "Document format",
    description:
      "A plain-text authoring format for headings, links, lists, code and other structured content.",
  },
  {
    name: "MDX",
    href: "https://mdxjs.com/",
    category: "Document format",
    description: "Combines Markdown content with JSX in a compiled document.",
  },
  {
    name: "DOM",
    href: "https://dom.spec.whatwg.org/",
    category: "Web platform",
    description: "The document tree and APIs used to inspect and update web documents.",
  },
  {
    name: "WAI-ARIA",
    aliases: ["ARIA"],
    href: "https://www.w3.org/WAI/ARIA/",
    category: "Accessibility standard",
    description:
      "Defines accessibility roles, states and properties for interfaces. Prefer native HTML semantics when they provide the required behavior.",
  },
  {
    name: "WCAG",
    href: "https://www.w3.org/WAI/standards-guidelines/wcag/",
    category: "Accessibility standard",
    description: "Accessibility guidelines with testable success criteria for web content.",
  },
  {
    name: "ECMAScript",
    href: "https://tc39.es/ecma262/",
    category: "Language standard",
    description: "The specification defining the JavaScript language.",
  },
  {
    name: "ESM",
    aliases: ["ES Modules"],
    href: "https://nodejs.org/api/esm.html",
    category: "Module format",
    description:
      "The standard import/export module system. Its resolution rules depend on the host runtime and build tool.",
  },
  {
    name: "CommonJS",
    aliases: ["CJS"],
    href: "https://nodejs.org/api/modules.html",
    category: "Module format",
    description:
      "Node’s require/module.exports module system, with interoperation rules for ECMAScript modules.",
  },
  {
    name: "React DOM",
    aliases: ["react-dom"],
    href: "https://react.dev/reference/react-dom",
    category: "UI renderer",
    description:
      "React’s DOM renderer. Kamod uses Preact; compatibility aliases are a separate integration choice.",
  },
  {
    name: "Bun",
    href: "https://bun.sh/docs",
    category: "JavaScript toolkit",
    description: "A JavaScript runtime and toolkit with package, script and test commands.",
  },
  {
    name: "Corepack",
    href: "https://github.com/nodejs/corepack",
    category: "Package-manager tooling",
    description:
      "Dispatches supported package managers using project configuration, including the packageManager field.",
  },
  {
    name: "Vitest",
    href: "https://vitest.dev/",
    category: "Test runner",
    description: "Runs JavaScript and TypeScript tests with Vite-based configuration.",
  },
  {
    name: "Playwright",
    href: "https://playwright.dev/",
    category: "Browser testing",
    description: "Automates browser interactions for end-to-end tests and browser checks.",
  },
  {
    name: "Testing Library",
    aliases: ["Preact Testing Library"],
    href: "https://testing-library.com/docs/preact-testing-library/intro/",
    category: "Component testing",
    description: "Tests Preact components through the DOM and user-observable behavior.",
  },
  {
    name: "Oxlint",
    href: "https://oxc.rs/docs/guide/usage/linter",
    category: "Linter",
    description: "Checks source code for configured correctness and style rules.",
  },
  {
    name: "Oxfmt",
    href: "https://oxc.rs/docs/guide/usage/formatter",
    category: "Formatter",
    description: "Formats source files according to the project’s formatter configuration.",
  },
  {
    name: "Biome",
    aliases: ["Biomejs"],
    href: "https://biomejs.dev/",
    category: "Code tooling",
    description: "Provides formatting, linting and related source-code tooling.",
  },
  {
    name: "tsup",
    href: "https://tsup.egoist.dev/",
    category: "Package build tool",
    description:
      "Bundles TypeScript libraries with configuration for package entry points and outputs.",
  },
  {
    name: "Rollup",
    href: "https://rollupjs.org/",
    category: "Module bundler",
    description: "Bundles modules into distributable application or library outputs.",
  },
  {
    name: "Rolldown",
    href: "https://rolldown.rs/",
    category: "Module bundler",
    description: "A Rust-based JavaScript bundler with a Rollup-compatible API.",
  },
  {
    name: "esbuild",
    href: "https://esbuild.github.io/",
    category: "Build tool",
    description: "Bundles and transforms JavaScript, TypeScript and related source formats.",
  },
  {
    name: "PostCSS",
    href: "https://postcss.org/",
    category: "CSS tooling",
    description: "Transforms CSS through configured plugins.",
  },
  {
    name: "Autoprefixer",
    href: "https://github.com/postcss/autoprefixer",
    category: "CSS tooling",
    description: "Adds CSS vendor prefixes using configured browser targets.",
  },
  {
    name: "ESLint",
    href: "https://eslint.org/",
    category: "Linter",
    description: "Checks JavaScript and related source through configured lint rules and plugins.",
  },
  {
    name: "Prettier",
    href: "https://prettier.io/",
    category: "Formatter",
    description: "Formats supported source and document languages with consistent layout.",
  },
  {
    name: "Astro",
    href: "https://astro.build/",
    category: "Web framework",
    description: "A web framework with component integrations and selectively interactive islands.",
  },
  {
    name: "Remix",
    href: "https://remix.run/",
    category: "Web framework",
    description:
      "A web framework; consult its documentation for the supported routing and application APIs.",
  },
  {
    name: "Svelte",
    href: "https://svelte.dev/",
    category: "UI framework",
    description: "A UI framework that compiles component source into application code.",
  },
  {
    name: "Vue",
    aliases: ["Vue.js"],
    href: "https://vuejs.org/",
    category: "UI framework",
    description: "A framework for building reactive interfaces from components.",
  },
  {
    name: "KaTeX",
    href: "https://katex.org/",
    category: "Math typesetting",
    description: "Renders mathematical notation into web content.",
  },
  {
    name: "chrono-node",
    href: "https://github.com/wanasit/chrono",
    category: "Date parsing",
    description: "Parses natural-language date expressions into structured date information.",
  },
  {
    name: "React DayPicker",
    aliases: ["react-day-picker", "DayPicker"],
    href: "https://daypicker.dev/",
    category: "Calendar library",
    description:
      "A React calendar and date-picker library. Framework compatibility must be handled by the integrating application.",
  },
  {
    name: "clsx",
    href: "https://github.com/lukeed/clsx",
    category: "Class-name utility",
    description: "Combines conditional class-name values into a class string.",
    guide: "/docs/cn/installation#api-reference",
  },
  {
    name: "tailwind-merge",
    href: "https://github.com/dcastil/tailwind-merge",
    category: "Class-name utility",
    description: "Resolves conflicts between recognized Tailwind utility classes.",
    guide: "/docs/cn/installation#api-reference",
  },
  {
    name: "Embla Carousel",
    aliases: ["Embla", "embla-carousel"],
    href: "https://www.embla-carousel.com/",
    category: "Carousel engine",
    description: "Provides the scrolling and interaction engine used by Kamod’s carousel.",
    guide: "/docs/carousel/installation",
  },
  {
    name: "embla-carousel-autoplay",
    href: "https://www.embla-carousel.com/plugins/autoplay/",
    category: "Carousel plugin",
    description:
      "Adds automatic slide advancement to an Embla carousel. Provide a clear pause strategy and respect reduced-motion preferences.",
    guide: "/docs/carousel/installation",
  },
  {
    name: "Tailwind Variants",
    aliases: ["tailwind-variants"],
    href: "https://github.com/heroui-inc/tailwind-variants",
    category: "Style variants",
    description: "Organizes Tailwind class strings into reusable component variants.",
  },
  {
    name: "TanStack",
    href: "https://tanstack.com/",
    category: "Library collection",
    description:
      "A collection of framework-focused and headless application libraries. Check the individual library and framework adapter before integrating it.",
  },
  {
    name: "TanStack Table",
    href: "https://tanstack.com/table/latest",
    category: "Table logic",
    description:
      "Provides headless table logic with framework adapters. Kamod’s current data-table example uses local Preact state.",
    guide: "/docs/data-table/installation",
  },
  {
    name: "Marked",
    aliases: ["marked.js"],
    href: "https://marked.js.org/",
    category: "Markdown parser",
    description:
      "Parses Markdown into tokens or HTML. Sanitize untrusted HTML before inserting it into a document.",
  },
  {
    name: "jsdom",
    href: "https://github.com/jsdom/jsdom",
    category: "Test environment",
    description:
      "Implements web-platform APIs in JavaScript for tools and tests; it is not a full browser.",
  },
];
