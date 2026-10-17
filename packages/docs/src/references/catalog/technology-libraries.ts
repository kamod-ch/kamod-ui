import { technologySection as section, type TechnologySections } from "./technology-section-data";

/** Specific integration contracts for the libraries named by the guides and package manifests. */
export const librarySections: TechnologySections = {
  Valibot: [
    section(
      "Install from npm",
      "Add `valibot` with your project's package manager. Named imports and namespace imports both support tree shaking; choose the style that keeps your schemas readable.",
      {
        detail: "Choose one command",
        href: "https://valibot.dev/guides/installation/#from-npm",
        excerpts: [
          {
            title: "Your package manager",
            code: {
              language: "bash",
              value:
                "npm install valibot  # npm\nyarn add valibot     # Yarn\npnpm add valibot     # pnpm\nbun add valibot      # Bun",
            },
          },
          {
            title: "Import in JavaScript or TypeScript",
            code: {
              language: "typescript",
              value:
                'import * as v from "valibot";\n// Or import the functions you use:\nimport { object, string } from "valibot";',
            },
          },
        ],
        note: "Enable TypeScript `strict` mode for correct inference. Published files use ES2020 syntax.",
      },
    ),
    section(
      "Basic concept",
      "Small schema functions describe primitives and objects. Unlike a TypeScript type, a schema also runs against unknown data; a pipeline adds checks or transformations in order.",
      {
        detail: "Types & runtime checks",
        href: "https://valibot.dev/guides/quick-start/#basic-concept",
        code: [
          "typescript",
          'import * as v from "valibot";\n\n// A type is checked during development.\ntype Account = { email: string; password: string };\n// A schema also validates values at runtime.\nconst AccountSchema = v.object({\n  email: v.string(),\n  password: v.string(),\n});',
          "TypeScript type → executable schema",
        ],
        note: "Start a `pipe` with a schema, then compose validation or transformation actions.",
      },
    ),
    section(
      "A login schema",
      "Validate an email and a minimum password length, then infer the output type from that schema. `safeParse` returns a result you can handle without catching an exception.",
      {
        detail: "Validate · infer · handle issues",
        href: "https://valibot.dev/guides/introduction/#example",
        excerpts: [
          {
            title: "Define the accepted input",
            code: {
              language: "typescript",
              caption: "schema.ts",
              value:
                'import * as v from "valibot";\n\nconst LoginSchema = v.object({\n  email: v.pipe(v.string(), v.email()),\n  password: v.pipe(v.string(), v.minLength(8)),\n});\ntype LoginData = v.InferOutput<typeof LoginSchema>;',
            },
          },
          {
            title: "Read the validation result",
            code: {
              language: "typescript",
              value:
                'const result = v.safeParse(LoginSchema, {\n  email: "jane@example.com", password: "12345678",\n});\nif (result.success) {\n  console.log(result.output); // Typed LoginData\n} else {\n  console.log(result.issues); // Validation feedback\n}',
            },
          },
        ],
        note: "Use `parse` when you want invalid input to throw. Validate again at your service boundary.",
      },
    ),
  ],
  Zod: [
    section(
      "Validate a structured value",
      "A schema describes accepted data and returns a typed result after validation. Use a non-throwing result when invalid input is an expected user interaction.",
      {
        code: [
          "typescript",
          'import { z } from "zod";\nconst Label = z.string().min(1);\nconst result = Label.safeParse(input);\nif (result.success) save(result.data);',
        ],
      },
    ),
    section(
      "Keep schema ownership clear",
      "Kamod's OpenUI adapter declares Zod compatibility in its package metadata. The form guide uses Valibot; adding a second schema should solve a real integration need.",
      {
        rows: [
          ["OpenUI package", "Zod peer dependency"],
          ["Form guide", "Valibot schemas"],
          ["Validation boundary", "Unknown data entering a typed application"],
        ],
        note: "Read the installed peer range before reusing examples written for a different Zod major version.",
      },
    ),
  ],
  "shadcn/ui": [
    section(
      "Adopt editable source",
      "The shadcn approach exposes component code for a project's design system. Kamod follows that source-oriented idea with its own **Preact-native implementations**.",
      {
        rows: [
          ["Shared idea", "Composable primitives and semantic tokens"],
          ["Kamod runtime", "Preact"],
          ["Source ownership", "The copied or installed component implementation"],
        ],
        href: "/docs/getting-started",
      },
    ),
    section(
      "Port the behavior deliberately",
      "A React-oriented example may import React, Radix or framework-specific helpers. Reuse the existing Kamod equivalents instead of pasting a second interaction stack into a Preact block.",
      {
        code: [
          "tsx",
          'import { Button } from "@kamod-ch/ui/button";\n// Compose the existing Kamod primitive.\n<Button variant="outline">Continue</Button>',
        ],
        href: "/docs/components",
        note: "Matching CSS variables makes themes portable; it does not make renderer-specific component code interchangeable.",
      },
    ),
  ],
  "Prism.js": [
    section(
      "Tokenize then style",
      "A grammar identifies tokens such as strings, keywords and comments. CSS gives those token classes their colors; grammar loading and theme styling are separate steps.",
      {
        rows: [
          ["Input", "Literal source plus a language identifier"],
          ["Grammar", "Token structure"],
          ["Presentation", "The shared code theme"],
        ],
        href: "/docs/code/installation#code-prism-pipeline",
      },
    ),
    section(
      "Keep failure readable",
      "Load optional grammars when a reader needs them and preserve the literal source while loading or after a failed request. Syntax color must never be a prerequisite for copying the code.",
      {
        rows: [
          ["Pending", "A bounded loading treatment over literal text"],
          ["Loaded", "Highlighted token markup"],
          ["Unavailable", "Readable unformatted source"],
        ],
        href: "/docs/code/installation#code-prism-pipeline",
        note: "Reuse shared grammar promises rather than fetching one grammar for every token or line.",
      },
    ),
  ],
  Formisch: [
    section(
      "Create one form store",
      "Pass the Valibot schema and initial input to `useForm`. The guide validates on submit, then revalidates edited input after that first attempt.",
      {
        code: [
          "tsx",
          'const form = useForm({\n  schema: Schema,\n  initialInput: { title: "", description: "" },\n  validate: "submit",\n  revalidate: "input",\n});',
          "From the bug-report example",
        ],
        href: "/docs/formisch/installation#demo",
      },
    ),
    section(
      "Bridge custom controls",
      "Native inputs receive the field props. Composite controls explicitly pass their current input and forward the value callback so form state remains the single owner.",
      {
        code: [
          "tsx",
          '<Select\n  value={typeof field.input.value === "string" ? field.input.value : ""}\n  onValueChange={field.onChange}\n>\n  {/* Trigger and items */}\n</Select>',
        ],
        href: "/docs/formisch/installation#select",
        note: "Keep label, description and error associations connected when changing the surrounding layout.",
      },
    ),
  ],
  PreactPress: [
    section(
      "Build the documentation shell",
      "PreactPress connects site configuration, routes and a Preact theme. This checkout adds build plugins for component contracts, block downloads and lazy reference data.",
      {
        rows: [
          ["Site configuration", "packages/docs/.preactpress/config.ts"],
          ["Theme entry", "packages/docs/.preactpress/theme/Layout.tsx"],
          ["Page source", "packages/docs/src/docs"],
        ],
      },
    ),
    section(
      "Keep page payloads focused",
      "Extract metadata at build time instead of importing every page's interactive example into shared navigation or a tooltip. Runtime code should load the selected detail when it is needed.",
      {
        rows: [
          ["Eager", "Reference identities and destinations"],
          ["Lazy", "Descriptions, examples and contracts"],
          ["Build-only", "Source extraction and compiler APIs"],
        ],
        note: "A documentation reference should not mount the complete page or its live demos inside a tooltip.",
      },
    ),
  ],
  Lucide: [
    section(
      "Choose a verified export",
      "Lucide provides stroke-based interface icons. New Kamod code can use the matching names exposed by the installed Kamod Icons Lucide entry point.",
      {
        code: [
          "tsx",
          'import { LinkIcon } from "@kamod-ch/icons/lucide";\n<LinkIcon size={14} strokeWidth={2} aria-hidden="true" />',
        ],
        href: "/docs/icons-package/installation",
      },
    ),
    section(
      "Keep the icon subordinate",
      "Use one consistent size and stroke weight for a control family. The action's accessible name belongs to its button or link, while the decorative icon inherits its color.",
      {
        rows: [
          ["Paint", "currentColor"],
          ["Weight", "Consistent strokeWidth"],
          ["Accessibility", "Label the action; hide decorative SVG"],
        ],
      },
    ),
  ],
  Tabler: [
    section(
      "Select the right family",
      "Kamod Icons exposes Tabler outline and filled collections through separate package entry points. Brand marks and interface strokes have different visual weights.",
      {
        code: ["typescript", 'import { BrandGithubIcon } from "@kamod-ch/icons/tabler/filled";'],
        href: "/docs/icons-package/installation",
        rows: [
          ["Outline", "Stroke-oriented collection"],
          ["Filled", "Solid and brand-oriented shapes"],
        ],
      },
    ),
    section(
      "Balance mixed icon styles",
      "When a brand mark sits beside outline controls, size it by its visible shape and retain the same alignment box. Avoid adding a stroke that changes a filled logo's geometry.",
      {
        rows: [
          ["Control box", "Consistent dimensions"],
          ["Visible mark", "Adjusted optical size when needed"],
          ["Meaning", "A nearby label or accessible name"],
        ],
        note: "Verify the actual installed export; icon naming is not identical across collections.",
      },
    ),
  ],
  Heroicons: [
    section(
      "Pick a deliberate weight",
      "Heroicons supplies interface symbols in several sizes and styles. Choose the supported Kamod Icons entry point before importing an individual name.",
      {
        rows: [
          ["Collection", "Heroicons"],
          ["Outline entry", "@kamod-ch/icons/heroicons/outline"],
          ["Solid entry", "@kamod-ch/icons/heroicons/solid"],
        ],
        href: "/docs/icons-package/installation",
      },
    ),
    section(
      "Match the control scale",
      "A small icon-only action needs a readable shape within a consistent interaction target. Do not shrink the click target merely to match the painted symbol.",
      {
        rows: [
          ["Target", "The button or link box"],
          ["Symbol", "Its visible SVG size"],
          ["Label", "The purpose of the action"],
        ],
        note: "Use a coherent collection within the same control group unless a brand logo requires a different source.",
      },
    ),
  ],
  Iconoir: [
    section(
      "Use outline shapes consistently",
      "Iconoir is an outline SVG collection. Match line weight, dimensions and optical alignment to the surrounding Kamod controls.",
      {
        rows: [
          ["Collection", "Iconoir"],
          ["Regular entry", "@kamod-ch/icons/iconoir/regular"],
          ["Solid entry", "@kamod-ch/icons/iconoir/solid"],
        ],
        href: "/docs/icons-package/installation",
      },
    ),
    section(
      "Separate symbol and action",
      "The same symbol can mean different actions in different contexts. Name the control for what it does and provide a tooltip only when it adds useful clarification.",
      {
        rows: [
          ["Accessible name", "Open documentation, rather than icon name"],
          ["Decorative SVG", "aria-hidden"],
          ["Tooltip", "Destination and useful resource context"],
        ],
      },
    ),
  ],
  Reicon: [
    section(
      "Inspect the published set",
      "Kamod Icons exposes Reicon entry points alongside other collections. Read the installed package's export map to identify the available set and individual symbol names.",
      {
        rows: [
          ["Package", "@kamod-ch/icons"],
          ["Collection", "Reicon"],
          ["Reference", "Published exports and source"],
        ],
        href: "/docs/icons-package/installation",
      },
    ),
    section(
      "Avoid renderer assumptions",
      "An upstream icon name or React wrapper is not automatically a Kamod export. Use the Preact component supplied by the installed collection and preserve its SVG attributes.",
      {
        rows: [
          ["Renderer", "Preact icon component"],
          ["Color", "Inherited from the surrounding control"],
          ["Semantics", "Provided by the button, link or graphic label"],
        ],
      },
    ),
  ],
  Motion: [
    section(
      "Choose the Preact integration",
      "Kamod's motion package supplies Preact-oriented animation primitives; `@kamod-ch/ui-motion` adds compositions around existing UI behavior.",
      {
        rows: [
          ["Primitives", "@kamod-ch/motion"],
          ["UI compositions", "@kamod-ch/ui-motion"],
          ["Base behavior", "@kamod-ch/ui"],
        ],
        href: "/docs/ui-motion/installation",
      },
    ),
    section(
      "Give animation one owner",
      "Keep interaction state in the base primitive and motion in the matching content composition. The guide warns against combining CSS animation classes and motion presets on the same node.",
      {
        rows: [
          ["Dialog trigger and state", "Base UI components"],
          ["Animated content", "Matching motion composition"],
          ["Reduced motion", "A deliberate quieter or static state"],
        ],
        href: "/docs/ui-motion/installation",
        note: "Animations should stop with their owning view and should not hide the final content when motion is reduced.",
      },
    ),
  ],
  OpenUI: [
    section(
      "Render a structured description",
      "Kamod's adapter connects supported OpenUI descriptions to registered Preact components. The component registry is the boundary between generated structure and executable UI.",
      {
        rows: [
          ["Input", "Supported structured UI description"],
          ["Registry", "Known component names and contracts"],
          ["Output", "Preact-rendered Kamod components"],
        ],
      },
    ),
    section(
      "Keep execution controlled",
      "Generated interface data should select supported components and validated props. Application code remains responsible for event handling, service access and permission-sensitive actions.",
      {
        rows: [
          ["Validate", "Names, props and allowed data shapes"],
          ["Bind", "Explicit application callbacks"],
          ["Reject", "Unsupported components or arbitrary code"],
        ],
        note: "A rendered description does not authorize an action or make untrusted content safe.",
      },
    ),
  ],
  "Preact Signals": [
    section(
      "Model a reactive value",
      "Signals hold values that readers can observe. A computed value derives from other signals so a component does not need a second, manually synchronized copy.",
      {
        code: [
          "typescript",
          'import { computed, signal } from "@preact/signals";\nconst count = signal(0);\nconst doubled = computed(() => count.value * 2);',
        ],
        href: "/docs/signals-package/installation",
      },
    ),
    section(
      "Separate reactivity and storage",
      "The Preact signal primitive models reactive state. Kamod Signals adds explicit persistence choices such as browser storage; choose one owner for each state value.",
      {
        rows: [
          ["Reactive state", "@preact/signals"],
          ["Persistence helpers", "@kamod-ch/signals"],
          ["Server rendering", "Avoid sharing request-specific mutable state"],
        ],
        href: "/docs/signals-package/installation",
        note: "A subscription or effect created outside a component still needs a deliberate disposal lifetime.",
      },
    ),
  ],
  KaTeX: [
    section(
      "Render mathematical notation",
      "KaTeX converts supported mathematical source into web markup. Inline formulas and display formulas serve different layout roles.",
      {
        rows: [
          ["Inline", "A formula within a sentence"],
          ["Display", "A separate mathematical block"],
          ["Presentation", "The required KaTeX stylesheet and output markup"],
        ],
        href: "https://katex.org/docs/options",
      },
    ),
    section(
      "Handle invalid expressions",
      "Unsupported commands or invalid notation need a readable failure state. Choose deliberate error handling instead of allowing one formula to fail an entire document render.",
      {
        rows: [
          ["Default failure", "A parse error can be thrown"],
          ["Alternative", "Configure non-throwing error presentation"],
          ["Content policy", "Control trusted commands and external links"],
        ],
        href: "https://katex.org/docs/error",
        note: "Typesetting support and safe handling of untrusted author input are separate decisions.",
      },
    ),
  ],
  "chrono-node": [
    section(
      "Parse a human date",
      "The date-picker example uses `parseDate` with a reference date and a forward-date preference. Parsing is separate from how the resulting date is displayed or saved.",
      {
        code: [
          "typescript",
          'import { parseDate } from "chrono-node";\nconst parsed = parseDate(value, referenceDate, { forwardDate: true });',
        ],
        href: "/docs/date-picker/installation",
      },
    ),
    section(
      "Keep ambiguity visible",
      "Relative phrases depend on the reference date and parsing context. Show the resolved date before committing a consequential change and handle an unrecognized phrase explicitly.",
      {
        rows: [
          ["Input", "Human-readable date phrase"],
          ["Context", "Reference date and parser options"],
          ["Output", "A resolved date or no result"],
        ],
        note: "A parsed Date does not by itself establish the user's intended time zone or business deadline.",
      },
    ),
  ],
  "React DayPicker": [
    section(
      "Distinguish example and dependency",
      "React DayPicker is a calendar library with its own renderer integration. Kamod's calendar documentation is not evidence that the core component depends on that package.",
      {
        rows: [
          ["Upstream library", "React DayPicker"],
          ["Kamod implementation", "Inspect the calendar source"],
          ["Integration", "Check the actual application's dependencies"],
        ],
        href: "/docs/calendar/installation",
      },
    ),
    section(
      "Preserve date interaction",
      "When adapting a calendar example, verify focus movement, disabled dates, selection mode and locale behavior. Matching its visual grid does not reproduce those contracts.",
      {
        rows: [
          ["Selection", "Single date, range or multiple values"],
          ["Keyboard", "A reachable and predictable focused date"],
          ["Locale", "Week start, labels and formatted output"],
        ],
        note: "Choose a native Preact implementation or a deliberately tested compatibility boundary.",
      },
    ),
  ],
  clsx: [
    section(
      "Assemble conditional classes",
      "clsx collects strings and conditional values into a class string. It decides which classes are present; it does not resolve competing Tailwind utilities.",
      {
        code: [
          "typescript",
          'clsx("inline-flex", active && "font-semibold", { "opacity-50": disabled });',
        ],
        href: "/docs/cn/installation#api-reference",
      },
    ),
    section(
      "Use the shared composition",
      "Kamod's `cn` utility feeds conditional class assembly into Tailwind conflict resolution. Consumers can override a default without duplicating this two-stage behavior.",
      {
        code: [
          "typescript",
          'import { clsx } from "clsx";\nimport { twMerge } from "tailwind-merge";\nreturn twMerge(clsx(inputs));',
          "The two-stage cn pipeline",
        ],
        href: "/docs/cn/installation#api-reference",
        note: "A class string still needs complete utility names discoverable by the CSS build.",
      },
    ),
  ],
  "tailwind-merge": [
    section(
      "Resolve utility conflicts",
      "Tailwind Merge removes recognized conflicting utility classes according to its class-group rules. It operates on class names rather than computed browser styles.",
      {
        code: [
          "typescript",
          'twMerge("px-2 py-1", "px-4");\n// Keeps the later horizontal padding and the vertical padding.',
        ],
        href: "/docs/cn/installation#api-reference",
      },
    ),
    section(
      "Keep configuration compatible",
      "Use the version and configuration matched to the project's Tailwind vocabulary. Custom utilities and variants may need explicit support rather than being recognized automatically.",
      {
        rows: [
          ["Input", "A class string assembled by clsx"],
          ["Resolution", "Known utility conflict groups"],
          ["Output", "The resulting class string"],
        ],
        href: "/docs/cn/installation#api-reference",
        note: "It does not inspect stylesheets, evaluate selectors or guarantee a particular computed visual result.",
      },
    ),
  ],
  "Embla Carousel": [
    section(
      "Separate engine and layout",
      "Embla supplies the scrolling engine while Kamod provides the component composition. The viewport, track and slides each retain their structural role.",
      {
        rows: [
          ["Viewport", "Visible scroll area"],
          ["Track", "Container holding slides"],
          ["Controls", "Previous, next and selection feedback"],
        ],
        href: "/docs/carousel/installation",
      },
    ),
    section(
      "Dispose engine subscriptions",
      "Selection listeners and engine state belong to the mounted carousel. Detach subscribed callbacks when replacing the engine or unmounting the owning component.",
      {
        rows: [
          ["Subscribe", "Listen to the active engine"],
          ["Update", "Read the selected slide and control availability"],
          ["Cleanup", "Remove listeners and destroy the owned instance"],
        ],
        note: "Slide count and width affect available movement; test controls at both ends rather than assuming they always scroll.",
      },
    ),
  ],
  "embla-carousel-autoplay": [
    section(
      "Make motion optional",
      "The autoplay plugin advances slides automatically. A pause control lets someone stop the movement without losing access to manual navigation.",
      {
        rows: [
          ["Engine", "Embla Carousel"],
          ["Enhancement", "Automatic slide advancement"],
          ["User control", "Pause and resume"],
        ],
        href: "/docs/carousel/installation",
      },
    ),
    section(
      "Stop when appropriate",
      "Coordinate autoplay with user interaction, hidden content and reduced-motion preferences. The timer should not continue consuming resources after its carousel is disposed.",
      {
        rows: [
          ["Interaction", "A deliberate pause or stop policy"],
          ["Reduced motion", "Prefer a quiet or stopped initial state"],
          ["Lifecycle", "Dispose with the owning carousel"],
        ],
        note: "Autoplay must remain an enhancement; every slide should still be reachable without waiting.",
      },
    ),
  ],
  "Tailwind Variants": [
    section(
      "Define a variant contract",
      "A variant recipe groups base classes and named choices. Components can expose semantic options instead of scattering repeated utility strings through every caller.",
      {
        rows: [
          ["Base", "Classes shared by every variant"],
          ["Variants", "Named dimensions such as size or intent"],
          ["Defaults", "The selected option when omitted"],
        ],
      },
    ),
    section(
      "Keep API and style aligned",
      "Document which variant names are public and what they change. Forward a consumer class deliberately and keep disabled, focus and responsive behavior in the same recipe.",
      {
        code: [
          "tsx",
          '<Button variant="outline" size="sm">Continue</Button>',
          "A semantic component-facing contract",
        ],
        href: "/docs/button/installation",
        note: "Read the component's actual prop type; a style recipe does not make arbitrary variant names valid.",
      },
    ),
  ],
  TanStack: [
    section(
      "Choose the individual library",
      "TanStack is a family of libraries, not one installable behavior. Table, Query, Router and other products solve different problems and have separate integration contracts.",
      {
        rows: [
          ["Product", "The specific capability required"],
          ["Adapter", "The supported UI framework integration"],
          ["Version", "The installed package's public API"],
        ],
      },
    ),
    section(
      "Keep state ownership explicit",
      "Adopting a headless library should replace a defined responsibility rather than duplicate it. Decide which layer owns data fetching, pagination or table state before connecting the UI.",
      {
        rows: [
          ["Application", "Domain data and service boundaries"],
          ["Headless library", "Its selected state or computation model"],
          ["Kamod", "Presentation and interaction primitives"],
        ],
        note: "A React example is not the default integration contract for a Preact application.",
      },
    ),
  ],
  "TanStack Table": [
    section(
      "Separate table logic and markup",
      "Headless table logic computes a row model while the application renders accessible table elements. Sorting and pagination state must be connected to the chosen data owner.",
      {
        rows: [
          ["Data", "Records with stable identities"],
          ["Columns", "Accessors, labels and cell presentation"],
          ["Rendering", "Table markup and interaction controls"],
        ],
        href: "https://tanstack.com/table/latest/docs/framework/preact/quick-start",
      },
    ),
    section(
      "Read this example's implementation",
      "Kamod's current data-table example uses local Preact state. Its appearance is not a claim that TanStack Table is installed or required for the primitive.",
      {
        rows: [
          ["Kamod table", "Presentation components"],
          ["Current demo", "Local sorting, filtering and pagination state"],
          ["Alternative integration", "A separately selected table adapter"],
        ],
        href: "/docs/data-table/installation",
        note: "Use the adapter and API documented for the version installed by the consuming application.",
      },
    ),
  ],
  Marked: [
    section(
      "Parse the authoring format",
      "Marked turns Markdown source into tokens or HTML. Parsing gives the document structure; the application chooses the rendering and trust policy.",
      {
        rows: [
          ["Source", "Markdown text"],
          ["Parser result", "Tokens or HTML"],
          ["Presentation", "Project typography and code components"],
        ],
      },
    ),
    section(
      "Keep HTML trust separate",
      "Do not insert arbitrary parsed HTML into the page without sanitizing or otherwise enforcing the application's content policy. Link destinations and raw HTML need their own checks.",
      {
        rows: [
          ["Parsing", "Recognize Markdown syntax"],
          ["Sanitizing", "Remove disallowed HTML and attributes"],
          ["Link policy", "Allow supported destinations only"],
        ],
        note: "A Markdown parser is not an HTML sanitizer.",
      },
    ),
  ],
  Blobatar: [
    section(
      "Keep generated identity stable",
      "The optional SmartAvatar recipe derives a repeatable generated fallback from a stable name or user identifier. Core Avatar remains the underlying primitive.",
      {
        code: ["tsx", '<SmartAvatar name="stable-user-id" />', "Optional documentation recipe"],
        href: "/docs/avatar/installation#smartavatar-recipe",
        rows: [
          ["Dependencies", "blobatar and @blobatar/preact"],
          ["Ownership", "A separately copied docs recipe"],
        ],
      },
    ),
    section(
      "Opt into motion deliberately",
      "The guide imports Blobatar motion styles only for animated fallbacks. Static avatars and ordinary remote photos do not need that animation layer.",
      {
        code: ["css", '@import "blobatar/motion.css";'],
        href: "/docs/avatar/installation#smartavatar-recipe",
        note: "Verify missing, failed and slow image states; a fallback should not change a user's visual identity on every render.",
      },
    ),
  ],
  fflate: [
    section(
      "Build an archive from source",
      "Documentation download scripts encode each source file and construct a ZIP archive at build time. The browser receives the generated artifact rather than running the archive builder.",
      {
        code: [
          "javascript",
          'import { strToU8, zipSync } from "fflate";\nconst archive = zipSync({ "example.ts": strToU8(source) });',
        ],
        rows: [
          ["Encoding", "UTF-8 source bytes"],
          ["Output", "A generated ZIP download"],
        ],
      },
    ),
    section(
      "Make downloads reproducible",
      "The block exporters set stable archive timestamps and preserve exact destination paths. Tests unzip the result to verify the file inventory and source content.",
      {
        rows: [
          ["Stable metadata", "Deterministic modification time"],
          ["Correct layout", "Exact relative destination paths"],
          ["Validation", "Read the generated archive back"],
        ],
        note: "Synchronous compression belongs in the build script here, not the tooltip or an idle animation loop.",
      },
    ),
  ],
  "axe-core": [
    section(
      "Audit rendered markup",
      "axe-core runs automated accessibility rules over a document. The Playwright integration lets this repository audit pages in a real browser state.",
      {
        code: ["bash", "corepack pnpm test:a11y"],
        rows: [
          ["Engine", "axe-core"],
          ["Browser adapter", "@axe-core/playwright"],
        ],
      },
    ),
    section(
      "Interpret the scope",
      "Check the rule result, affected nodes and tested state. A passing automated scan cannot verify every keyboard flow, understandable label or assistive-technology experience.",
      {
        rows: [
          ["Automated", "Configured rules over rendered content"],
          ["Manual", "Keyboard, focus and task flow"],
          ["Evidence", "The page and state actually audited"],
        ],
        note: "Keep hidden, expanded and error states in the verification plan when they change the interaction.",
      },
    ),
  ],
  "preact-render-to-string": [
    section(
      "Render without a browser",
      "The renderer converts a Preact tree to HTML for server rendering and markup tests. It does not run a browser layout engine or client-side effects.",
      {
        code: [
          "tsx",
          'import { renderToString } from "preact-render-to-string";\nconst html = renderToString(<p>Ready</p>);',
        ],
      },
    ),
    section(
      "Keep server output deterministic",
      "Browser globals, per-user storage and random values can make server output unsafe or inconsistent with the client. Provide stable initial state and defer browser-only work to effects.",
      {
        rows: [
          ["Server", "Initial markup from explicit inputs"],
          ["Client", "Hydration and interaction"],
          ["Effects", "Browser resources after mounting"],
        ],
        note: "A render-to-string assertion verifies markup, not effect cleanup or final visual layout.",
      },
    ),
  ],
  "tw-animate-css": [
    section(
      "Use the shared animation layer",
      "The documentation stylesheet imports `tw-animate-css` alongside its other global styling. Component state classes can then select the intended animation treatment.",
      {
        code: ["css", '@import "tw-animate-css";', "From the documentation stylesheet"],
        rows: [
          ["Owner", "Global documentation CSS"],
          ["Trigger", "The component's actual state"],
        ],
      },
    ),
    section(
      "Avoid competing animation owners",
      "The motion guide keeps CSS animation classes and motion presets off the same nodes. Choose one owner so transforms and timing do not fight each other.",
      {
        rows: [
          ["CSS-driven node", "Utility animation treatment"],
          ["Motion-driven node", "The selected motion preset"],
          ["Reduced motion", "A usable quiet state"],
        ],
        href: "/docs/ui-motion/installation",
        note: "Decorative loops should stop when their content is no longer mounted or relevant.",
      },
    ),
  ],
};
