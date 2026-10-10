import type { ComponentChildren } from "preact";
import { withBasePath } from "../../../base-path";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import type { DocPageModule } from "../../types";
import { BrandText } from "../brand/BrandText";
import { CodeBlock } from "../CodeBlock";
import { InlineCode } from "../PathDisplay";
import { accessibilitySections } from "./accessibility";
import type { AccessibilityProfile } from "./accessibility/types";
import { componentSourceUrl } from "./component-guidance";

/** Render trusted editorial inline-code markers without treating the content as HTML. */
function AccessibilityText({ text }: { text: string }) {
  return text
    .split(/(`[^`]+`)/g)
    .map((part, index) =>
      part.startsWith("`") ? (
        <InlineCode key={index}>{part.slice(1, -1)}</InlineCode>
      ) : (
        <BrandText key={index}>{part}</BrandText>
      ),
    );
}

/** Source-specific guidance shares the same heading hierarchy and reading layout as the API. */
export function ComponentAccessibilitySection({
  doc,
  profile,
  children,
}: {
  doc: DocPageModule;
  profile: AccessibilityProfile;
  children?: ComponentChildren;
}) {
  return (
    <section
      id="accessibility"
      class="docs-section blocks-doc-section component-doc-section"
      aria-labelledby="accessibility-title"
    >
      <h2 id="accessibility-title" tabIndex={-1}>
        <BlockHeadingLink id="accessibility">Accessibility</BlockHeadingLink>
      </h2>
      <p class="docs-copy">
        <strong>Build the Complete Interaction, Including the Parts Outside {doc.title}.</strong>{" "}
        The notes below distinguish the current implementation from the labels, content and behavior
        your application supplies. Start with the <a href="#component-preview">Live Preview</a>,
        check the <a href="#api-reference">Props and Data Reference</a>, and test the finished
        composition with real content rather than assuming that an unchanged visual example covers
        every use case.
      </p>
      {accessibilitySections(profile).map(({ id, label, text }, index) => {
        return (
          <div key={id} class="component-accessibility-topic">
            <h3 id={id} tabIndex={-1}>
              <BlockHeadingLink id={id}>{label}</BlockHeadingLink>
            </h3>
            <p class="docs-copy">
              <AccessibilityText text={text} />
            </p>
            {index === 1 && profile.example && (
              <>
                <p class="docs-copy">
                  <strong>{profile.example.title}.</strong> {profile.example.note}
                </p>
                <CodeBlock code={profile.example.code} language="tsx" />
              </>
            )}
          </div>
        );
      })}
      {children}
      <h3 id="accessibility-review" tabIndex={-1}>
        <BlockHeadingLink id="accessibility-review">
          Verify the Complete Interaction
        </BlockHeadingLink>
      </h3>
      <p class="docs-copy">
        <strong>Check Behavior as Well as Markup.</strong> Work through these scenarios in the
        application where the component will be used. Automated checks can help find structural
        problems; also review the reading experience with a screen reader, keyboard focus and the
        actual feedback from your application.
      </p>
      <ol class="component-accessibility-checks">
        {profile.checks.map((check) => (
          <li key={check}>
            <AccessibilityText text={check} />
          </li>
        ))}
      </ol>
      <p class="docs-copy">
        Recheck the result after changing{" "}
        <a href={withBasePath("/docs/theming/installation")}>Theme Tokens</a>, translations or{" "}
        <code>class</code> overrides. Include text enlargement, narrow layouts and reduced-motion
        settings where animation is present. Inspect the{" "}
        <a href={componentSourceUrl(doc.slug)}>Component Source</a> when a behavior differs from
        your expectation; a role or state attribute does not implement keyboard interaction by
        itself.
      </p>
      <p class="docs-copy">
        For background, read the{" "}
        <a href="https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/">
          WAI-ARIA Authoring Guidance
        </a>
        {doc.slug === "formisch" ? (
          <>
            {" "}
            and the{" "}
            <a href="https://www.w3.org/WAI/tutorials/forms/notifications/">
              WAI Guide to Form Feedback
            </a>
          </>
        ) : (
          <>
            {" "}
            and{" "}
            <a href="https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/">
              Keyboard Interface Guidance
            </a>
          </>
        )}
        . These explain the patterns; verify browser and assistive-technology behavior for the
        implementation and audience you actually support.
      </p>
    </section>
  );
}
