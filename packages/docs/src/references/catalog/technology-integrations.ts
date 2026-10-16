import { technologySection as section, type TechnologySections } from "./technology-section-data";

/** Integration choices named in project prose; these profiles do not imply an installed framework. */
export const integrationSections: TechnologySections = {
  "Next.js": [
    section(
      "Identify the framework boundary",
      "Next.js is a React application framework. Its routing, rendering and server/client boundaries belong to that framework, while this documentation site runs on PreactPress.",
      {
        rows: [
          ["Framework", "Next.js"],
          ["Renderer integration", "React"],
          ["Current docs host", "PreactPress"],
        ],
      },
    ),
    section(
      "Adapt the application contract",
      "A copied example may assume framework-specific links, image components or server conventions. Keep reusable Kamod block APIs independent of those choices and supply routing through the consumer.",
      {
        rows: [
          ["Reusable block", "Data and explicit navigation callbacks"],
          ["Application", "Router and service integration"],
          ["Verification", "Renderer, focus and hydration behavior"],
        ],
        note: "Do not add a React framework dependency merely to reproduce the appearance of an example.",
      },
    ),
  ],
  Figma: [
    section(
      "Translate design into roles",
      "A design file describes visual relationships. Map colors, type and spacing to the project's semantic tokens before introducing new literal values.",
      {
        rows: [
          ["Surface and text", "Paired background and foreground tokens"],
          ["Emphasis", "Primary, secondary and muted roles"],
          ["Shape", "Existing radius and spacing scales"],
        ],
        href: "/docs/theming/installation",
      },
    ),
    section(
      "Specify interaction states",
      "A static frame does not define keyboard behavior, focus order or loading feedback. Review those states alongside light, dark and narrow layouts before treating a design as complete.",
      {
        rows: [
          ["Default", "Readable content and discoverable actions"],
          ["Interaction", "Focus, hover, expanded and disabled states"],
          ["Async", "Loading, empty, success and failure states"],
        ],
        note: "Keep the component's accessible behavior when translating a visual reference.",
      },
    ),
  ],
  Astro: [
    section(
      "Choose the interactive island",
      "Astro can combine static page content with selectively interactive components. A component's hydration boundary determines when browser behavior becomes available.",
      {
        rows: [
          ["Static content", "Delivered page markup"],
          ["Interactive island", "A configured client-rendered component"],
          ["Renderer", "The integration selected by the application"],
        ],
      },
    ),
    section(
      "Keep one owner per island",
      "A Kamod composition needs a Preact-compatible boundary and its global theme styles. State, overlay ownership and focus handling should remain inside the deliberate integration.",
      {
        rows: [
          ["Theme", "Import the chosen global stylesheet once"],
          ["State", "Owned by the interactive composition"],
          ["Overlays", "Test portals and focus across the island boundary"],
        ],
        note: "This checkout does not require Astro to run or document its Preact components.",
      },
    ),
  ],
  Remix: [
    section(
      "Read the selected version",
      "Remix is a web framework with its own application and routing contracts. Use the documentation for the version in the consumer rather than assuming an external example matches this project.",
      {
        rows: [
          ["Framework concern", "Routes and application data flow"],
          ["Component concern", "Props, state and interaction"],
          ["This documentation", "PreactPress"],
        ],
      },
    ),
    section(
      "Keep blocks framework-independent",
      "Pass navigation and application state into reusable compositions. A block should not require a framework-specific route module or authentication implementation to render its layout.",
      {
        rows: [
          ["Input", "Navigation entries and current path"],
          ["Callback", "Consumer-owned navigation behavior"],
          ["Boundary", "The application's chosen router"],
        ],
        note: "Verify the renderer integration before adopting a framework's component example.",
      },
    ),
  ],
  Svelte: [
    section(
      "Recognize compiled components",
      "Svelte compiles its component format into application code. A Svelte component is not interchangeable with a Preact component merely because both render HTML.",
      {
        rows: [
          ["Source format", "Svelte components"],
          ["Kamod source", "Preact TSX"],
          ["Shared layer", "HTML semantics and CSS design roles"],
        ],
      },
    ),
    section(
      "Port the visual contract",
      "When a design reference comes from Svelte, reuse its layout ideas while keeping Kamod's existing state, focus and overlay primitives. Translate the interaction rather than copying incompatible component syntax.",
      {
        rows: [
          ["Portable", "Content hierarchy, spacing and semantic colors"],
          ["Adapt", "Events, state and child composition"],
          ["Retain", "Preact lifecycle and accessible behavior"],
        ],
        note: "A separate renderer boundary is an application integration choice, not a default block dependency.",
      },
    ),
  ],
  Vue: [
    section(
      "Keep component models distinct",
      "Vue provides its own component and reactivity APIs. Kamod implementations use Preact props, hooks and JSX types, so examples need a deliberate translation at that boundary.",
      {
        rows: [
          ["Vue example", "Its component and reactivity model"],
          ["Kamod implementation", "Preact component model"],
          ["Common output", "Browser HTML and CSS"],
        ],
      },
    ),
    section(
      "Translate state ownership",
      "A port should preserve which value controls the interaction and how changes reach the caller. Reuse a Kamod controlled/uncontrolled API rather than adding a parallel state model.",
      {
        rows: [
          ["Value", "The selected or open state"],
          ["Change callback", "How the caller learns about an update"],
          ["Lifecycle", "Cleanup owned by the Preact view"],
        ],
        note: "Template syntax and framework-specific directives do not become valid TSX by copying them.",
      },
    ),
  ],
  YAML: [
    section(
      "Read structured configuration",
      "YAML uses indentation to describe mappings and sequences. This workspace uses it for its package inventory and Git-hook configuration, among other tool inputs.",
      {
        code: ["yaml", "packages:\n  - packages/*", "Workspace package pattern"],
        rows: [
          ["Workspace", "pnpm-workspace.yaml"],
          ["Hooks", "lefthook.yml"],
        ],
      },
    ),
    section(
      "Keep syntax and schema separate",
      "Valid YAML can still contain an invalid workflow or tool setting. Check the consuming tool's schema and preserve indentation when changing nested values.",
      {
        rows: [
          ["Syntax", "Mappings, sequences and scalar values"],
          ["Schema", "Keys and values accepted by the consuming tool"],
          ["Review", "The exact configuration diff"],
        ],
        note: "Quote values when their intended string meaning would otherwise be ambiguous.",
      },
    ),
  ],
  "Radix UI": [
    section(
      "Distinguish inspiration and runtime",
      "The docs mention Radix-style patterns, but Kamod supplies its own Preact interaction primitives. Similar API names do not establish a Radix dependency.",
      {
        rows: [
          ["Reference", "An interaction or composition pattern"],
          ["Kamod runtime", "Existing Preact components"],
          ["Dependency evidence", "The package manifest and imports"],
        ],
        href: "/docs/components",
      },
    ),
    section(
      "Reuse established behavior",
      "Port a reference by composing the existing Kamod trigger, content and state APIs. Verify keyboard operation, focus restoration and dismissal rather than introducing another overlay implementation.",
      {
        rows: [
          ["Trigger", "The existing accessible control"],
          ["Content", "The matching Kamod panel or overlay"],
          ["State", "One controlled or uncontrolled owner"],
        ],
        note: "New native Preact blocks should not add React-only Radix dependencies.",
      },
    ),
  ],
  Sass: [
    section(
      "Identify the stylesheet format",
      "Sass is a stylesheet language compiled to CSS. SCSS uses CSS-like braces; recognizing an `.scss` file does not mean the current app has enabled a Sass compiler.",
      {
        rows: [
          ["Source", ".scss or .sass"],
          ["Compiler output", "CSS"],
          ["Current theme setup", "CSS imports and semantic custom properties"],
        ],
        href: "/docs/theming/installation#css-setup",
      },
    ),
    section(
      "Choose runtime tokens deliberately",
      "Sass variables are resolved during compilation, while CSS custom properties remain available to the browser. Theme switching needs the runtime token contract used by Kamod components.",
      {
        code: [
          "css",
          ":root { --primary: #a21caf; }\n.action { background: var(--primary); }",
          "Runtime CSS token illustration",
        ],
        note: "Adding a preprocessor is unnecessary when the existing CSS and Tailwind pipeline already expresses the requirement.",
      },
    ),
  ],
};
