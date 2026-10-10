import { ArrowUpRightIcon, RouteIcon } from "@kamod-ch/icons/tabler/outline";
import { withBasePath } from "../../../base-path";
import { BlockHeadingLink } from "../../../blocks/BlockHeadingLink";

const readingPaths = [
  {
    label: "Own the State",
    href: "/docs/getting-started#give-state-one-owner",
    link: "State & Data",
    content: (
      <>
        Let one owner provide the current <code>value</code>, selection or request status. Children
        report intent through the callbacks their APIs support.
      </>
    ),
  },
  {
    label: "Preserve the Interaction",
    href: "/docs/getting-started#preserve-accessible-interaction",
    link: "Accessibility",
    content: (
      <>
        Follow the task with a keyboard. Check the visible label, focus after completion, and any{" "}
        <code>aria-describedby</code> relationship when an error appears.
      </>
    ),
  },
  {
    label: "Share the Visual Rules",
    href: "/docs/theming/token-overrides",
    link: "Theme Tokens",
    content: (
      <>
        Pair surface and foreground tokens, such as <code>bg-card</code> and{" "}
        <code>text-card-foreground</code>. Recheck the same content in both themes and a narrow
        container.
      </>
    ),
  },
];

/** End the composition guidance with a concrete handoff from reference to application. */
export function CompositionNextSteps() {
  return (
    <section class="component-composition-next" aria-labelledby="composition-next-step">
      <div class="component-composition-kicker">
        <span>
          <RouteIcon size={15} strokeWidth={1.75} aria-hidden="true" /> From Reference to
          Application
        </span>
        <span>
          One Task <span aria-hidden="true">·</span> End to End
        </span>
      </div>
      <h4 id="composition-next-step" tabIndex={-1}>
        <BlockHeadingLink id="composition-next-step">
          Build One Complete Path through the Interface
        </BlockHeadingLink>
      </h4>
      <p>
        Start with the <strong>Smallest Useful Composition</strong>: one real task, its current
        state and a clear next action. Connect those pieces before adding more visual variants. A
        useful first result is a journey someone can finish—and recover from when it fails.
      </p>
      <div class="component-composition-paths">
        {readingPaths.map(({ label, href, link, content }, index) => (
          <div key={href} class="component-composition-path">
            <span class="component-composition-step" aria-hidden="true">
              0{index + 1}
            </span>
            <h5>{label}</h5>
            <p>{content}</p>
            <a class="component-composition-resource" href={withBasePath(href)}>
              {link}
              <ArrowUpRightIcon size={13} aria-hidden="true" />
            </a>
          </div>
        ))}
      </div>
      <div class="component-composition-handoff">
        <div>
          <strong>Choose Your Starting Point</strong>
          <p>
            Need one control or the surrounding layout? Pick the level that matches what you still
            need to build.
          </p>
        </div>
        <nav aria-label="Explore components and layouts">
          <a class="component-composition-resource" href={withBasePath("/docs/components")}>
            Component Library
            <ArrowUpRightIcon size={13} aria-hidden="true" />
          </a>
          <span aria-hidden="true">·</span>
          <a class="component-composition-resource" href={withBasePath("/blocks")}>
            Block Collections
            <ArrowUpRightIcon size={13} aria-hidden="true" />
          </a>
        </nav>
      </div>
      <p class="component-composition-exit">
        <strong>Before You Move On</strong>
        <span aria-hidden="true"> · </span>
        Try a slow response, an empty result and a failed action. Keep entered values available and
        make the next step obvious. The{" "}
        <a href={withBasePath("/docs/getting-started#verify-the-whole-journey")}>
          Verification Walkthrough
        </a>{" "}
        helps turn those expectations into repeatable checks.
      </p>
    </section>
  );
}
