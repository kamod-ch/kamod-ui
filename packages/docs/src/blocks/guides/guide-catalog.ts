/** Lightweight guide metadata shared by routes and both navigation layouts. */
export const blockGuides = [
  {
    slug: "getting-started",
    label: "Getting started",
    title: "From a block preview to your application",
    description:
      "Choose a composition, bring its source into your Preact project, and connect it to your routes, data and services. This guide takes you from the first copy to a checked, working screen.",
    focus: "Install · Integrate · Verify",
  },
  {
    slug: "styles",
    label: "Component styles",
    title: "Make the composition feel like your product",
    description:
      "Adapt a block’s spacing, hierarchy and component treatments without losing its behavior. Learn which changes belong in the composition, which belong in component props, and which belong in your theme.",
    focus: "Compose · Refine · Reuse",
  },
  {
    slug: "theming",
    label: "Theming blocks",
    title: "Bring your app’s theme into every block",
    description:
      "Apply the shared theme foundation to copied layouts. Check source discovery, sidebar surfaces, preview preferences and complete screens in both color schemes.",
    focus: "Configure · Customize · Check",
  },
] as const;
