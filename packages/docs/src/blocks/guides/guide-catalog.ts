/** Lightweight guide metadata shared by routes and both navigation layouts. */
export const blockGuides = [
  {
    slug: "getting-started",
    label: "Getting Started",
    title: "From a Block Preview to Your Application",
    description:
      "Choose a composition, bring its source into your Preact project, and connect it to your routes, data and services. This guide takes you from the first copy to a checked, working screen.",
    focus: "Install · Integrate · Verify",
  },
  {
    slug: "styles",
    label: "Component Styles",
    title: "Make the Composition Feel Like Your Product",
    description:
      "Adapt a block’s spacing, hierarchy and component treatments without losing its behavior. Learn which changes belong in the composition, which belong in component props, and which belong in your theme.",
    focus: "Compose · Refine · Reuse",
  },
  {
    slug: "theming",
    label: "Theming Blocks",
    title: "Bring Your App’s Theme into Every Block",
    description:
      "Apply the shared theme foundation to copied layouts. Check source discovery, sidebar surfaces, preview preferences and complete screens in both color schemes.",
    focus: "Configure · Customize · Check",
  },
] as const;
