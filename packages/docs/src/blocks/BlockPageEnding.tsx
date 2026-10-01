import { ArrowRightIcon } from "@kamod-ch/icons/lucide";
import { withBasePath } from "../base-path";

const endings = {
  forms: {
    label: "Forms overview",
    title: "Build one complete form, from input to recovery",
    description:
      "Follow the Formisch guide for schema-backed fields and examples. Connect a real submission handler, keep errors understandable and verify keyboard navigation before shipping.",
    nextLabel: "Explore Formisch",
    nextPath: "/docs/formisch/installation",
  },
  packages: {
    label: "Packages overview",
    title: "Add one capability and verify it in your app",
    description:
      "Choose the package that solves your next task, follow its installation guide and check the result in production. Compose its behavior with the same Kamod UI components you already use.",
    nextLabel: "Explore components",
    nextPath: "/docs/components",
  },
  components: {
    label: "Components overview",
    title: "Bring the pieces together in a complete screen",
    description:
      "Choose a block to see components working together, then adapt the composition to your routes, data and theme. Keep the same primitives and build on the interactions you already know.",
    nextLabel: "Browse complete layouts",
    nextPath: "/blocks",
  },
  overview: {
    label: "Blocks overview",
    title: "Turn a preview into your first working screen",
    description:
      "Choose a published variant, inspect its source and follow the setup guide. Start with the complete composition, then connect your own routes and data.",
    nextLabel: "Getting started",
    nextPath: "/blocks/getting-started",
  },
  "getting-started": {
    label: "Getting started",
    title: "Make the working screen feel like your product",
    description:
      "With the source connected, refine spacing, typography and action hierarchy. Keep the shared components’ behavior while adapting the details to your content.",
    nextLabel: "Component styles",
    nextPath: "/blocks/styles",
  },
  styles: {
    label: "Component styles",
    title: "Carry those design decisions across your app",
    description:
      "Move shared colors and surfaces into semantic tokens. Connect your stylesheet and theme preset so each composition stays consistent in light and dark mode.",
    nextLabel: "Theming & Tailwind",
    nextPath: "/blocks/theming",
  },
  theming: {
    label: "Theming & Tailwind",
    title: "Put your theme to work in a complete layout",
    description:
      "Choose a block and try it with your app’s tokens, real content and both color schemes. Compare navigation, forms and content surfaces before refining the final details.",
    nextLabel: "Available collections",
    nextPath: "/blocks#library-items",
  },
};

/** Suggests a contextual next step at the end of an overview or guide. */
export function BlockPageEnding({ page }: { page: keyof typeof endings }) {
  const content = endings[page];
  return (
    <footer class="blocks-page-ending" aria-label={`${content.label} closing links`}>
      <div class="blocks-page-ending-next">
        <div>
          <p class="blocks-page-ending-eyebrow">A useful next step</p>
          <p class="blocks-page-ending-title">{content.title}</p>
          <p class="blocks-page-ending-description">{content.description}</p>
        </div>
        <a class="blocks-page-ending-link" href={withBasePath(content.nextPath)}>
          {content.nextLabel}
          <ArrowRightIcon size={15} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
