import { ArrowRightIcon } from "@kamod-ch/icons/lucide";
import { Button } from "@kamod-ch/ui";
import { withBasePath } from "../../base-path";
import { BlockHeadingLink } from "../../blocks/BlockHeadingLink";
import { LibraryGuideSection } from "../components/LibraryGuideSection";
import { packageDocPages } from "../registry";

const responsibilities: Record<string, { purpose: string; detail: string }> = {
  "hooks-package": {
    purpose: "Reusable behavior",
    detail:
      "Keep state helpers, lifecycle work and browser interactions close to the component that owns them.",
  },
  "icons-package": {
    purpose: "Visual language",
    detail:
      "Give actions a consistent shape with typed SVG components and named imports from your chosen icon family.",
  },
  "i18n-package": {
    purpose: "Language & formatting",
    detail:
      "Connect typed messages and locale-aware formatting, with a Preact adapter for the interface.",
  },
  "signals-package": {
    purpose: "Reactive persistence",
    detail:
      "Keep small preferences across reloads with explicit storage keys, defaults and a chosen storage driver.",
  },
  "state-package": {
    purpose: "Shared transitions",
    detail:
      "Coordinate a domain model with typed actions and reducers when several parts of the app work with the same data.",
  },
};

/** One navigable directory replaces the repeated package cards and comparison table. */
export function PackageDirectory() {
  return (
    <nav aria-label="All packages" class="package-directory">
      {[...packageDocPages]
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((doc) => {
          const entry = responsibilities[doc.slug];
          return (
            <a
              key={doc.slug}
              href={withBasePath(`/docs/${doc.slug}/installation`)}
              class="package-directory-row"
            >
              <span class="package-directory-identity">
                <strong>{doc.title}</strong>
                <code>{doc.packagePath}</code>
              </span>
              <span class="package-directory-summary">
                <span>{entry?.purpose ?? doc.usageLabel}</span>
                <span>{entry?.detail ?? doc.sections[0]?.text}</span>
              </span>
              <ArrowRightIcon size={16} aria-hidden="true" />
            </a>
          );
        })}
    </nav>
  );
}

const foundations = [
  {
    id: "connect-styles",
    title: "Connect your styles",
    action: "CSS setup",
    href: "/docs/theming/css-setup",
    description: (
      <>
        When your example uses <code>@kamod-ch/ui</code>, keep its global stylesheet and Tailwind
        source detection in place. Behavior packages do not replace the interface’s CSS setup.
      </>
    ),
  },
  {
    id: "customize-theme",
    title: "Customize the theme",
    action: "Theming & Tailwind",
    href: "/docs/theming/installation",
    description: (
      <>
        Use shared semantic tokens for colors, surfaces and focus indicators. Check the same
        interaction in <code>light</code> and <code>dark</code> before adding local overrides.
      </>
    ),
  },
  {
    id: "explore-icons",
    title: "Explore the icon library",
    action: "Icons guide",
    href: "/docs/icons-package/installation",
    description: (
      <>
        Choose one icon family for related actions and let it inherit <code>currentColor</code>.
        Give icon-only controls an accessible name that describes the action.
      </>
    ),
  },
];

/** Package-specific next steps retain existing guide anchors without repeating large resource cards. */
export function PackageFoundations() {
  return (
    <LibraryGuideSection id="library-guides-title" title="Connect the behavior to your interface">
      <div class="block-guide-prose" id="library-guides">
        <p>
          <strong>The package owns a capability; your interface gives it context.</strong> Pair
          behavior with the <a href={withBasePath("/docs/components")}>component library</a>, or
          explore <a href={withBasePath("/blocks")}>complete blocks</a> to see how navigation, forms
          and content fit together. Keep these shared foundations in place as you integrate.
        </p>
      </div>
      <div class="package-foundations">
        {foundations.map(({ id, title, description, href, action }) => (
          <section key={id} class="package-foundation" aria-labelledby={id}>
            <div class="block-guide-prose">
              <h3 id={id} tabIndex={-1}>
                <BlockHeadingLink id={id}>{title}</BlockHeadingLink>
              </h3>
              <p>{description}</p>
            </div>
            <Button class="docs-icon-button" variant="ghost" size="sm" href={withBasePath(href)}>
              {action}
              <ArrowRightIcon size={14} aria-hidden="true" />
            </Button>
          </section>
        ))}
      </div>
      <div class="block-guide-prose package-source-note">
        <h3 id="library-source-title" tabIndex={-1}>
          <BlockHeadingLink id="library-source-title">Work with the source</BlockHeadingLink>
        </h3>
        <p>
          Each <a href="#library-items">package guide</a> links to its own repository, API and
          package listing. Compare the version in <code>package.json</code> with the documentation
          before adapting an example. For a bug report, include that version, the import path and
          the smallest reproduction that shows the behavior.
        </p>
        <p>
          Read the{" "}
          <a href="https://github.com/kamod-ch/kamod-ui/tree/main/packages/core">
            UI implementation
          </a>{" "}
          for component behavior, or browse{" "}
          <a href="https://github.com/kamod-ch">Kamod’s repositories</a> for the package that owns
          the issue. <strong>Keep fixes with the responsibility they belong to.</strong>
        </p>
      </div>
    </LibraryGuideSection>
  );
}
