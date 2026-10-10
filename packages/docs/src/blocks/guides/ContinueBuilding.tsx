import { ArrowRightIcon, ArrowUpRightIcon, CheckIcon } from "@kamod-ch/icons/lucide";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@kamod-ch/ui";
import { withBasePath } from "../../base-path";
import { BrandText } from "../../docs/components/brand/BrandText";
import { CodeBlock } from "../../docs/components/CodeBlock";
import { DocsCallout } from "../../docs/components/DocsCallout";
import { PathDisplay } from "../../docs/components/PathDisplay";
import { linkTitle } from "../../link-title";
import { BlockHeadingLink } from "../BlockHeadingLink";
import { blockGuides } from "./guide-catalog";
import { guideExercises } from "./guide-exercises";

export const continueBuildingContents = {
  id: "continue-building",
  label: "Continue Building",
  children: [
    { id: "choose-your-next-step", label: "Choose Your Next Step" },
    { id: "try-one-small-change", label: "Try One Small Change" },
    { id: "review-in-your-app", label: "Review in Your App" },
  ],
};

const nextSteps = {
  "getting-started": {
    title: "Connect the Composition",
    task: "Choose one variant, copy its complete source and render it on a real route.",
    outcome: "A working first screen with your own navigation, data and service callbacks.",
  },
  styles: {
    title: "Refine the Details",
    task: "Tune spacing, typography and action hierarchy around the content your users will see.",
    outcome: "A consistent layout that keeps the original keyboard and responsive behavior.",
  },
  theming: {
    title: "Apply the Theme to a Complete Layout",
    task: "Check copied-source discovery, sidebar surfaces and overlays against your existing app theme.",
    outcome:
      "An integrated block that follows the same appearance preferences as the rest of your app.",
  },
};

const reviewChecks = [
  {
    title: "Real Content, Real States",
    text: "Replace demo names, links and sample data. Try long labels, empty results and failed requests; a successful demo state is only one part of the screen.",
  },
  {
    title: "Keyboard from Start to Finish",
    text: "Tab through the page, activate controls and dismiss overlays with Escape. Make sure focus remains visible and returns to the trigger after a menu or dialog closes.",
  },
  {
    title: "Room to Adapt",
    text: "Check a narrow phone, a tablet and a wide desktop. Open the mobile navigation and try enlarged text. Keep controls reachable and confine wide tables or code to their own scroll area.",
  },
  {
    title: "Both Schemes, a Fresh Load",
    text: "Review light and dark mode with your chosen preset. Reload a nested route directly and check the first render, text contrast, focus indicators and any saved preferences.",
  },
];

/** Practical follow-up shared by all guides, with an exercise selected for the current topic. */
export function ContinueBuilding({ slug }: { slug: (typeof blockGuides)[number]["slug"] }) {
  return (
    <section
      class="blocks-doc-section block-guide-section block-guide-next"
      aria-labelledby="continue-building"
    >
      <div class="guide-next-kicker">
        <span>From reference to practice</span>
        <span>Build · Refine · Verify</span>
      </div>
      <h2 id="continue-building" tabIndex={-1}>
        <BlockHeadingLink id="continue-building">Continue Building</BlockHeadingLink>
      </h2>
      <div class="block-guide-prose">
        <p>
          <BrandText>
            Put what you’ve learned into a <strong>Small, Working Part of Your App</strong>. Choose
            a composition, make one deliberate change and check the result with real content. You
            own the copied source: keep your <code>Preact</code> conventions, reuse the{" "}
            <PathDisplay path={"@kamod-ch/ui"} /> primitives and let your application supply the
            behavior.
          </BrandText>
        </p>
      </div>

      <div class="guide-next-part">
        <h3 id="choose-your-next-step" tabIndex={-1}>
          <BlockHeadingLink id="choose-your-next-step">Choose Your Next Step</BlockHeadingLink>
        </h3>
        <p>
          Continue with the part your screen needs next. Each guide takes you from a specific
          decision to a result you can check in your project.
        </p>
        <div class="guide-next-paths">
          {blockGuides
            .filter((guide) => guide.slug !== slug)
            .map((guide, index) => {
              const step = nextSteps[guide.slug];
              return (
                <div class="guide-next-path" key={guide.slug}>
                  <span class="guide-next-number" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <strong>{step.title}</strong>
                  <p>{step.task}</p>
                  <p class="guide-next-outcome">
                    <span>What you’ll have</span>
                    {step.outcome}
                  </p>
                  <a class="guide-next-link" href={withBasePath(`/blocks/${guide.slug}`)}>
                    {linkTitle(guide.label)}
                    <ArrowRightIcon size={14} aria-hidden="true" />
                  </a>
                </div>
              );
            })}
        </div>
      </div>

      <div class="guide-next-part">
        <h3 id="try-one-small-change" tabIndex={-1}>
          <BlockHeadingLink id="try-one-small-change">Try One Small Change</BlockHeadingLink>
        </h3>
        <p>
          These focused examples build on an <strong>Already Configured Project</strong>. Use the
          suggested file paths as a starting point, adapt them to your folder structure and follow
          the selected block’s setup guide for its complete dependencies.
        </p>
        <Tabs key={slug} defaultValue={slug} class="guide-next-exercises">
          <TabsList
            variant="line"
            aria-label="Practice examples"
            class="guide-next-tabs guide-practice-tabs"
          >
            {guideExercises.map((example) => (
              <TabsTrigger key={example.slug} value={example.slug}>
                {example.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {guideExercises.map((example) => (
            <TabsContent key={example.slug} value={example.slug}>
              <div class="guide-next-example-intro">
                <strong>{example.title}</strong>
                <p>{example.description}</p>
              </div>
              <CodeBlock
                code={example.code}
                language={example.language}
                filePath={example.filePath}
              />
              <DocsCallout
                class="docs-callout-spaced"
                icon={<CheckIcon />}
                title="Check the result"
                footer={
                  <a class="docs-callout-action" href={withBasePath(example.reference)}>
                    {linkTitle(example.referenceLabel)}
                    <ArrowUpRightIcon size={14} aria-hidden="true" />
                  </a>
                }
              >
                <p>{example.check}</p>
              </DocsCallout>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div class="guide-next-part">
        <h3 id="review-in-your-app" tabIndex={-1}>
          <BlockHeadingLink id="review-in-your-app">Review in Your App</BlockHeadingLink>
        </h3>
        <p>
          Review the <strong>Integrated Screen</strong>, not just the isolated preview. Routes,
          services and your own content can expose issues that the demo never encounters. Use these
          four passes before you consider the composition ready.
        </p>
        <dl class="guide-next-review">
          {reviewChecks.map((check) => (
            <div key={check.title}>
              <dt>
                <CheckIcon size={14} aria-hidden="true" />
                {check.title}
              </dt>
              <dd>{check.text}</dd>
            </div>
          ))}
        </dl>
        <div class="guide-next-build block-guide-prose">
          <strong>Check the Build You Actually Ship</strong>
          <p>
            <BrandText>
              Inspect <code>package.json</code> and run the existing type, lint and test scripts
              that apply to your changes. For a project with a <code>build</code> script using pnpm,
              run <code>pnpm run build</code>, then serve the production output with your project’s
              preview command. Visit the route directly and check that copied files, assets and
              Tailwind utilities are included. A development preview alone does not verify the
              production result.
            </BrandText>
          </p>
        </div>
      </div>
    </section>
  );
}
