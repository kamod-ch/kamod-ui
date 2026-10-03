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
    title: "Apply the foundation to a copied layout",
    description:
      "Already have your shared theme configured? Check copied-source discovery, sidebar and popover surfaces, and the difference between showcase preferences and your application settings.",
    nextLabel: "Theming blocks",
    nextPath: "/blocks/theming",
  },
  theming: {
    label: "Theming blocks",
    title: "Put your theme to work in a complete layout",
    description:
      "Choose a block and try it with your app’s tokens, real content and both color schemes. Compare navigation, forms and content surfaces before refining the final details.",
    nextLabel: "Available collections",
    nextPath: "/blocks#library-items",
  },
};

const sharedTheming = {
  title: "Carry those design decisions across your app",
  description:
    "Start with the shared Theming & Tailwind reference for components and blocks. Connect Tailwind once, define semantic token pairs, choose a preset and configure Light, Dark or System. This is the place for global CSS, theme controls and first-render setup.",
  nextLabel: "Theming & Tailwind",
  nextPath: "/docs/theming/installation",
};

type NextStep = Pick<
  (typeof endings)["styles"],
  "title" | "description" | "nextLabel" | "nextPath"
>;

function NextStepSection({
  content,
  id,
  eyebrow,
}: {
  content: NextStep;
  id: string;
  eyebrow: string;
}) {
  return (
    <section class="blocks-page-ending-next" aria-labelledby={id}>
      <div>
        <p class="blocks-page-ending-eyebrow">{eyebrow}</p>
        <p class="blocks-page-ending-title" id={id}>
          {content.title}
        </p>
        <p class="blocks-page-ending-description">{content.description}</p>
      </div>
      <a class="blocks-page-ending-link" href={withBasePath(content.nextPath)}>
        {content.nextLabel}
        <ArrowRightIcon size={15} aria-hidden="true" />
      </a>
    </section>
  );
}

/** Suggests contextual next steps; shared styling leads to the foundation before block-specific checks. */
export function BlockPageEnding({ page }: { page: keyof typeof endings }) {
  const content = endings[page];
  return (
    <footer class="blocks-page-ending" aria-label={`${content.label} closing links`}>
      {page === "styles" && (
        <NextStepSection
          content={sharedTheming}
          id="styles-theme-foundation"
          eyebrow="The shared foundation"
        />
      )}
      <NextStepSection
        content={content}
        id={`${page}-next-step`}
        eyebrow={page === "styles" ? "For complete layouts" : "A useful next step"}
      />
    </footer>
  );
}
