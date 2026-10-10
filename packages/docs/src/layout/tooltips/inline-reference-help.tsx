import { brandReferenceHelp } from "../../docs/components/brand/brand-references";
import { kamodReferenceHref } from "../../docs/components/brand/kamod-references";
import {
  componentReferenceNames,
  inlineReference,
} from "../../docs/components/inline-reference-catalog";
import { InlineCode } from "../../docs/components/PathDisplay";
import { packageApiReferences } from "../../docs/components/package-api-references";
import type { InlineCodeExplanation } from "./inline-code-glossary";

const repository = "https://github.com/kamod-ch/kamod-ui/tree/main/";
const componentNotes: Record<string, string> = {
  button: "Trigger an action, submit a form, or present a link with button styling.",
  input:
    "Collect a single-line value; pair the control with a visible label and validation feedback.",
  textarea: "Collect longer, multiline text with a label and useful supporting instructions.",
  dialog: "Present a focused task in a modal, with managed focus and keyboard dismissal.",
  sidebar: "Compose application navigation with responsive panels, groups and collapse controls.",
  card: "Group related content and actions inside a shared surface.",
  accordion: "Organize related content into individually expandable sections.",
  tabs: "Switch between related panels without leaving the current page.",
  select: "Choose a value from a list of options using keyboard-accessible controls.",
  field: "Group a control, its label, supporting text and validation feedback.",
  tooltip: "Add concise context to a trigger on hover or keyboard focus.",
};
const collectionNotes: Record<string, { path: string; description: string }> = {
  "/docs/components": {
    path: "packages/core/src/components",
    description:
      "Individual Preact UI controls. Browse live variants, installation instructions and component APIs before composing a feature.",
  },
  "/blocks": {
    path: "packages/blocks/src",
    description:
      "Complete layouts composed from Kamod controls. Preview each variant and inspect its source tree, setup prompt and integration guide.",
  },
  "/docs/packages": {
    path: "packages",
    description:
      "Focused tools for icons, hooks, state, persistence and more. Compare responsibilities and follow each package guide; companion repositories are linked there too.",
  },
  "/docs/forms": {
    path: "packages/docs/src/docs/forms",
    description:
      "Build forms from labeled controls, validation feedback and submission state. Start with native behavior, then explore Formisch for more complex flows.",
  },
};
const packageNames: Record<string, string> = {
  "/docs/icons-package/installation": "@kamod-ch/icons",
  "/docs/hooks-package/installation": "@kamod-ch/hooks",
  "/docs/signals-package/installation": "@kamod-ch/signals",
  "/docs/state-package/installation": "@kamod-ch/state",
  "/docs/i18n-package/installation": "@kamod-ch/i18n",
  "/docs/ui-motion/installation": "@kamod-ch/ui-motion",
  "/docs/formisch/installation": "@formisch/preact",
};

/** Lightweight metadata only: opening a hint never loads a component or block preview. */
export function inlineReferenceHelp(
  term: string,
  destination?: string | null,
): InlineCodeExplanation | undefined {
  const reference = inlineReference(term);
  if (!reference) return;
  const { label, href, kind } = reference;
  if (kind === "api")
    return {
      path: { label, href },
      description: packageApiReferences[label].description,
      href,
      linkLabel: "Read the implementation on GitHub",
    };
  if (label === "cn")
    return {
      path: { label: "@kamod-ch/ui/utils", href: kamodReferenceHref("@kamod-ch/ui/utils")! },
      description:
        "Combine conditional class names and resolve recognized Tailwind utility conflicts.",
    };
  // An authored Field link may refer to Formisch, for example, rather than the
  // identically named core component. Preserve that meaning as well as its URL.
  if (kind === "component" && destination) {
    const actual = new URL(destination, "https://docs.local");
    if (!actual.pathname.endsWith(href) || actual.origin !== "https://docs.local") {
      if (actual.pathname.endsWith("/docs/formisch/installation"))
        return inlineReferenceHelp("FormischField");
      return {
        path: { label: destination, href: destination },
        description: (
          <>
            <strong>{label}.</strong> This authored reference opens the linked guide or example.
            Follow its instructions for the API used in this context.
          </>
        ),
      };
    }
  }
  const slug = href.match(/^\/docs\/([^/]+)\/installation$/)?.[1];
  if (kind === "component" && slug && Object.hasOwn(componentReferenceNames, slug)) {
    const path = `@/components/kamod-ui/${slug}`;
    return {
      path: { label: path, href: kamodReferenceHref(path)! },
      description: (
        <>
          <strong>{label}.</strong>{" "}
          {componentNotes[slug] ??
            "A composable Kamod UI component. Its guide covers installation, examples and supported props."}{" "}
          This is a local-copy alias; package users can import from{" "}
          <InlineCode>@kamod-ch/ui</InlineCode>.
        </>
      ),
      href,
      linkLabel: "Open Component Guide",
    };
  }
  if (kind === "block") {
    const path = `packages/blocks/src/${href.slice("/blocks/".length)}`;
    return {
      path: { label: path, href: repository + path },
      description: (
        <>
          <strong>{label}.</strong> A reusable layout composed from Kamod components. Its source
          folder contains the variant; the detail page also gathers supporting files and setup
          instructions.
        </>
      ),
      href,
      linkLabel: "Preview and Set Up This Block",
    };
  }
  const collection = collectionNotes[href];
  if (collection)
    return {
      path: { label: collection.path, href: repository + collection.path },
      description: (
        <>
          <strong>{label}.</strong> {collection.description}
        </>
      ),
      href,
      linkLabel: "Explore the Collection",
    };
  const packageName = packageNames[href.split("#")[0]];
  const packageHelp = packageName ? brandReferenceHelp(packageName) : undefined;
  if (packageName)
    return {
      path: { label: packageName, href: packageHelp?.href ?? href },
      description:
        packageHelp?.description ??
        "Formisch’s Preact integration coordinates field values, validation and submission. Follow the guide to connect it to Kamod controls.",
      href,
      linkLabel: "Open Package Guide",
    };
  return {
    path: { label: href, href },
    description: (
      <>
        <strong>{label}.</strong>{" "}
        {kind === "guide" || href.startsWith("/")
          ? "Follow this guide for setup details, examples and related documentation."
          : "Open the project’s reference for its APIs, installation and usage guidance."}
      </>
    ),
  };
}
