/** Home-page destinations stay explicit and independent of demo-bearing registries. */
export const libraryEntries = [
  {
    title: "Components",
    href: "/docs/components",
    label: "Start with a control",
    text: "Buttons, inputs, navigation and feedback. Learn the API, try the variants, then compose.",
  },
  {
    title: "Blocks",
    href: "/blocks",
    label: "Start with a layout",
    text: "Application shells, sidebars and authentication screens with source you can adapt.",
  },
  {
    title: "Forms",
    href: "/docs/forms",
    label: "Connect the interaction",
    text: "Labels, validation and submission—from a native field to a coordinated schema form.",
  },
  {
    title: "Packages",
    href: "/docs/packages",
    label: "Add a capability",
    text: "Focused tools for icons, hooks, reactive persistence, shared state and localization.",
  },
];

export const componentEntries = [
  { title: "Button", slug: "button", text: "Make the next action clear." },
  { title: "Input", slug: "input", text: "Give every field a useful label." },
  { title: "Dialog", slug: "dialog", text: "Focus on one decision at a time." },
  { title: "Tabs", slug: "tabs", text: "Organize related views." },
  { title: "Accordion", slug: "accordion", text: "Reveal detail when it is needed." },
  { title: "Table", slug: "table", text: "Give structured data a readable home." },
];

export const guideEntries = [
  {
    title: "Install & Connect CSS",
    href: "/docs/theming/css-setup",
    tag: "Set Up",
    text: "Load the shared stylesheet and make Tailwind source detection explicit. Check one styled component before building the rest of the screen.",
  },
  {
    title: "Choose Tokens & Presets",
    href: "/docs/theming/token-overrides",
    tag: "Theme",
    text: "Pair backgrounds with foregrounds, refine your theme centrally, and keep the same interface readable in light and dark mode.",
  },
  {
    title: "Compose Component Styles",
    href: "/blocks/styles",
    tag: "Refine",
    text: "Choose a clear hierarchy of actions, consistent spacing and useful surfaces. Change the composition before adding one-off overrides.",
  },
  {
    title: "Combine Classes with cn",
    href: "/docs/cn/installation",
    tag: "Compose",
    text: "Combine base styles, conditional state and consumer overrides. Learn how clsx and tailwind-merge work together in the utility.",
  },
  {
    title: "Bring a Block into Your App",
    href: "/blocks/getting-started",
    tag: "Integrate",
    text: "Read the full file tree, copy supporting files, and replace example navigation and data with your application's own boundaries.",
  },
  {
    title: "Theme a Complete Layout",
    href: "/blocks/theming",
    tag: "Connect",
    text: "Carry the same tokens into sidebars, overlays and copied source. Check the finished screen rather than an isolated component.",
  },
];

export const ecosystemEntries = [
  {
    name: "Icons",
    package: "icons",
    repo: "kamod-icons",
    guide: "icons-package",
    text: "Typed SVG components. Keep a consistent icon family and let color follow the surrounding interface.",
  },
  {
    name: "Hooks",
    package: "hooks",
    repo: "kamod-hooks",
    guide: "hooks-package",
    text: "Reusable behavior for Preact: state helpers, browser interactions and lifecycle work close to its owner.",
  },
  {
    name: "Signals",
    package: "signals",
    repo: "kamod-signals",
    guide: "signals-package",
    text: "Persist small reactive values with explicit defaults and storage choices. Useful for preferences across visits.",
  },
  {
    name: "State",
    package: "state",
    repo: "kamod-state",
    guide: "state-package",
    text: "Typed actions and reducers for shared domain state. Make transitions explicit as a feature grows.",
  },
  {
    name: "i18n",
    package: "i18n",
    repo: "kamod-i18n",
    guide: "i18n-package",
    text: "Typed messages and locale-aware formatting, with a Preact adapter for translated interfaces.",
  },
  {
    name: "Motion",
    package: "motion",
    repo: "kamod-motion",
    text: "Animation tools for Preact. Introduce movement where it clarifies an interaction and respect reduced-motion preferences.",
  },
  {
    name: "Charts",
    package: "charts",
    repo: "kamod-charts",
    text: "Data visualization for Preact. Explore the dedicated repository for chart APIs, examples and setup.",
  },
  {
    name: "PreactPress",
    package: "preactpress",
    repo: "preactpress",
    text: "Documentation sites built with Preact—the publishing foundation behind the guide you are reading.",
  },
];

export const footerGroups = [
  {
    title: "Learn & Build",
    links: [
      ["Getting Started", "/docs/getting-started"],
      ["Component Library", "/docs/components"],
      ["Block Collections", "/blocks"],
      ["Forms & Validation", "/docs/forms"],
      ["Companion Packages", "/docs/packages"],
    ],
  },
  {
    title: "Practical Guides",
    links: [
      ["CSS Setup", "/docs/theming/css-setup"],
      ["Theme Tokens", "/docs/theming/token-overrides"],
      ["Component Styles", "/blocks/styles"],
      ["cn Utility", "/docs/cn/installation"],
      ["Formisch Integration", "/docs/formisch/installation"],
    ],
  },
  {
    title: "Source & Resources",
    links: [
      ["UI Repository", "https://github.com/kamod-ch/kamod-ui"],
      ["Report an Issue", "https://github.com/kamod-ch/kamod-ui/issues"],
      ["Releases", "https://github.com/kamod-ch/kamod-ui/releases"],
      ["License", "https://github.com/kamod-ch/kamod-ui/blob/main/LICENSE"],
      ["All Kamod Repositories", "https://github.com/orgs/kamod-ch/repositories"],
    ],
  },
];
