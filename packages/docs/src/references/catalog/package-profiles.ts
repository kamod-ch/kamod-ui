import type { CodeReferenceHelp, CodeReferenceHelpLink, CodeReferenceHelpSection } from "../types";
import { rootPackageName } from "./packages";

type ReadmeSnapshot = {
  href: string;
  /** Git blob identity returned by GitHub's contents API; this is not a release version. */
  sha: string;
};

export type SavedPackageProfile = Pick<
  CodeReferenceHelp,
  "name" | "description" | "detail" | "source" | "docs" | "related"
> & {
  sections: CodeReferenceHelpSection[];
  snapshot: { checkedAt: string; readmes: ReadmeSnapshot[] };
};

const repository = (name: string) => `https://github.com/kamod-ch/${name}`;
const readme = (name: string, anchor = "", path = "README.md") =>
  `${repository(name)}/blob/main/${path}${anchor ? `#${anchor}` : ""}`;
const source = (label: string, href: string): CodeReferenceHelpLink => ({ label, href });
const snippet = (language: string, value: string, caption: string) => ({
  language,
  value,
  caption,
});
const snapshot = (...readmes: ReadmeSnapshot[]): SavedPackageProfile["snapshot"] => ({
  checkedAt: "2026-10-17",
  readmes,
});

/**
 * Authored, abbreviated README snapshots. Loaded with reference help, never the navigation index.
 * Refresh deliberately from the cited official sources; opening a tooltip performs no web request.
 * Examples use APIs also present in this checkout's installed packages, not uninstalled preview APIs.
 */
