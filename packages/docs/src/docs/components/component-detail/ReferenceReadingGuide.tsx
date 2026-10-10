import { BookOpenIcon, CheckIcon, PaletteIcon } from "@kamod-ch/icons/lucide";
import { InlineCodeLink } from "../InlineCodeLink";

/** Open reading notes connect the reference cards without introducing more card chrome. */
export function ReferenceReadingGuide({ stage }: { stage: "start" | "design" | "adapt" }) {
  const Icon = stage === "start" ? BookOpenIcon : stage === "design" ? PaletteIcon : CheckIcon;
  return (
    <aside class="component-reference-bridge block-guide-prose">
      <Icon size={19} strokeWidth={1.8} aria-hidden="true" />
      <div>
        {stage === "start" ? (
          <>
            <p class="component-reference-bridge-title">
              <strong>Find the Answer You Need First</strong>
            </p>
            <p>
              You do not need to read every source file before using the component. Start with the
              question in front of you, follow one reference, and return to your example with a
              change you can explain.
            </p>
            <dl class="component-reference-decisions">
              <div>
                <dt>“How do I use it?”</dt>
                <dd>
                  Start with <InlineCodeLink href="#component-preview">Live Preview</InlineCodeLink>{" "}
                  and its source. Find the smallest example that does what you need.
                </dd>
              </div>
              <div>
                <dt>“What can I change?”</dt>
                <dd>
                  Check <InlineCodeLink href="#api-reference">Props and Data</InlineCodeLink> for
                  accepted values, required inputs and callbacks.
                </dd>
              </div>
              <div>
                <dt>“How should it look?”</dt>
                <dd>
                  Explore the{" "}
                  <InlineCodeLink href="#component-design-reference">
                    Design Reference
                  </InlineCodeLink>
                  , then bring one visual idea back to the working example.
                </dd>
              </div>
            </dl>
          </>
        ) : stage === "design" ? (
          <>
            <p class="component-reference-bridge-title">
              <strong>Choose One Detail to Borrow</strong>
            </p>
            <p>
              With the <InlineCodeLink href="#component-source">Implementation</InlineCodeLink>{" "}
              nearby, look at the next reference with a specific question. Is the message easy to
              scan? Does the main action stand out? Is there enough space between unrelated items?
              <strong> Name the improvement before changing the code.</strong>
            </p>
            <p>
              For example, “the explanation is hard to find” might call for a shorter sentence
              beside the control. “Everything feels crowded” might call for a small <code>gap</code>
              or padding adjustment. Start with{" "}
              <InlineCodeLink href="/blocks/styles">Component Styles</InlineCodeLink> for those
              local changes; keep the component’s documented behavior intact.
            </p>
          </>
        ) : (
          <>
            <p class="component-reference-bridge-title">
              <strong>Turn the Idea into a Small Experiment</strong>
            </p>
            <p>
              Pick one example and write down what you expect to improve. A useful first pass might
              be <strong>clearer supporting text</strong>, <strong>more comfortable spacing</strong>
              , or <strong>a stronger focus indicator</strong>. Change one of those, then compare
              the result with the original using the same content and screen width.
            </p>
            <p>
              If a color should change everywhere, follow{" "}
              <InlineCodeLink href="/docs/theming/token-overrides">Theme Tokens</InlineCodeLink>. If
              only this composition needs more room, keep its <code>class</code> adjustment local.
              The next exercise shows a small place to try that decision before spreading it across
              the application.
            </p>
          </>
        )}
      </div>
    </aside>
  );
}
