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
    label: "Theming & Tailwind",
    title: "One theme, across your entire application",
    description:
      "Connect Tailwind CSS v4, semantic tokens and Kamod’s theme runtime. Configure presets and color schemes, understand the sidebar’s own tokens, and keep the first render consistent with the rest of your app.",
    focus: "Configure · Customize · Check",
  },
] as const;
