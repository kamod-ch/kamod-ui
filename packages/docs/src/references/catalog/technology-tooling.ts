import { technologySection as section, type TechnologySections } from "./technology-section-data";

/** Build and verification tools: recipes distinguish this checkout from alternative integrations. */
export const toolingSections: TechnologySections = {
  Vite: [
    section(
      "CLI workflow",
      "Use the development server while editing, build deployable files, then preview that output locally. `vite dev` and `vite serve` are aliases for `vite`.",
      {
        detail: "Develop → build → preview",
        href: "https://vite.dev/guide/cli",
        code: [
          "bash",
          "# Development server\nnpx vite\n\n# Production files, then local verification\nnpx vite build\nnpx vite preview",
          "Terminal · project with Vite installed",
        ],
        note: "Preview is local verification, not a production server. Dependency pre-bundling is automatic; `vite optimize` is deprecated.",
      },
    ),
    section(
      "Adding a plugin",
      "Install a plugin as a development dependency, then add its factory to `plugins` in your Vite config. This official example adds legacy-browser support.",
      {
        detail: "Install & register",
        href: "https://vite.dev/guide/using-plugins#adding-a-plugin",
        excerpts: [
          {
            title: "Install the example plugin",
            code: { language: "bash", value: "npm add -D @vitejs/plugin-legacy" },
          },
          {
            title: "Extend your config",
            code: {
              language: "typescript",
              caption: "vite.config.ts",
              value:
                'import { defineConfig } from "vite";\nimport legacy from "@vitejs/plugin-legacy";\n\nexport default defineConfig({\n  plugins: [legacy({ targets: ["defaults", "not IE 11"] })],\n});',
            },
          },
        ],
        note: "Keep existing plugins. Presets can contain several plugins; Vite flattens the array and skips falsy entries.",
      },
    ),
    section(
      "Environments configuration",
      "A regular SPA or MPA uses top-level options for its `client` environment. Add named environments only when server or edge code needs its own overrides.",
      {
        detail: "Client defaults · named overrides",
        href: "https://vite.dev/guide/api-environment#environments-configuration",
        code: [
          "typescript",
          'import { defineConfig } from "vite";\n\nexport default defineConfig({\n  build: { sourcemap: false },\n  environments: {\n    server: {},\n    edge: { resolve: { noExternal: true } },\n  },\n});',
          "vite.config.ts · multi-environment example",
        ],
        note: "Most top-level options are inherited; `optimizeDeps` is client-specific. The Environment API is a release candidate in this saved guide.",
      },
    ),
  ],
  pnpm: [
    section(
      "Use the workspace version",
      "This repository pins its package manager in `package.json`. Corepack selects that version so local commands and the committed lockfile use the same package-manager contract.",
      {
        code: ["bash", "corepack pnpm install --frozen-lockfile"],
        rows: [
          ["Workspace packages", "pnpm-workspace.yaml"],
          ["Resolved dependencies", "pnpm-lock.yaml"],
        ],
      },
    ),
    section(
      "Target the affected package",
      "Workspace filters run a script in its owning package. Build dependencies before a test that imports their published runtime output.",
      {
        code: [
          "bash",
          "corepack pnpm --filter @kamod-ch/ui-docs test\ncorepack pnpm --filter @kamod-ch/blocks test",
        ],
        note: "The root test command runs core tests; it does not stand in for every workspace suite.",
      },
    ),
  ],
  npm: [
    section(
      "Distinguish registry and client",
      "The npm registry hosts published package metadata and tarballs; the npm CLI installs packages and runs scripts. Another client can consume the same registry.",
      {
        rows: [
          ["Package identity", "A name such as @kamod-ch/ui"],
          ["Registry metadata", "Versions, exports and dependency declarations"],
          ["Local client here", "The packageManager-pinned pnpm command"],
        ],
      },
    ),
    section(
      "Read before installing",
      "Check the public export and peer dependencies of the requested package. A displayed install command is an example for a consumer application, not a command executed by this documentation.",
      {
        code: [
          "bash",
          "npm view @kamod-ch/ui exports peerDependencies",
          "Read-only metadata lookup",
        ],
        note: "Keep this workspace's pnpm lockfile authoritative instead of introducing a second installation lockfile.",
      },
    ),
  ],
  Yarn: [
    section(
      "Use the selected client",
      "Yarn manages JavaScript dependencies and scripts. Its lockfile and workspace behavior belong to a Yarn-configured project; this checkout selects pnpm instead.",
      {
        rows: [
          ["Package client", "Yarn"],
          ["Project selection", "packageManager metadata"],
          ["This repository", "Use corepack pnpm"],
        ],
      },
    ),
    section(
      "Translate the intent",
      "When following a Yarn example, preserve what it does: add a runtime dependency, add development tooling, or run a package script. Choose the equivalent command for the consuming project.",
      {
        code: [
          "bash",
          "yarn add preact\nyarn add --dev typescript\nyarn run build",
          "Consumer-project command examples",
        ],
        note: "Do not mix package clients merely because a third-party guide shows a different command.",
      },
    ),
  ],
  "Node.js": [
    section(
      "Keep build APIs off the client",
      "Node supplies file-system and process APIs for scripts and build plugins. Those APIs belong in build-time modules rather than browser tooltip or component imports.",
      {
        code: [
          "typescript",
          'import { readFile } from "node:fs/promises";\nconst manifest = JSON.parse(await readFile("package.json", "utf8"));',
        ],
        rows: [
          ["Build plugins", "packages/docs/.preactpress"],
          ["Browser UI", "packages/docs/src"],
        ],
      },
    ),
    section(
      "Check the module environment",
      "The root package declares ESM. Scripts should use the correct module syntax and inspect the installed runtime before relying on a recently introduced platform feature.",
      {
        code: ["bash", "node --version\ncorepack pnpm --version"],
        note: "Type declarations describe an API; they do not prove that the running Node version implements it.",
      },
    ),
  ],
  Docker: [
    section(
      "Separate build and runtime",
      "A container packages a chosen environment. Build tools, generated assets and the final serving process have different responsibilities and can live in separate stages.",
      {
        rows: [
          ["Build stage", "Install dependencies and produce assets"],
          ["Runtime stage", "Serve the generated application"],
          ["Configuration", "Pass environment values deliberately"],
        ],
      },
    ),
    section(
      "Preserve the deployment path",
      "Containerizing a static documentation build does not remove its URL-prefix or routing requirements. Serve emitted assets at the prefix used during the build.",
      {
        rows: [
          ["Asset URLs", "Match the configured base path"],
          ["Routes", "Use the static host's fallback behavior"],
          ["Secrets", "Keep outside browser bundles and image source"],
        ],
        note: "Docker is an integration option; no container is required to develop Kamod components.",
      },
    ),
  ],
  Bun: [
    section(
      "Know the tool boundary",
      "Bun combines a JavaScript runtime, package manager and other tooling. A Bun command in an external guide does not change this workspace's pinned pnpm workflow.",
      {
        rows: [
          ["Runtime", "Executes supported JavaScript"],
          ["Package command", "bun add"],
          ["Script command", "bun run"],
        ],
      },
    ),
    section(
      "Verify before switching",
      "Changing the runtime or installer affects dependency resolution, script execution and lockfiles. Test the actual build and browser output rather than assuming every Node-oriented tool behaves identically.",
      {
        code: ["bash", "bun run build", "Example for a Bun-configured consumer"],
        note: "Use corepack pnpm for this checkout and preserve its existing lockfile.",
      },
    ),
  ],
  Corepack: [
    section(
      "Dispatch the pinned manager",
      "Corepack uses project package-manager configuration to choose a supported client. The root `packageManager` field is the version-selection source for this workspace.",
      {
        code: ["bash", "corepack pnpm --version\ncorepack pnpm install --frozen-lockfile"],
      },
    ),
    section(
      "Keep selection reproducible",
      "Calling the dispatcher avoids accidentally using an unrelated standalone pnpm version. The selected manager then owns installation, workspace filtering and script execution.",
      {
        rows: [
          ["Selector", "Corepack"],
          ["Version source", "package.json → packageManager"],
          ["Dependency resolution", "The selected pnpm client and lockfile"],
        ],
        note: "Corepack availability depends on the installed environment; it is not browser application code.",
      },
    ),
  ],
  Vitest: [
    section(
      "Test observable behavior",
      "Use a test runner to verify the result of a change: returned data, rendered behavior or lifecycle cleanup. Avoid assertions that merely repeat the implementation.",
      {
        code: [
          "typescript",
          'import { expect, it } from "vitest";\n\nit("keeps the original value", () => {\n  expect(normalize("ready")).toBe("ready");\n});',
        ],
      },
    ),
    section(
      "Choose the environment",
      "Pure catalog and extraction tests can run in Node. DOM interaction tests opt into jsdom and must clean up mounted components, timers and observers.",
      {
        code: [
          "typescript",
          '/** @vitest-environment jsdom */\nimport { cleanup } from "@testing-library/preact";\nimport { afterEach } from "vitest";\nafterEach(cleanup);',
        ],
        note: "Use browser tests for layout and real browser behavior that a DOM simulation cannot establish.",
      },
    ),
  ],
  Playwright: [
    section(
      "Exercise the browser",
      "Browser checks can verify navigation, keyboard focus, responsive geometry and scroll retention against the production documentation preview.",
      {
        code: [
          "typescript",
          'await page.goto("/docs/getting-started");\nawait page.getByRole("link", { name: "Components", exact: true }).first().focus();',
        ],
        rows: [
          ["Tests", "packages/docs/e2e"],
          ["Configuration", "packages/docs/playwright.config.ts"],
        ],
      },
    ),
    section(
      "Wait for the real condition",
      "Prefer observable locators and auto-retrying assertions to fixed sleeps. A test should wait for the specific interactive state or lazy content it is about to inspect.",
      {
        code: [
          "typescript",
          'await expect(page.getByRole("dialog")).toBeVisible();\nawait expect(page.getByRole("dialog")).toContainText("Props");',
        ],
        note: "Record the browser and tested states; passing Chrome does not establish Safari behavior.",
      },
    ),
  ],
  "Testing Library": [
    section(
      "Query what users perceive",
      "Role and accessible-name queries connect a component test to its semantics. They also expose controls whose visible appearance lacks an accessible name.",
      {
        code: [
          "tsx",
          'const { getByRole } = render(<button>Save</button>);\nexpect(getByRole("button", { name: "Save" })).toBeVisible();',
        ],
      },
    ),
    section(
      "Dispose every render",
      "Unmount test trees after each test so listeners, effects and detached elements do not leak into the next case. Use a real browser when the assertion depends on layout.",
      {
        code: [
          "typescript",
          'import { cleanup } from "@testing-library/preact";\nafterEach(cleanup);',
        ],
        rows: [
          ["Component behavior", "DOM output and interactions"],
          ["Layout fidelity", "A browser test"],
          ["Resources", "Assert cleanup when the feature owns them"],
        ],
      },
    ),
  ],
  Oxlint: [
    section(
      "Check source correctness",
      "Oxlint is the repository's primary lint command. Run the existing configuration so new code follows the same correctness rules as the surrounding package.",
      {
        code: ["bash", "corepack pnpm lint\ncorepack pnpm exec oxlint path/to/changed-file.ts"],
        rows: [
          ["Root script", "lint → oxlint ."],
          ["Purpose", "Configured static diagnostics"],
        ],
      },
    ),
    section(
      "Keep fixes scoped",
      "Review a diagnostic before changing code. Broad automatic fixes can introduce unrelated churn; a focused feature should leave unaffected files alone.",
      {
        rows: [
          ["Lint", "Potential correctness and source-rule issues"],
          ["Typecheck", "Type and module contracts"],
          ["Tests", "Executable behavior and regression coverage"],
        ],
        note: "A clean lint result complements tests and typechecking; it does not replace them.",
      },
    ),
  ],
  Oxfmt: [
    section(
      "Format the changed files",
      "Oxfmt owns source formatting in this repository. Format explicit paths, then use check mode to verify the final state without rewriting other files.",
      {
        code: [
          "bash",
          "corepack pnpm exec oxfmt path/to/changed-file.ts\ncorepack pnpm exec oxfmt --check path/to/changed-file.ts",
        ],
      },
    ),
    section(
      "Keep the review readable",
      "Consistent formatting makes the functional diff easier to inspect. Retain the repository's other checks instead of treating formatter success as a replacement for them.",
      {
        rows: [
          ["Write mode", "Apply source formatting"],
          ["Check mode", "Report formatting differences"],
          ["Scope", "Only files relevant to the feature"],
        ],
        note: "Generated build output and local context should not be swept into a formatting commit.",
      },
    ),
  ],
  Biome: [
    section(
      "Retain the existing check",
      "The root configuration keeps Biome alongside Oxlint and Oxfmt. Its configured checks remain part of repository validation.",
      {
        code: ["bash", "corepack pnpm biome:ci"],
        rows: [
          ["Configuration", "biome.json"],
          ["Primary linter", "Oxlint"],
          ["Primary formatter", "Oxfmt"],
        ],
      },
    ),
    section(
      "Avoid conflicting rewrites",
      "Run the project's check command after formatting. If two tools disagree, inspect the configured rule and make the smallest targeted correction rather than reformatting the repository.",
      {
        rows: [
          ["Review", "Changed paths and diagnostics"],
          ["Preserve", "Existing aggregate scripts"],
          ["Report", "The actual command and outcome"],
        ],
        note: "Do not remove an existing validation layer simply because another tool covers part of the same area.",
      },
    ),
  ],
  tsup: [
    section(
      "Build package entry points",
      "Package build configuration determines which public modules are emitted. Keep entry points aligned with `package.json` exports when exposing a new component or block.",
      {
        rows: [
          ["Entry configuration", "Each package's tsup.config.ts"],
          ["Public names", "package.json exports"],
          ["Type surface", "Emitted declarations"],
        ],
      },
    ),
    section(
      "Restore runtime output",
      "Type-only output cannot satisfy a consumer that imports built JavaScript. In this workspace, rebuild after declaration-only typechecking before tests that consume package distributions.",
      {
        code: ["bash", "corepack pnpm typecheck\ncorepack pnpm build"],
        note: "Check both the declaration contract and the runtime entry that a package consumer actually imports.",
      },
    ),
  ],
  Rollup: [
    section(
      "Understand the output graph",
      "A module bundler starts from entry points and follows imports to produce distributable files. Entry selection, externals and output format determine what consumers receive.",
      {
        rows: [
          ["Entry", "A public application or library module"],
          ["External", "A dependency left for the consumer"],
          ["Output", "Bundled files and optional chunks"],
        ],
      },
    ),
    section(
      "Inspect the emitted bundle",
      "Tree shaking depends on analyzable modules and side-effect information. Verify the generated assets rather than inferring bundle size from a short import statement.",
      {
        code: [
          "typescript",
          'import { Button } from "@kamod-ch/ui/button";',
          "Focused public entry point",
        ],
        note: "Consult the current build configuration before assuming a particular bundler backend or plugin is active.",
      },
    ),
  ],
  Rolldown: [
    section(
      "Check the configured backend",
      "Rolldown is a JavaScript bundler with a Rust implementation. Its public configuration and plugin compatibility should be checked against the installed build-tool version.",
      {
        rows: [
          ["Role", "Module bundling"],
          ["Input", "Application or library entry points"],
          ["Verification", "Production assets and browser behavior"],
        ],
      },
    ),
    section(
      "Treat migration as behavior",
      "A bundler change can affect chunk boundaries, dependency interoperation and emitted assets. Recheck dynamic imports and deployed route prefixes even when source files are unchanged.",
      {
        rows: [
          ["Lazy paths", "Optional readers and examples"],
          ["CSS", "Order and emitted asset references"],
          ["Deployment", "Base-prefixed URLs"],
        ],
        note: "Rollup-compatible API goals do not remove the need to validate the plugins used by this project.",
      },
    ),
  ],
  esbuild: [
    section(
      "Separate transforms and checks",
      "esbuild transforms and bundles source. Transpiling TypeScript removes type syntax; it does not replace the repository's TypeScript checking stage.",
      {
        rows: [
          ["Transform", "Convert supported syntax"],
          ["Bundle", "Resolve and combine the module graph"],
          ["Typecheck", "Run the project's compiler checks separately"],
        ],
      },
    ),
    section(
      "Respect runtime dependencies",
      "Library builds often keep framework peers external so consumers share one renderer. Verify package metadata and emitted imports when changing entry points.",
      {
        rows: [
          ["Framework", "Preact peer dependency"],
          ["Public API", "Exported package entry points"],
          ["Validation", "Import the built output, not only the source"],
        ],
        note: "A fast successful build is useful evidence about output, not proof of runtime behavior.",
      },
    ),
  ],
  PostCSS: [
    section(
      "Read the plugin pipeline",
      "PostCSS parses CSS and lets configured plugins transform it. Its presence alone does not identify which transformations an application applies.",
      {
        rows: [
          ["Parser", "CSS source into a syntax tree"],
          ["Plugins", "Explicit transformations"],
          ["Output", "CSS passed to the next build stage"],
        ],
      },
    ),
    section(
      "Avoid duplicate styling owners",
      "This docs app connects Tailwind through its Vite plugin. Add another CSS pipeline only for a verified requirement and inspect the resulting import order.",
      {
        code: [
          "typescript",
          'import tailwindcss from "@tailwindcss/vite";\n// Included in the documentation Vite plugin list:\ntailwindcss();',
        ],
        note: "A third-party PostCSS recipe may describe a different Tailwind version or integration.",
      },
    ),
  ],
  Autoprefixer: [
    section(
      "Transform for browser targets",
      "Autoprefixer is a PostCSS plugin that adds vendor prefixes according to configured browser support data. It is distinct from a utility CSS generator.",
      {
        rows: [
          ["Input", "Authored CSS"],
          ["Decision", "Configured browser targets"],
          ["Output", "Required prefixed declarations"],
        ],
      },
    ),
    section(
      "Verify before adding it",
      "Check the current Tailwind integration and build pipeline before copying an older setup command. Duplicate transforms add complexity without establishing broader browser support.",
      {
        rows: [
          ["Current docs integration", "@tailwindcss/vite"],
          ["Consumer requirement", "Its chosen browser-support policy"],
          ["Verification", "Built CSS and supported browsers"],
        ],
        note: "Prefix generation does not implement every missing browser feature.",
      },
    ),
  ],
  ESLint: [
    section(
      "Recognize a different rule engine",
      "ESLint checks code through its configured parser, rules and plugins. An ESLint example may be useful in a consumer project while this repository uses Oxlint as its primary linter.",
      {
        rows: [
          ["Rule configuration", "Project-specific"],
          ["This repository", "corepack pnpm lint"],
          ["Primary engine here", "Oxlint"],
        ],
      },
    ),
    section(
      "Transfer the requirement",
      "When a guide mentions an ESLint rule, identify the actual requirement—hook ordering, unused values or accessibility—then verify the corresponding project checks.",
      {
        rows: [
          ["Rule intent", "The behavior being protected"],
          ["Tool support", "The configured linter and typechecker"],
          ["Regression", "A focused test for observable behavior"],
        ],
        note: "Do not add a second lint stack solely to reproduce an external guide's command.",
      },
    ),
  ],
  Prettier: [
    section(
      "Keep formatter ownership clear",
      "Prettier formats source in projects that select it. This checkout uses Oxfmt, so retain the existing formatter configuration when adapting examples.",
      {
        code: ["bash", "corepack pnpm format:check", "Repository formatting check"],
        rows: [
          ["External guide", "May show a Prettier command"],
          ["This checkout", "Oxfmt"],
        ],
      },
    ),
    section(
      "Separate formatting and semantics",
      "Formatting should preserve behavior and make a diff easier to read. Review substantive changes separately from generated whitespace or unrelated formatting churn.",
      {
        rows: [
          ["Source layout", "Formatter responsibility"],
          ["Correctness rules", "Linter responsibility"],
          ["Type contract", "Compiler responsibility"],
        ],
        note: "Use explicit changed-file paths when applying formatting locally.",
      },
    ),
  ],
  jsdom: [
    section(
      "Simulate the DOM",
      "jsdom provides a document environment for Node-based component tests. It supports DOM assertions without starting a full graphical browser.",
      {
        code: [
          "typescript",
          '/** @vitest-environment jsdom */\nimport { render } from "@testing-library/preact";',
        ],
        rows: [
          ["Useful for", "Markup, events and lifecycle tests"],
          ["Different from", "A browser layout engine"],
        ],
      },
    ),
    section(
      "Use a browser for geometry",
      "Responsive sizes, clipping, scroll placement and visual contrast need browser evidence. Mocking a rectangle can test placement logic but cannot verify real rendered layout.",
      {
        rows: [
          ["Unit test", "A controlled geometry input"],
          ["Browser test", "Actual dimensions and interactions"],
          ["Cleanup", "Unmount and restore mocks between cases"],
        ],
        note: "A jsdom test should not claim visual compatibility with Chrome or Safari.",
      },
    ),
  ],
  Lefthook: [
    section(
      "Run repository hooks",
      "Lefthook dispatches the configured Git hooks. This repository's hook configuration runs checks on staged paths before a commit is recorded.",
      {
        rows: [
          ["Configuration", "lefthook.yml"],
          ["Installation", "Root prepare script"],
          ["Input", "Files selected in the Git index"],
        ],
      },
    ),
    section(
      "Keep checks reproducible",
      "Hooks support the contributor workflow, while explicit check commands make validation visible and repeatable. Inspect a hook failure and correct its cause before retrying.",
      {
        code: ["bash", "git diff --cached --stat\ncorepack pnpm lint\ncorepack pnpm format:check"],
        note: "A hook validates its configured scope; it does not imply every test suite has run.",
      },
    ),
  ],
  Knip: [
    section(
      "Audit the dependency surface",
      "Knip reports candidates such as unused files, exports and dependencies. The result depends on entry points and tooling configuration, especially generated or virtual routes.",
      {
        code: ["bash", "corepack pnpm knip"],
        rows: [
          ["Configuration", "knip.json"],
          ["Root workflow", "qa:deps"],
        ],
      },
    ),
    section(
      "Verify before removing",
      "A statically unused symbol may still be an intentional public export or a build-generated entry. Check package exports and route plugins before deleting a reported candidate.",
      {
        rows: [
          ["Public entry", "package.json exports"],
          ["Generated entry", "Build plugin or route manifest"],
          ["Evidence", "A real consumer or emitted bundle"],
        ],
        note: "Treat reports as review candidates rather than blanket deletion instructions.",
      },
    ),
  ],
  Syncpack: [
    section(
      "Check workspace versions",
      "Syncpack audits dependency declarations across packages. The repository exposes a read-only lint command alongside an explicit version-fix command.",
      {
        code: ["bash", "corepack pnpm syncpack:check"],
        rows: [
          ["Check", "syncpack lint"],
          ["Explicit mutation", "syncpack fix"],
        ],
      },
    ),
    section(
      "Preserve dependency intent",
      "A peer range describes consumer compatibility, while a development dependency selects local tooling. Align versions only when those different responsibilities permit it.",
      {
        rows: [
          ["Peer dependency", "Supported consumer range"],
          ["Development dependency", "Local verification and build tools"],
          ["Workspace dependency", "Another local package"],
        ],
        note: "Version alignment is not a reason to widen a peer contract that has not been tested.",
      },
    ),
  ],
  publint: [
    section(
      "Inspect the published shape",
      "publint checks package metadata against the built package. It helps catch publication problems that a source-only typecheck does not exercise.",
      {
        code: ["bash", "corepack pnpm qa:publint"],
        rows: [
          ["Input", "Built workspace package"],
          ["Focus", "Package entry and publication metadata"],
        ],
      },
    ),
    section(
      "Build before checking",
      "Run the affected library build so the checker can inspect the actual files referenced by exports. Keep public names, output filenames and declaration paths aligned.",
      {
        rows: [
          ["Manifest", "package.json exports"],
          ["Runtime", "Emitted JavaScript"],
          ["Types", "Emitted declaration files"],
        ],
        note: "Metadata checks complement, rather than replace, importing and testing the built API.",
      },
    ),
  ],
  "Are the Types Wrong": [
    section(
      "Check consumer type resolution",
      "Are the Types Wrong inspects how a package's declarations resolve for different module environments. This workspace exposes it through the `attw` verification scripts.",
      {
        code: ["bash", "corepack pnpm qa:attw"],
        rows: [
          ["Package", "@arethetypeswrong/cli"],
          ["Input", "Built package output"],
        ],
      },
    ),
    section(
      "Align runtime and declarations",
      "A valid declaration file is useful only if consumers resolve it alongside the matching runtime export. Review export conditions when ESM and CommonJS consumers behave differently.",
      {
        rows: [
          ["Runtime contract", "Resolved JavaScript entry"],
          ["Type contract", "Matching declaration entry"],
          ["Resolution context", "The consumer's module mode"],
        ],
        note: "Build the package before interpreting resolution diagnostics about its emitted files.",
      },
    ),
  ],
  "GitHub Actions": [
    section(
      "Read checks for the commit",
      "A workflow run belongs to a specific revision and trigger. Review the run associated with the current pull-request head before treating automation as merge evidence.",
      {
        rows: [
          ["Configuration", ".github/workflows"],
          ["Execution", "Jobs and steps"],
          ["Revision", "The run's commit SHA"],
        ],
      },
    ),
    section(
      "Keep validation attributable",
      "A useful check reports the exact command, package scope and failure. Local success can help reproduce a problem, but it should not be presented as a remote workflow result.",
      {
        rows: [
          ["Queued", "Not started"],
          ["In progress", "No final result yet"],
          ["Completed", "Inspect conclusion and job output"],
        ],
        note: "A newly pushed commit requires its own checks even when its parent passed.",
      },
    ),
  ],
};