const profiles: Record<string, SavedPackageProfile> = {
  "@kamod-ch/ui": {
    name: "@kamod-ch/ui",
    description:
      "Accessible Preact primitives with Tailwind CSS v4, semantic theme tokens and composable interaction. Import a component from the package root or its public subpath.",
    detail:
      "Kamod UI 2 uses Preact 11. Install the signals and themes peers even when the first component is presentational; demo-only `@/components/` aliases belong to this documentation.",
    source: source("Kamod UI repository", repository("kamod-ui")),
    docs: source("Component guides", "/docs/components"),
    related: [
      { label: "Quick start", href: readme("kamod-ui", "quick-start"), kind: "guide" },
      { label: "Themes", href: "/docs/theming/installation", kind: "guide" },
      { label: "Components", href: "/docs/components", kind: "guide" },
      {
        label: "Troubleshooting",
        href: readme("kamod-ui", "troubleshooting-tailwind-v4"),
        kind: "guide",
      },
    ],
    snapshot: snapshot({
      href: readme("kamod-ui"),
      sha: "6d529ca56d843202bb2244ad28ea6f12b8fc765a",
    }),
    sections: [
      {
        title: "Installation",
        detail: "Runtime peers and tooling",
        source: source("Kamod UI installation", readme("kamod-ui", "install")),
        description:
          "Start with `npm create kamod@latest`, or add the library to an existing Preact application. Runtime peers and the Tailwind Vite plugin serve different roles; install both groups before wiring the stylesheet.",
        code: snippet(
          "bash",
          "# Existing Preact app: components and runtime peers\npnpm add @kamod-ch/ui @kamod-ch/themes preact@^11 @preact/signals@^2.11.3\n# Build-time CSS processing\npnpm add -D tailwindcss@^4 @tailwindcss/vite",
          "Terminal · existing application",
        ),
        note: "Keep the package manager already selected by the consuming application.",
      },
      {
        title: "Connect the styles",
        detail: "Vite plugin and global CSS",
        source: source(
          "Vite and Tailwind setup",
          readme("kamod-ui", "vite--preact--tailwind-v4-starter"),
        ),
        description:
          "Register Preact and Tailwind in Vite, then import the shared theme once after Tailwind. Place semantic token overrides after these imports so custom values survive the defaults.",
        excerpts: [
          {
            title: "Build configuration",
            source: source(
              "Vite starter configuration",
              readme("kamod-ui", "vite--preact--tailwind-v4-starter"),
            ),
            code: snippet(
              "typescript",
              'import { defineConfig } from "vite";\nimport preact from "@preact/preset-vite";\nimport tailwindcss from "@tailwindcss/vite";\n\nexport default defineConfig({\n  plugins: [preact(), tailwindcss()],\n});',
              "vite.config.ts",
            ),
          },
          {
            title: "One shared stylesheet",
            source: source("Theme customization", readme("kamod-ui", "customize-the-theme")),
            code: snippet(
              "css",
              '@import "tailwindcss";\n@import "@kamod-ch/ui/theme.css";\n\n:root {\n  --radius: 0.75rem;\n}',
              "src/app.css · import from the application entry",
            ),
          },
        ],
      },
      {
        title: "Compose a component",
        detail: "Public package imports",
        source: source("Using Kamod UI", readme("kamod-ui", "per-component-imports-tree-shaking")),
        description:
          "The root barrel and per-component entry points both support tree shaking. Use documented props and compose the primitives; components already provide their keyboard, focus and state behavior.",
        code: snippet(
          "tsx",
          'import { Button } from "@kamod-ch/ui/button";\n// Also supported: import { Button } from "@kamod-ch/ui";\n\nexport function App() {\n  return <Button>Save changes</Button>;\n}',
          "src/app.tsx",
        ),
        note: "Import `./app.css` from the application entry before rendering.",
      },
    ],
  },
  "@kamod-ch/hooks": {
    name: "@kamod-ch/hooks",
    description:
      "Preact hooks for local state, lifecycle, browser interaction and async work. Typed root exports and per-hook imports share the same dependency-light implementation.",
    detail:
      "Preact is the runtime peer. Browser hooks wrap native platform behavior, so check each hook's cleanup, target and server-rendering contract before using it.",
    source: source("Kamod Hooks repository", repository("kamod-hooks")),
    docs: source("Hooks and live examples", "https://kamod-ch.github.io/kamod-hooks/hooks"),
    related: [
      {
        label: "Getting started",
        href: "https://kamod-ch.github.io/kamod-hooks/guide/introduction",
        kind: "guide",
      },
      { label: "Hook index", href: "https://kamod-ch.github.io/kamod-hooks/hooks", kind: "guide" },
      {
        label: "Counter",
        href: "https://kamod-ch.github.io/kamod-hooks/hooks/use-counter",
        kind: "guide",
      },
      {
        label: "URL state",
        href: "https://kamod-ch.github.io/kamod-hooks/hooks/use-url-state",
        kind: "guide",
      },
    ],
    snapshot: snapshot({
      href: readme("kamod-hooks"),
      sha: "1b33babeff2714c37a5c7fdf84fdcaad58cff634",
    }),
    sections: [
      {
        title: "Installation and imports",
        detail: "Root or per-hook entry",
        source: source("Install and basic usage", readme("kamod-hooks", "basic-usage")),
        description:
          "Install the package with Preact, then choose the root barrel for grouped imports or an explicit subpath for one hook. The subpath exports the hook as its default export.",
        excerpts: [
          {
            title: "Add the package",
            code: snippet("bash", "pnpm add @kamod-ch/hooks preact", "Terminal"),
          },
          {
            title: "Choose an import style",
            code: snippet(
              "typescript",
              'import { useToggle, useUrlState } from "@kamod-ch/hooks";\n// Equivalent explicit entry point:\nimport useCounter from "@kamod-ch/hooks/useCounter";',
              "Public exports",
            ),
          },
        ],
      },
      {
        title: "State with useful actions",
        detail: "Counter and toggle",
        source: source("Hooks example", readme("kamod-hooks", "example")),
        description:
          "Hooks return the current value with named actions. A counter can enforce bounds, while a toggle keeps boolean transitions readable without repeating state-updater logic.",
        code: snippet(
          "tsx",
          'import { useCounter, useToggle } from "@kamod-ch/hooks";\nexport function Controls() {\n  const [count, { inc }] = useCounter(0, { min: 0, max: 10 });\n  const [enabled, { toggle }] = useToggle(false);\n  return <div>\n    <button onClick={() => inc()}>{count}</button>\n    <button onClick={toggle}>{enabled ? "On" : "Off"}</button>\n  </div>;\n}',
          "Counter actions and bounded state",
        ),
        note: "Call hooks inside a Preact component or another hook.",
      },
      {
        title: "Choose where state lives",
        detail: "Persistence and browser behavior",
        source: source("Most-used hooks", readme("kamod-hooks", "most-used-hooks")),
        description:
          "Choose the hook by the lifetime of the value and the event that should update it. Keeping these boundaries explicit prevents a local interaction from becoming shared URL or persistent state by accident.",
        rows: [
          {
            label: "Local interaction",
            value: "`useToggle` and `useCounter` keep values within the component lifecycle.",
          },
          {
            label: "Across reloads",
            value: "`useLocalStorageState` stores a value in the browser.",
          },
          {
            label: "Shareable filters",
            value:
              "`useUrlState` mirrors query values through the History API and responds to `popstate`.",
          },
          {
            label: "Measured layout",
            value: "`useSize` observes dimensions; `useInViewport` observes visibility.",
          },
        ],
      },
    ],
  },
  "@kamod-ch/preactpress": {
    name: "@kamod-ch/preactpress",
    description:
      "A Preact and MDX documentation framework with file-based pages, typed configuration, optional plugins and static deployment. Guides can include the same Preact components as the library they explain.",
    detail:
      "The official starter requires Node.js 20 or newer. Configuration runs at build time; the deployed site consists of generated HTML and assets.",
    source: source("PreactPress repository", repository("preactpress")),
    docs: source("PreactPress documentation", "https://kamod-ch.github.io/preactpress/"),
    related: [
      {
        label: "Templates",
        href: "https://kamod-ch.github.io/preactpress/guide/templates/",
        kind: "guide",
      },
      {
        label: "Plugins",
        href: "https://kamod-ch.github.io/preactpress/guide/plugins/",
        kind: "guide",
      },
      {
        label: "Docs starter",
        href: `${repository("preactpress")}/tree/main/templates/docs`,
        kind: "source",
      },
      { label: "Deployment", href: readme("preactpress", "deployment"), kind: "guide" },
    ],
    snapshot: snapshot({
      href: readme("preactpress"),
      sha: "70f6715d43ebdf682f372cba088b5e7a27c64d32",
    }),
    sections: [
      {
        title: "Create and check a site",
        detail: "Docs template",
        source: source("PreactPress quick start", readme("preactpress", "quick-start")),
        description:
          "Scaffold the documentation template, install its dependencies and start the development server. Run the link and route checks before building the deployable site.",
        code: snippet(
          "bash",
          "pnpm dlx @kamod-ch/preactpress init my-docs --template docs\ncd my-docs\npnpm install\npnpm dev\n# Validate links, routes and navigation before release\npnpm check\npnpm build",
          "Terminal · Node.js 20+",
        ),
      },
      {
        title: "Configure the documentation",
        detail: "Typed build configuration",
        source: source("PreactPress configuration example", readme("preactpress", "code-example")),
        description:
          "Set the public site identity in `.preactpress/config.ts`. Navigation, search and optional Markdown or AI exports belong to the same typed configuration rather than individual page components.",
        code: snippet(
          "typescript",
          'import { defineConfig } from "@kamod-ch/preactpress/config";\n\nexport default defineConfig({\n  site: { title: "My library", url: "https://docs.example.com" },\n  themeConfig: { search: true },\n  ai: { llmsTxt: true, copyMarkdown: true },\n});',
          ".preactpress/config.ts",
        ),
        note: "Add official plugins when you need diagrams, playgrounds or generated API reference.",
      },
      {
        title: "From MDX to static output",
        detail: "Interactive pages and hosting",
        source: source("PreactPress deployment", readme("preactpress", "deployment")),
        description:
          "Import Preact components into MDX to keep examples beside their explanation. The production build emits `dist/`; a project-site deployment must use its URL prefix when building asset and route URLs.",
        excerpts: [
          {
            title: "An interactive page",
            source: source("Interactive MDX example", readme("preactpress", "code-example")),
            code: snippet(
              "mdx",
              'import Counter from "./components/Counter.tsx";\n\n## Try the counter\n\n<Counter initial={3} />',
              "A documentation page",
            ),
          },
          {
            title: "Build for a project path",
            source: source("Static deployment", readme("preactpress", "deployment")),
            code: snippet(
              "bash",
              "pnpm exec preactpress build --base /my-repo/\n# Deploy the generated dist/ directory",
              "Example · GitHub Pages project site",
            ),
          },
        ],
      },
    ],
  },
  "@kamod-ch/signals": {
    name: "@kamod-ch/signals",
    description:
      "Persisted Preact signals that retain the familiar `.value` API while storing values in local or session storage, IndexedDB, cookies or memory.",
    detail:
      "Browser-only storage stays out of server rendering. Pass a request-specific cookie context for server-readable cookies; IndexedDB restores persisted values asynchronously.",
    source: source("Kamod Signals repository", repository("kamod-signals")),
    docs: source("Kamod Signals documentation", "https://kamod-ch.github.io/kamod-signals/"),
    related: [
      {
        label: "Package API",
        href: readme("kamod-signals", "api", "packages/core/README.md"),
        kind: "guide",
      },
      {
        label: "Storage drivers",
        href: readme("kamod-signals", "storage-drivers", "packages/core/README.md"),
        kind: "guide",
      },
      {
        label: "SSR cookies",
        href: readme("kamod-signals", "ssr-cookie-context", "packages/core/README.md"),
        kind: "guide",
      },
      { label: "Local guide", href: "/docs/signals-package/installation", kind: "guide" },
    ],
    snapshot: snapshot(
      { href: readme("kamod-signals"), sha: "0055db9c2071e4a677b13bf148127ba5ca556a33" },
      {
        href: readme("kamod-signals", "", "packages/core/README.md"),
        sha: "a9e830af66009e49d7fc766ed8c0e2be14ce99e0",
      },
    ),
    sections: [
      {
        title: "Install and persist a value",
        detail: "Signals with a storage key",
        source: source(
          "Persisted signal usage",
          readme("kamod-signals", "usage", "packages/core/README.md"),
        ),
        description:
          "Install both runtime peers, then give a persisted signal a stable key, an initial value and a storage choice. Read and update `.value` as with an ordinary Preact signal.",
        excerpts: [
          {
            title: "Install the peers",
            code: snippet("bash", "pnpm add @kamod-ch/signals @preact/signals preact", "Terminal"),
          },
          {
            title: "Persist a preference",
            code: snippet(
              "typescript",
              'import { persistedSignal } from "@kamod-ch/signals";\n\nexport const theme = persistedSignal("theme", "dark", {\n  storage: "local",\n});\ntheme.value = "light";',
              "Local storage · shared signal",
            ),
          },
        ],
      },
      {
        title: "Keep component state durable",
        detail: "A persisted Preact hook",
        source: source(
          "Preact hook usage",
          readme("kamod-signals", "preact-hook", "packages/core/README.md"),
        ),
        description:
          "Use `usePersistedSignal` when a component owns a persisted preference. Session storage keeps the value within the browser session; choose local storage when it should remain after the browser restarts.",
        code: snippet(
          "tsx",
          'import { usePersistedSignal } from "@kamod-ch/signals";\nexport function SidebarToggle() {\n  const open = usePersistedSignal("sidebar-open", true, {\n    storage: "session",\n  });\n  return <button onClick={() => (open.value = !open.value)}>\n    {open.value ? "Close sidebar" : "Open sidebar"}\n  </button>;\n}',
          "Session storage · component preference",
        ),
      },
      {
        title: "Give SSR cookies a context",
        detail: "One context per request",
        source: source(
          "SSR cookie context",
          readme("kamod-signals", "ssr-cookie-context", "packages/core/README.md"),
        ),
        description:
          "Create the cookie context inside the request handler. It reads incoming cookies and forwards changed values to the response, keeping user-specific persisted state scoped to that request.",
        code: snippet(
          "typescript",
          'import { createCookieContext, persistedSignal } from "@kamod-ch/signals";\nconst cookieContext = createCookieContext({\n  cookie: request.headers,\n  onSetCookie: (value) => response.headers.append("set-cookie", value),\n});\nconst theme = persistedSignal("theme", "dark", {\n  storage: "cookie", cookieContext,\n  cookie: { path: "/", sameSite: "Lax" },\n});',
          "Inside an application request handler",
        ),
        note: "`request` and `response` come from the host server; do not share this context between requests.",
      },
    ],
  },
  "@kamod-ch/icons": {
    name: "@kamod-ch/icons",
    description:
      "Typed SVG components for Preact with independently importable icon families. Icons inherit `currentColor`, so the same component follows the surrounding application theme.",
    detail:
      "Use an explicit family subpath when names overlap. Give an icon-only control its own accessible name; a decorative icon alongside visible text should stay hidden from assistive technology.",
    source: source("Kamod Icons repository", repository("kamod-icons")),
    docs: source("Kamod Icons documentation", "https://kamod-ch.github.io/kamod-icons/"),
    related: [
      {
        label: "Icon families",
        href: readme("kamod-icons", "icon-sets", "packages/core/README.md"),
        kind: "guide",
      },
      {
        label: "Accessibility",
        href: readme("kamod-icons", "props-and-accessibility", "packages/core/README.md"),
        kind: "guide",
      },
      {
        label: "Attribution",
        href: `${repository("kamod-icons")}/blob/main/packages/core/ATTRIBUTION.md`,
        kind: "source",
      },
      { label: "Local guide", href: "/docs/icons-package/installation", kind: "guide" },
    ],
    snapshot: snapshot(
      { href: readme("kamod-icons"), sha: "c218b9f24c6f3e8dad377bc16abbf0b403d55bf3" },
      {
        href: readme("kamod-icons", "", "packages/core/README.md"),
        sha: "414124b66675be2042b47960a21a91aaa050288d",
      },
    ),
    sections: [
      {
        title: "Install and draw an icon",
        detail: "Preact SVG components",
        source: source("Kamod Icons quick start", readme("kamod-icons", "quick-start")),
        description:
          "Install the library with Preact and import a named component from an icon family. The `size` prop sets both SVG dimensions; normal SVG props pass through to the rendered element.",
        excerpts: [
          {
            title: "Add the package",
            code: snippet("bash", "pnpm add @kamod-ch/icons preact", "Terminal"),
          },
          {
            title: "A labeled action",
            code: snippet(
              "tsx",
              'import { SearchIcon } from "@kamod-ch/icons/shadcn";\n\nexport function SearchButton() {\n  return <button class="inline-flex items-center gap-2">\n    <SearchIcon size={20} aria-hidden="true" />\n    Search\n  </button>;\n}',
              "Use visible text as the button name",
            ),
          },
        ],
      },
      {
        title: "Choose a consistent family",
        detail: "Explicit import boundaries",
        source: source(
          "Available icon sets",
          readme("kamod-icons", "icon-sets", "packages/core/README.md"),
        ),
        description:
          "Select a family and weight that fit the interface. Explicit subpaths distinguish similarly named exports, while import aliases let two families coexist without renaming their public components.",
        code: snippet(
          "typescript",
          'import { SearchIcon } from "@kamod-ch/icons/lucide";\nimport { MagnifyingGlassIcon } from "@kamod-ch/icons/heroicons/outline";\nimport { SearchIcon as TablerSearchIcon } from "@kamod-ch/icons/tabler/outline";',
          "Lucide · Heroicons · Tabler",
        ),
        rows: [
          {
            label: "Outline or filled",
            value: "Heroicons, Tabler and Reicon expose separate weight entry points.",
          },
          {
            label: "Theme behavior",
            value:
              "Apply the text color to the icon or its parent; SVG strokes and fills use `currentColor`.",
          },
        ],
      },
      {
        title: "Name the action clearly",
        detail: "Props and accessibility",
        source: source(
          "Icon props and accessibility",
          readme("kamod-icons", "props-and-accessibility", "packages/core/README.md"),
        ),
        description:
          "An icon can illustrate a visible label or identify a standalone action. Put the accessible name on a button when it has no visible text; use `title` when the SVG itself needs a meaningful name.",
        code: snippet(
          "tsx",
          'import { SearchIcon } from "@kamod-ch/icons/shadcn";\n\n<button aria-label="Search documentation">\n  <SearchIcon size={18} aria-hidden="true" />\n</button>\n// A standalone, meaningful SVG:\n<SearchIcon size={20} title="Search" />',
          "Control name versus standalone icon title",
        ),
        note: "Keep decorative icons out of the accessibility tree to avoid repeated labels.",
      },
    ],
  },
};

export const packageProfileNames = Object.keys(profiles);

/** All package subpaths share their reviewed package profile; a caller can add subpath context. */
export function savedPackageProfile(module: string): SavedPackageProfile | undefined {
  const name = rootPackageName(module);
  return Object.hasOwn(profiles, name) ? profiles[name] : undefined;
}
