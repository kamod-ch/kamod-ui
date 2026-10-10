import { ArrowUpRightIcon } from "@kamod-ch/icons/lucide";
import { Button } from "@kamod-ch/ui";
import implementation from "../../../../../core/src/lib/utils.ts?raw";
import { withBasePath } from "../../../base-path";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";
import { repositoryUrl } from "../../../blocks/block-links";
import { CodeBlock } from "../CodeBlock";
import { InlineCodeLink } from "../InlineCodeLink";
import { PathDisplay } from "../PathDisplay";
import { ComponentDocSection } from "./ComponentDocSection";

const implementationPath = "packages/core/src/lib/utils.ts";
const source = `${repositoryUrl}/blob/main/${implementationPath}`;

/** Utility-specific reference content follows the actual implementation and its styling boundary. */
export function CnReferences() {
  return (
    <ComponentDocSection
      section={{
        id: "component-references",
        title: "Source, Styling & Next Steps",
        text: "Trace **One Class String** from its inputs to the rendered element. Start with the implementation, agree on an override order, then connect the result to your app’s styles. `cn` combines class names; your stylesheet still determines how they look.",
      }}
    >
      <div class="cn-reference-guide block-guide-prose">
        <section aria-labelledby="component-source">
          <header class="cn-reference-heading">
            <div>
              <span class="cn-reference-eyebrow">
                Implementation <span aria-hidden="true">·</span> Two Stages
              </span>
              <h3 id="component-source" tabIndex={-1}>
                <BlockHeadingLink id="component-source">Follow the Merge</BlockHeadingLink>
              </h3>
            </div>
            <Button
              href={source}
              target="_blank"
              rel="noopener noreferrer"
              variant="ghost"
              size="icon-sm"
              class="docs-icon-button"
              aria-label="Read the cn implementation on GitHub"
              title="Read the cn implementation on GitHub"
            >
              <ArrowUpRightIcon size={16} aria-hidden="true" />
            </Button>
          </header>
          <p>
            <strong>Normalize First, Resolve Conflicts Second.</strong>{" "}
            <InlineCodeLink href="https://github.com/lukeed/clsx">clsx</InlineCodeLink> collects
            strings, arrays and truthy object keys.{" "}
            <InlineCodeLink href="https://github.com/dcastil/tailwind-merge">
              twMerge
            </InlineCodeLink>{" "}
            then resolves recognized Tailwind conflicts. This is the implementation from the current
            checkout:
          </p>
          <CodeBlock
            code={implementation.trim()}
            language="typescript"
            filePath={implementationPath}
          />
          <div class="cn-reference-meta">
            <span>
              Public Entry <span aria-hidden="true">·</span>{" "}
              <PathDisplay path="@kamod-ch/ui/utils" />
            </span>
            <a
              href={`${repositoryUrl}/blob/main/LICENSE.md`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Repository License
            </a>
          </div>
          <p class="cn-reference-note">
            <strong>Check Both Stages When a Class Surprises You.</strong> The public entry
            re-exports this helper. Compare your <code>package.json</code> and lockfile with the
            repository’s <code>main</code> branch when results differ; dependency versions can
            change which utilities the merge engine recognizes.
          </p>
          <p>
            Follow the <InlineCodeLink href="#api-reference">API Reference</InlineCodeLink> for
            accepted inputs, then compare a small expression in the{" "}
            <InlineCodeLink href="#override-defaults">Override Examples</InlineCodeLink>. A class
            omitted by a false condition and a class replaced by a conflicting utility disappear for
            different reasons. <strong>Inspect the Input Before Changing the CSS.</strong>
            For dependency differences, check{" "}
            <InlineCodeLink href="/docs/packages#package-installation">
              Versions and Peer Dependencies
            </InlineCodeLink>
            .
          </p>
        </section>

        <p>
          <strong>There Are Two Results to Check.</strong> First, read the class string returned by
          the helper. Then inspect how that string looks on the element. If the string is
          unexpected, check the inputs and their order. If the string is right but the appearance is
          wrong, check your{" "}
          <InlineCodeLink href="/docs/theming/css-setup">CSS Setup</InlineCodeLink> before changing
          the merge expression. The next example makes that order visible.
        </p>
        <section class="cn-reference-section" aria-labelledby="component-design-reference">
          <header class="cn-reference-heading">
            <div>
              <span class="cn-reference-eyebrow">
                Composition <span aria-hidden="true">·</span> A Clear Override Order
              </span>
              <h3 id="component-design-reference" tabIndex={-1}>
                <BlockHeadingLink id="component-design-reference">
                  Make Overrides Predictable
                </BlockHeadingLink>
              </h3>
            </div>
            <a href="#override-defaults">Compare the Output</a>
          </header>
          <div class="cn-reference-split">
            <div>
              <p>
                Build a <strong>Stable Default</strong>, add the current visual state, and place the
                consumer’s <code>class</code> last. That order gives callers an intentional override
                point for conflicts that the merge engine understands.
              </p>
              <p>
                Keep state choices as complete class names, such as <code>bg-primary</code>. Follow
                the <a href={withBasePath("/blocks/styles")}>Component Styles Guide</a> for spacing
                and hierarchy; use{" "}
                <a href={withBasePath("/docs/theming/token-overrides")}>Theme Tokens</a> when a
                color or surface should change throughout the app.
              </p>
            </div>
            <dl class="cn-reference-order">
              <div>
                <dt>
                  <span>01</span> Base
                </dt>
                <dd>The shared shape and spacing.</dd>
              </div>
              <div>
                <dt>
                  <span>02</span> State
                </dt>
                <dd>The selected, invalid or disabled treatment.</dd>
              </div>
              <div>
                <dt>
                  <span>03</span> Consumer
                </dt>
                <dd>
                  The instance’s final <code>class</code> override.
                </dd>
              </div>
            </dl>
          </div>
          <CodeBlock
            language="typescript"
            filePath="src/components/panel-classes.ts"
            code={`import { cn } from "@kamod-ch/ui/utils";

export function panelClasses(selected: boolean, className?: string) {
  return cn(
    "rounded-lg border border-border bg-card p-4 text-card-foreground",
    selected && "border-primary",
    className,
  );
}

panelClasses(true, "p-6"); // p-6 replaces p-4; the selected border remains.`}
          />
        </section>

        <section class="cn-reference-section" aria-labelledby="component-reference-next">
          <h3 id="component-reference-next" tabIndex={-1}>
            <BlockHeadingLink id="component-reference-next">
              Check the Result in Your App
            </BlockHeadingLink>
          </h3>
          <p>
            Inspect the <strong>Returned String</strong>, then check the rendered element. A
            retained class still needs generated CSS, a matching breakpoint or state, and the right
            theme token. Custom classes and stylesheet specificity remain part of the CSS cascade;{" "}
            <code>cn</code> does not inspect your stylesheet or generate missing rules.
          </p>
          <div class="cn-reference-boundary">
            <strong>Keep Behavior Separate.</strong> A disabled-looking class does not disable a
            control. Pass <code>disabled</code> to the actual control and preserve its labels and
            keyboard behavior alongside visual changes.
          </div>
          <p>
            <strong>Start with One Conflicting Pair.</strong> Compare <code>p-4</code> and{" "}
            <code>p-6</code> in the{" "}
            <InlineCodeLink href="#override-defaults">Override Examples</InlineCodeLink>, then add a
            conditional class and the consumer override. Check the output after each step. Keeping a
            small example beside your real composition makes it easier to spot whether a missing
            class came from a false condition or a later conflicting value.
          </p>
          <footer class="cn-reference-meta">
            <span>
              Continue with <InlineCodeLink href="#preact-component">class</InlineCodeLink> in a
              reusable component
            </span>
            <a href={withBasePath("/docs/theming/css-setup")}>
              Check Your CSS Setup <ArrowUpRightIcon size={13} aria-hidden="true" />
            </a>
          </footer>
        </section>
      </div>
    </ComponentDocSection>
  );
}
