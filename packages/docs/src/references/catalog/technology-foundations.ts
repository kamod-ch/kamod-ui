import { technologySection as section, type TechnologySections } from "./technology-section-data";

/** Language/platform contracts and their practical boundaries in a Preact application. */
export const foundationSections: TechnologySections = {
  Preact: [
    section(
      "Render from state",
      "A component returns **JSX** from its current props and state. Event handlers update state; the renderer reconciles the resulting tree.",
      {
        detail: "Component model",
        code: [
          "tsx",
          'import { useState } from "preact/hooks";\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}',
        ],
        href: "/docs/getting-started",
      },
    ),
    section(
      "Own the lifecycle",
      "Allocate browser work inside an effect and return its cleanup. This keeps **listeners, timers and subscriptions** tied to the component that needs them.",
      {
        detail: "Resource cleanup",
        code: [
          "tsx",
          'useEffect(() => {\n  const onResize = () => updateSize();\n  window.addEventListener("resize", onResize);\n  return () => window.removeEventListener("resize", onResize);\n}, []);',
        ],
        note: "Browser globals belong behind an effect or an explicit environment check when rendering on the server.",
      },
    ),
  ],
  React: [
    section(
      "Keep the renderer clear",
      "React and Preact share familiar component concepts, but their **renderers, hooks and types** are separate dependencies. Kamod components are authored for Preact.",
      {
        rows: [
          ["Kamod JSX types", "preact"],
          ["Kamod hooks", "preact/hooks"],
          ["React examples", "Adapt imports and verify behavior"],
        ],
      },
    ),
    section(
      "Check compatibility",
      "A compatibility alias translates selected React entry points. It does not turn every React integration into a supported Preact API or remove the need to test its behavior.",
      {
        code: [
          "ts",
          '// Compatibility is configured by the application.\n"react": "preact/compat"\n"react-dom": "preact/compat"\n"react/jsx-runtime": "preact/jsx-runtime"',
          "Alias illustration",
        ],
        note: "Prefer native Preact packages for new Kamod compositions; retain deliberate aliases for existing integrations.",
      },
    ),
  ],
  TypeScript: [
    section(
      "Describe the contract",
      "Type aliases and interfaces make component inputs explicit. An optional property permits omission; a union limits the accepted values.",
      {
        code: [
          "typescript",
          'type ActionProps = {\n  label: string;\n  size?: "sm" | "md";\n  onActivate: () => void;\n};',
        ],
        rows: [
          ["Check", "corepack pnpm typecheck"],
          ["JSX source", ".tsx files"],
        ],
      },
    ),
    section(
      "Validate runtime input",
      "Type information is erased from emitted JavaScript. Data from a form, URL or service still needs **runtime validation** before it can be trusted.",
      {
        code: [
          "typescript",
          'function isLabel(value: unknown): value is string {\n  return typeof value === "string" && value.trim().length > 0;\n}',
        ],
        note: "Use a schema library when a boundary needs structured errors or inferred output types.",
      },
    ),
  ],
  Tailwind: [
    section(
      "Install with Vite",
      "Start a Vite project if needed, then add `tailwindcss` and its Vite plugin. In an existing app, keep your project and run only the installation command.",
      {
        detail: "Packages & project",
        href: "https://tailwindcss.com/docs/installation/using-vite",
        code: [
          "bash",
          "# New project only\nnpm create vite@latest my-project\ncd my-project\n# Add Tailwind to your app\nnpm install tailwindcss @tailwindcss/vite",
          "Terminal",
        ],
      },
    ),
    section(
      "Connect plugin & CSS",
      "Register `tailwindcss()` alongside your existing Vite plugins. Import Tailwind once in your application stylesheet, then load that stylesheet from your app.",
      {
        detail: "Build integration",
        href: "https://tailwindcss.com/docs/installation/using-vite",
        excerpts: [
          {
            title: "Vite configuration",
            code: {
              language: "typescript",
              caption: "vite.config.ts",
              value:
                'import { defineConfig } from "vite";\nimport tailwindcss from "@tailwindcss/vite";\n\nexport default defineConfig({\n  plugins: [tailwindcss()],\n});',
            },
          },
          {
            title: "Application stylesheet",
            code: { language: "css", caption: "src/style.css", value: '@import "tailwindcss";' },
          },
        ],
      },
    ),
    section(
      "Run & style",
      "Start your development script and write utility classes in your markup. Make sure the page includes your stylesheet; a framework may handle that import for you.",
      {
        detail: "Your first utilities",
        href: "https://tailwindcss.com/docs/installation/using-vite",
        excerpts: [
          { title: "Start development", code: { language: "bash", value: "npm run dev" } },
          {
            title: "Style a heading",
            code: {
              language: "html",
              caption: "HTML",
              value:
                '<!-- In a plain HTML entry -->\n<link href="/src/style.css" rel="stylesheet">\n<h1 class="text-3xl font-bold underline">\n  Hello world!\n</h1>',
            },
          },
        ],
        note: "Use complete class names so source detection can find each utility.",
      },
    ),
  ],
  JavaScript: [
    section(
      "Make updates explicit",
      "Use functions and immutable collection updates to make the transition from **old state to new state** visible in application code.",
      {
        code: [
          "javascript",
          "const nextItems = items.map((item) =>\n  item.id === changedId ? { ...item, selected: true } : item\n);",
        ],
        rows: [
          ["Browser behavior", "Events, DOM APIs and asynchronous work"],
          ["Static checking", "Added by TypeScript before execution"],
        ],
      },
    ),
    section(
      "Finish asynchronous work",
      "A promise can outlive the view that started it. Cancel supported requests or ignore obsolete results when the owner is disposed or the input changes.",
      {
        code: [
          "javascript",
          "const controller = new AbortController();\nfetch(url, { signal: controller.signal });\n// When the owning view is disposed:\ncontroller.abort();",
        ],
        note: "Cancellation and rejection handling are separate responsibilities; display only errors relevant to the current request.",
      },
    ),
  ],
  GitHub: [
    section(
      "Follow the source",
      "Repository files explain how a component is implemented; pull requests explain a proposed change and its validation. Prefer a **specific file or package** when citing code.",
      {
        href: "https://github.com/kamod-ch/kamod-ui",
        rows: [
          ["Components", "packages/core/src/components"],
          ["Compositions", "packages/blocks/src"],
          ["Documentation", "packages/docs"],
        ],
      },
    ),
    section(
      "Review the change",
      "A useful review connects the diff, its tests and the resulting behavior. Branch links follow new commits; a commit permalink preserves the exact version being discussed.",
      {
        rows: [
          ["Moving reference", "A branch such as main"],
          ["Stable reference", "A full commit SHA"],
          ["Automation", "Checks associated with that commit"],
        ],
        note: "A successful old check does not verify a newer head commit.",
      },
    ),
  ],
  Git: [
    section(
      "Inspect before editing",
      "The working tree, index and current branch describe different states. Read the diff before staging so an unrelated local adjustment is not bundled into a feature.",
      {
        code: ["bash", "git status --short\ngit diff --stat\ngit diff -- path/to/file"],
      },
    ),
    section(
      "Stage a focused change",
      "Explicit paths make a commit reviewable and preserve local-only context. The staged diff is the content the next commit records.",
      {
        code: ["bash", "git add path/to/changed-file\ngit diff --cached\ngit commit"],
        rows: [
          ["Working tree", "Edits not yet staged"],
          ["Index", "Content selected for the next commit"],
          ["Commit", "Recorded project snapshot"],
        ],
      },
    ),
  ],
  HTML: [
    section(
      "Start with semantics",
      "Native elements carry roles, focus behavior and browser interaction. A real button or link usually needs less custom behavior than a clickable generic container.",
      {
        code: [
          "html",
          '<button type="button">Open settings</button>\n<a href="/docs/getting-started">Read the guide</a>',
        ],
        rows: [
          ["Action", "button"],
          ["Navigation", "a with href"],
        ],
      },
    ),
    section(
      "Name the control",
      "Connect visible labels to their inputs, retain an accessible name on icon-only actions, and use headings to describe the document rather than their visual size.",
      {
        code: [
          "html",
          '<label for="email">Email</label>\n<input id="email" name="email" type="email"\n  aria-describedby="email-note">\n<p id="email-note">Used for account updates.</p>',
        ],
      },
    ),
  ],
  CSS: [
    section(
      "Use semantic roles",
      "Custom properties let the same component use a different palette without changing its markup. Keep the surface and its readable text color together.",
      {
        code: [
          "css",
          ".surface {\n  background: var(--card);\n  color: var(--card-foreground);\n  border: 1px solid var(--border);\n}",
        ],
        href: "/docs/theming/installation",
      },
    ),
    section(
      "Respect motion choices",
      "Transitions should explain state without making interaction depend on movement. Provide a reduced-motion rule for decorative animation.",
      {
        code: [
          "css",
          "@media (prefers-reduced-motion: reduce) {\n  .decoration {\n    animation: none;\n    transition: none;\n  }\n}",
        ],
        note: "A stopped animation should leave useful content visible and controls operable.",
      },
    ),
  ],
  JSX: [
    section(
      "Compose the tree",
      "JSX mixes element structure with JavaScript expressions. Preact components receive props and children; the compiler turns the syntax into element-creation calls.",
      {
        code: [
          "jsx",
          "function Greeting({ name }) {\n  return <p>Hello, <strong>{name}</strong>.</p>;\n}",
        ],
      },
    ),
    section(
      "Keep identity stable",
      "A list key identifies the same item across updates. Use an item's persistent identity when reordering, inserting or deleting items.",
      {
        code: ["jsx", "<ul>\n  {items.map((item) => <li key={item.id}>{item.label}</li>)}\n</ul>"],
        note: "JSX is source syntax; renderer selection comes from imports and build configuration.",
      },
    ),
  ],
  TSX: [
    section(
      "Type a component",
      "A `.tsx` file combines TypeScript with JSX. Use Preact's public types for event, child and intrinsic-element contracts in Kamod code.",
      {
        code: [
          "tsx",
          'import type { ComponentChildren } from "preact";\n\ntype NoticeProps = { children: ComponentChildren };\nconst Notice = ({ children }: NoticeProps) => <aside>{children}</aside>;',
        ],
      },
    ),
    section(
      "Separate source and output",
      "The compiler checks JSX types while a configured transform emits runnable JavaScript. Match the JSX import source to the renderer used by the application.",
      {
        code: [
          "json",
          '{\n  "compilerOptions": {\n    "jsx": "react-jsx",\n    "jsxImportSource": "preact"\n  }\n}',
        ],
        note: "The react-jsx transform name does not itself install or select the React renderer.",
      },
    ),
  ],
  JSON: [
    section(
      "Represent structured values",
      "JSON uses quoted property names, arrays and primitive values. Package manifests and generated reference payloads use it to carry data without executable functions.",
      {
        code: [
          "json",
          '{\n  "name": "example",\n  "private": true,\n  "tags": ["preact", "ui"]\n}',
        ],
      },
    ),
    section(
      "Check the parsed shape",
      "Parsing verifies syntax, not the application's data contract. Validate the resulting value before reading fields supplied by a service or user.",
      {
        code: [
          "typescript",
          "const value: unknown = JSON.parse(source);\n// Validate value before using application-specific fields.",
        ],
        rows: [
          ["Syntax", "Double quotes; no trailing commas"],
          ["Not represented", "Functions, undefined or circular references"],
        ],
      },
    ),
  ],
  SVG: [
    section(
      "Scale a vector",
      "A viewBox defines the drawing coordinates independently of display size. Stroke-based icons can inherit the surrounding text color with `currentColor`.",
      {
        code: [
          "html",
          '<svg viewBox="0 0 24 24" width="16" height="16"\n  fill="none" stroke="currentColor" aria-hidden="true">\n  <path d="M5 12h14M12 5v14" />\n</svg>',
        ],
      },
    ),
    section(
      "Name the action",
      "Decorative SVGs should not compete with a control's accessible name. Give an icon-only button a label that explains the action rather than the shape.",
      {
        code: [
          "tsx",
          '<button type="button" aria-label="Add item">\n  <PlusIcon aria-hidden="true" />\n</button>',
        ],
        href: "/docs/icons-package/installation",
        rows: [
          ["Decorative icon", "aria-hidden"],
          ["Meaningful graphic", "Provide an accessible name or adjacent explanation"],
        ],
      },
    ),
  ],
  Markdown: [
    section(
      "Author a document",
      "Headings, lists, links and fenced code express document structure in plain text. Supply the language after a code fence when syntax highlighting is useful.",
      {
        code: [
          "markdown",
          "## Install\n\nRead the [setup guide](/docs/getting-started).\n\n```bash\ncorepack pnpm install\n```",
        ],
      },
    ),
    section(
      "Keep rendering safe",
      "Markdown parsing and safe HTML handling are different stages. This site's authoring configuration disables raw Markdown HTML; arbitrary parsed HTML still needs a trust policy.",
      {
        rows: [
          ["Authoring", "Headings, prose, links and fences"],
          ["Rendering", "A parser and project-specific presentation"],
          ["Untrusted HTML", "Sanitize before inserting into a document"],
        ],
        note: "A parser is not automatically an HTML sanitizer.",
      },
    ),
  ],
  MDX: [
    section(
      "Combine prose and components",
      "MDX compiles Markdown with JSX. Imported components can make a document interactive, but that also means the document participates in the application's module graph.",
      {
        code: [
          "mdx",
          'import { Example } from "./Example";\n\n# A documented interaction\n\n<Example />',
          "MDX syntax illustration",
        ],
      },
    ),
    section(
      "Choose the authoring boundary",
      "Use ordinary Markdown for portable prose and a supported component document for application UI. An `.mdx` example does not establish that a project has configured an MDX compiler.",
      {
        rows: [
          ["Input", "Markdown with JSX and imports"],
          ["Required tooling", "A compatible MDX compilation pipeline"],
          ["Trust boundary", "Imported code can execute in its configured environment"],
        ],
      },
    ),
  ],
  DOM: [
    section(
      "Scope document work",
      "Query within the owning element instead of repeatedly scanning the whole document. A mutation observer can watch just the subtree whose changes matter.",
      {
        code: [
          "javascript",
          "const observer = new MutationObserver(update);\nobserver.observe(container, { childList: true, subtree: true });\n// Dispose with the owning view:\nobserver.disconnect();",
        ],
      },
    ),
    section(
      "Separate reads and writes",
      "Read layout once, compute the next result, then update styles. Repeatedly interleaving layout reads and DOM writes can force extra synchronous layout work.",
      {
        rows: [
          ["Read", "getBoundingClientRect or client dimensions"],
          ["Compute", "Placement and size constraints"],
          ["Write", "A bounded style or attribute update"],
        ],
        note: "Disconnect observers and remove document listeners when their owner is disposed.",
      },
    ),
  ],
  "WAI-ARIA": [
    section(
      "Expose interaction state",
      "ARIA describes roles, states and relationships to assistive technology. It complements a working interaction rather than creating keyboard behavior by itself.",
      {
        code: [
          "html",
          '<button type="button" aria-expanded="false"\n  aria-controls="details">Show details</button>\n<div id="details" hidden>Additional information</div>',
        ],
      },
    ),
    section(
      "Keep behavior in sync",
      "Expanded state, focus movement and visibility must describe the same actual state. Prefer native HTML where it already supplies the expected semantics.",
      {
        rows: [
          ["Role", "What a widget is"],
          ["State", "Its current value or condition"],
          ["Behavior", "Implemented by the component, not the ARIA attribute"],
        ],
        note: "Use the relevant authoring pattern alongside keyboard and assistive-technology testing.",
      },
    ),
  ],
  WCAG: [
    section(
      "Check usable outcomes",
      "Accessibility checks cover perceivable content, operable controls, understandable behavior and robust semantics. A single automated score cannot verify every success criterion.",
      {
        rows: [
          ["Keyboard", "Reach and operate every necessary control"],
          ["Focus", "Keep the current position visible"],
          ["Content", "Provide meaningful labels and error recovery"],
        ],
      },
    ),
    section(
      "Combine review methods",
      "Automated rules catch a useful subset of problems. Pair them with keyboard, zoom, contrast and assistive-technology review for the actual interaction being shipped.",
      {
        rows: [
          ["Automated", "Repeatable rules over rendered markup"],
          ["Manual", "Task flow, focus order and understandable feedback"],
          ["Evidence", "Record scope, states and environments checked"],
        ],
        note: "Passing an automated audit alone is not a conformance claim.",
      },
    ),
  ],
  ECMAScript: [
    section(
      "Separate language and host",
      "ECMAScript specifies JavaScript values, expressions and built-in language behavior. Browser DOM APIs and Node file APIs are supplied by their host environments.",
      {
        rows: [
          ["Language", "Objects, promises, modules and expressions"],
          ["Browser host", "document and DOM events"],
          ["Node host", "File system and process APIs"],
        ],
      },
    ),
    section(
      "Match the runtime target",
      "Source transforms can rewrite syntax, while missing runtime APIs may require a separate implementation. A TypeScript target is not a blanket browser-support guarantee.",
      {
        code: [
          "javascript",
          'const result = await Promise.resolve("ready");\n// Promise is a language built-in; document is a browser API.',
        ],
        note: "Check the environments actually supported by the application before choosing syntax or APIs.",
      },
    ),
  ],
  ESM: [
    section(
      "Import public entry points",
      "ES modules declare dependencies with `import` and expose bindings with `export`. Package exports describe which subpaths consumers are intended to resolve.",
      {
        code: ["typescript", 'import { Button } from "@kamod-ch/ui/button";\nexport { Button };'],
        rows: [
          ["This workspace", "type: module"],
          ["Focused entry", "A verified package subpath"],
        ],
      },
    ),
    section(
      "Load optional work lazily",
      "Dynamic imports create an asynchronous module boundary. Cache successful shared loads, handle rejection and keep heavyweight optional code out of the initial route.",
      {
        code: [
          "javascript",
          'const { feature } = await import("./optional-feature.js");\nfeature();',
        ],
        note: "The runtime and bundler determine resolution rules; filesystem paths are not interchangeable with package exports.",
      },
    ),
  ],
  CommonJS: [
    section(
      "Recognize the module shape",
      "CommonJS exports with `module.exports` and loads with `require`. A `.cjs` extension is an explicit way to distinguish it inside an ESM-oriented project.",
      {
        code: [
          "javascript",
          'const path = require("node:path");\nmodule.exports = { output: path.join("dist", "index.cjs") };',
          "CommonJS illustration",
        ],
      },
    ),
    section(
      "Check interoperability",
      "Named exports inferred from CommonJS and default-import behavior depend on the host and tooling. Read the installed package's export map instead of guessing an import shape.",
      {
        rows: [
          ["Workspace source", "ES modules"],
          ["CommonJS consumer", "Requires a compatible published output"],
          ["Package boundary", "Inspect exports, main and module metadata"],
        ],
        note: "Do not replace a documented ESM import with require without checking the target environment.",
      },
    ),
  ],
  "React DOM": [
    section(
      "Know the renderer",
      "React DOM renders React components into browser documents. Kamod's component implementations instead use Preact's renderer and JSX types.",
      {
        rows: [
          ["React application", "React DOM entry points"],
          ["Kamod application", "Preact rendering"],
          ["Existing integration", "May deliberately use preact/compat aliases"],
        ],
      },
    ),
    section(
      "Avoid mixed ownership",
      "Two renderers should not independently own the same DOM subtree. Choose a deliberate integration boundary and preserve focus, events and cleanup when mounting or disposing it.",
      {
        rows: [
          ["Mount", "One renderer owns a container"],
          ["Update", "Use that renderer's state and lifecycle"],
          ["Dispose", "Unmount through the owning renderer"],
        ],
        note: "A compatibility alias is application configuration, not a new dependency required by native Kamod blocks.",
      },
    ),
  ],
};
