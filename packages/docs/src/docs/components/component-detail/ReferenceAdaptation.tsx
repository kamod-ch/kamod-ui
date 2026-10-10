import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import { CodeBlock } from "../CodeBlock";
import { InlineCodeLink } from "../InlineCodeLink";

const surfaceExample = `import type { ComponentChildren } from "preact";

export function ReferenceSurface({ children }: { children: ComponentChildren }) {
  return (
    <div class="rounded-xl border border-border bg-card p-4 text-card-foreground">
      {children}
    </div>
  );
}`;

/** A small styling exercise keeps shared reference guidance separate from component APIs. */
export function ReferenceAdaptation({ title }: { title: string }) {
  return (
    <div class="component-reference-next block-guide-prose">
      <h3 id="component-reference-next" tabIndex={-1}>
        <BlockHeadingLink id="component-reference-next">Bring It Back to Your App</BlockHeadingLink>
      </h3>
      <p>
        <strong>Keep One Working Example Within Reach.</strong> Start with the{" "}
        <InlineCodeLink href="#component-preview">Live Preview</InlineCodeLink> of {title}, replace
        its sample content, then connect the data and callbacks described in the{" "}
        <InlineCodeLink href="#integration-behavior">Integration Guidance</InlineCodeLink>. Test
        that first pass before changing the layout. A useful reference makes the next decision
        easier; it does not need to become a pixel-for-pixel copy.
      </p>
      <h4 class="font-semibold text-foreground">Make the First Pass Small</h4>
      <p>
        <strong>Give This Instance One Job.</strong> Describe what someone should understand or
        accomplish here in a single sentence. Replace the example’s labels and sample records with
        content from that task. Keep the existing layout until the words make sense; a familiar
        example is easier to debug while you are connecting real data.
      </p>
      <dl class="component-reference-decisions">
        <div>
          <dt>Keep initially</dt>
          <dd>
            The example’s component order, labels and documented defaults. Use the{" "}
            <InlineCodeLink href="#api-reference">API Reference</InlineCodeLink> when deciding which
            inputs are required.
          </dd>
        </div>
        <div>
          <dt>Replace deliberately</dt>
          <dd>
            Demo copy, destinations and sample data. For interactive examples, connect callbacks to
            the real operation and make its pending or failed result understandable.
          </dd>
        </div>
        <div>
          <dt>Refine last</dt>
          <dd>
            Spacing, emphasis and decoration. Check the{" "}
            <InlineCodeLink href="#integration-review">Complete Interaction</InlineCodeLink> again
            after a visual change.
          </dd>
        </div>
      </dl>
      <h4 class="font-semibold text-foreground">Try a Small, Theme-Aware Surface</h4>
      <p>
        <strong>Experiment Around the Component First.</strong> This optional Preact wrapper gives
        an in-page example a surface, a boundary and some breathing room. Place your existing
        composition inside <code>ReferenceSurface</code>; its <code>children</code> keep their own
        props and behavior. Change <code>p-4</code> to <code>p-6</code> to compare density without
        rewriting the component. Skip the wrapper if the surrounding layout already provides it.
      </p>
      <CodeBlock
        code={surfaceExample}
        language="tsx"
        filePath="src/components/reference-surface.tsx"
      />
      <p>
        These utilities need your project’s{" "}
        <InlineCodeLink href="/docs/theming/css-setup">CSS Setup</InlineCodeLink> and semantic theme
        tokens. The wrapper does not recolor portaled menus or dialogs outside it; adjust those
        through their own documented styling hooks. Use{" "}
        <InlineCodeLink href="/docs/theming/accessibility">Theme Accessibility</InlineCodeLink> to
        review contrast and focus visibility after a color change.
      </p>
      <h4 class="font-semibold text-foreground">Give the Reference a Real-World Test</h4>
      <p>
        <strong>Use Awkward Content on Purpose.</strong> Try a long label, missing optional data and
        the smallest layout your app supports. Follow this component’s{" "}
        <InlineCodeLink href="#integration-review">Interaction Review</InlineCodeLink> and{" "}
        <InlineCodeLink href="#accessibility">Accessibility Guidance</InlineCodeLink> for the checks
        that apply to it. Keep explanatory text near the action it describes and make keyboard focus
        easy to find.
      </p>
      <p>
        <strong>Keep a Useful Before-and-After.</strong> Try the same long label in both versions
        and compare them at a narrow width. For interactive components, reach the control with{" "}
        <code>Tab</code> and follow the keyboard behavior documented above. If the new treatment
        hides an explanation or makes focus harder to see, adjust that detail before reusing it. A
        calmer layout should also be easier to operate.
      </p>
      <p>
        <strong>Promote What You Will Reuse.</strong> Move recurring colors into{" "}
        <InlineCodeLink href="/docs/theming/token-overrides">Theme Tokens</InlineCodeLink>, and keep
        one-off spacing with the composition. Explore{" "}
        <InlineCodeLink href="#integration-compose">Related Components</InlineCodeLink> for the next
        interaction, or <InlineCodeLink href="/blocks">Blocks</InlineCodeLink> when you need a
        complete screen. Keep a source link in your project notes so the next person can trace the
        decisions without starting the search again.
      </p>
      <p>
        <strong>Leave a Small Trail for the Next Edit.</strong> Note the source you started from,
        the installed version and the intentional differences. A sentence such as “more room for
        translated labels; behavior follows the original example” is more useful than an unexplained
        pile of overrides. Revisit{" "}
        <InlineCodeLink href="#component-source">Source and Version Guidance</InlineCodeLink> when
        you update the dependency or refresh a copied file.
      </p>
    </div>
  );
}
