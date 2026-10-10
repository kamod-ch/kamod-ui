import type { ComponentChildren } from "preact";
import { withBasePath } from "../../base-path";
import { brandReferenceHelp } from "../../docs/components/brand/brand-references";
import { inlineReferenceHelp } from "./inline-reference-help";

export type InlineCodeExplanation = {
  description: ComponentChildren;
  /** Optional structured guidance below the short introduction. */
  details?: ComponentChildren;
  href?: string;
  linkLabel?: string;
  path?: { label: string; href?: string };
};

const explain = (
  description: ComponentChildren,
  href?: string,
  linkLabel?: string,
): InlineCodeExplanation => ({ description, href, linkLabel });

/** Exact, authored meanings only: never guess the purpose of arbitrary identifiers or filenames. */
const glossary: Record<string, InlineCodeExplanation> = {
  cn: explain(
    <>
      <strong>Combine Class Names.</strong> Joins conditional classes and resolves recognized
      Tailwind conflicts. Put overrides last.
    </>,
    "/docs/cn/installation",
    "Explore cn",
  ),
  clsx: explain(
    "Combines strings, arrays and conditional class names. It does not remove conflicting Tailwind utilities.",
    "/docs/cn/installation#clsx-vs-cn",
    "Compare with cn",
  ),
  "tailwind-merge": explain(
    "Resolves recognized Tailwind utility conflicts so intended overrides can replace defaults.",
    "/docs/cn/installation#override-defaults",
    "See Override Examples",
  ),
  class: explain(
    <>
      The element’s CSS class names. Kamod components accept <code>class</code> for styling
      overrides.
    </>,
    "/docs/cn/installation#preact-component",
    "Compose Classes",
  ),
  className: explain(
    <>
      Often a local name for a <code>class</code> value. Kamod’s public styling prop is{" "}
      <code>class</code>.
    </>,
    "/docs/cn/installation#preact-component",
    "See the Pattern",
  ),
  children: explain("Content placed between a component’s opening and closing tags."),
  asChild: explain(
    "Applies the component’s behavior and styling to its child element instead of adding a separate element.",
  ),
  href: explain("The destination of a link: a page, URL or section anchor."),
  htmlFor: explain(
    <>
      Connects a label to the input with the matching <code>id</code>.
    </>,
    "/docs/label/installation",
    "Label Guide",
  ),
  disabled: explain(
    "Prevents interaction with a supported control. A disabled-looking style alone does not disable it.",
  ),
  required: explain(
    "Marks a form field as needing a value before valid submission.",
    "/docs/forms#form-structure",
    "Form Structure",
  ),
  "aria-label": explain(
    "Gives an element an accessible name, especially when its visible content is only an icon.",
  ),
  "aria-labelledby": explain(
    "Uses the text of one or more elements, identified by their IDs, as the accessible name.",
  ),
  "aria-describedby": explain(
    "Connects an element to supporting instructions or an error message using element IDs.",
  ),
  "aria-invalid": explain(
    "Tells assistive technology that a field’s current value is invalid. Pair it with a useful error message.",
    "/docs/forms#form-structure",
    "Form Structure",
  ),
  "aria-hidden": explain(
    "Hides decorative content from assistive technology. Do not apply it to a focusable control.",
  ),
  "aria-expanded": explain(
    "Reports whether a control’s associated content is currently expanded or collapsed.",
  ),
  "aria-pressed": explain("Reports whether a toggle button is currently pressed."),
  'aria-current="page"': explain("Identifies the current page in a set of navigation links."),
  useState: explain("Keeps a component’s local state and provides a function to update it."),
  useEffect: explain(
    "Runs an effect after rendering. Return cleanup for subscriptions, timers or other ongoing work.",
  ),
  useMemo: explain("Reuses a calculated value while its dependencies stay the same."),
  "import type": explain("Imports a TypeScript type without adding a runtime import."),
  ComponentChildren: explain(
    "Preact’s type for renderable content, such as elements, text, arrays or null.",
  ),
  ClassValue: explain(
    <>
      An input accepted by <code>clsx</code> and{" "}
      <a href={withBasePath("/docs/cn/installation")}>
        <code>cn</code>
      </a>
      , including class strings, arrays and conditional object maps.
    </>,
  ),
  "package.json": explain("Lists a project’s dependencies, scripts and package metadata."),
  ":root": explain(
    "Selects the document’s root element, often used to define shared CSS variables.",
    "/docs/theming/token-overrides",
    "Customize Tokens",
  ),
  currentColor: explain(
    "Uses the element’s current text color, so borders or icons can follow it.",
  ),
  "@theme": explain(
    "Defines Tailwind theme values that can be used to generate utilities.",
    "/docs/theming/token-overrides",
    "Customize Tokens",
  ),
  "--primary": explain(
    "The theme’s primary color token. Pair it with a suitable foreground color.",
    "/docs/theming/token-overrides",
    "Customize Tokens",
  ),
  "--background": explain(
    "The theme token for the main page surface.",
    "/docs/theming/token-overrides",
    "Customize Tokens",
  ),
  "--foreground": explain(
    "The theme token for text on the main page surface.",
    "/docs/theming/token-overrides",
    "Customize Tokens",
  ),
  "--card": explain(
    "The theme token for card surfaces.",
    "/docs/theming/token-overrides",
    "Customize Tokens",
  ),
  "--radius": explain(
    "The shared base value used for rounded corners.",
    "/docs/theming/token-overrides",
    "Customize Tokens",
  ),
  "bg-primary": explain(
    <>
      Uses the theme’s <code>--primary</code> color as a background.
    </>,
    "/docs/theming/token-overrides",
    "Customize Tokens",
  ),
  "bg-card": explain(
    <>
      Uses the card surface color. Pair it with <code>text-card-foreground</code>.
    </>,
    "/docs/theming/token-overrides",
    "Customize Tokens",
  ),
  "text-card-foreground": explain(
    "Uses the text color intended for the card surface.",
    "/docs/theming/token-overrides",
    "Customize Tokens",
  ),
  "border-border": explain(
    "Uses the theme’s standard border color.",
    "/docs/theming/token-overrides",
    "Customize Tokens",
  ),
  "@formisch/preact": explain(
    "Formisch’s Preact integration for form values, validation and submission.",
    "/docs/formisch/installation",
    "Formisch Guide",
  ),
  Formisch: explain(
    "Coordinates form values, validation and submission while Kamod supplies the controls.",
    "/docs/formisch/installation",
    "Formisch Guide",
  ),
  valibot: explain(
    "Defines schemas that validate data and provide inferred TypeScript types.",
    "/docs/formisch/installation",
    "Schema-based Forms",
  ),
};

/** A few explicit spelling aliases preserve authored text, including brand version labels. */
export function inlineCodeExplanation(
  term: string,
  destination?: string | null,
): InlineCodeExplanation | undefined {
  const brand = brandReferenceHelp(term);
  if (brand) return brand;
  const key = term === "cn()" ? "cn" : term === "twMerge" ? "tailwind-merge" : term;
  const reference = inlineReferenceHelp(term, destination);
  return Object.hasOwn(glossary, key)
    ? { ...glossary[key], ...(reference?.path && { path: reference.path }) }
    : reference;
}
