import {
  ArrowRightIcon,
  BookOpenIcon,
  BracesIcon,
  ListChecksIcon,
  PackageIcon,
  WaypointsIcon,
} from "@kamod-ch/icons/lucide";
import { withBasePath } from "../../base-path";
import { BlockHeadingLink } from "../../blocks/BlockHeadingLink";

const nextSteps = [
  {
    id: "first-screen",
    context: "Start here",
    title: "Build Your First Screen",
    description: "Connect Preact, global styles and your first Kamod control in one guided setup.",
    action: "Open Getting Started",
    href: "/docs/getting-started#set-up-your-app",
    Icon: BookOpenIcon,
  },
  {
    id: "add-capability",
    context: "Already building?",
    title: "Add One Capability",
    description:
      "Compare reusable behavior, saved preferences and shared state. Find the package that owns your next requirement.",
    action: "Compare Packages",
    href: "/docs/packages#package-boundaries",
    Icon: PackageIcon,
  },
  {
    id: "review-journey",
    context: "Before you ship",
    title: "Check the Whole Journey",
    description:
      "Follow a real action from input to result, including keyboard use, narrow screens and recovery when a request fails.",
    action: "Review the Checks",
    href: "/docs/getting-started#verify-the-whole-journey",
    Icon: ListChecksIcon,
  },
];

/** Static, page-owned conclusion: native links reuse the existing guides without loading demos. */
export function EcosystemNextSteps() {
  return (
    <section class="ecosystem-guide ecosystem-next" aria-labelledby="your-next-step">
      <div class="ecosystem-next-eyebrow">
        <WaypointsIcon size={15} strokeWidth={1.75} aria-hidden="true" />
        Your next move
      </div>
      <h2 id="your-next-step" tabIndex={-1}>
        <BlockHeadingLink id="your-next-step">Put the Toolkit to Work</BlockHeadingLink>
      </h2>
      <p class="ecosystem-next-description">
        Choose <strong>one useful task</strong>: a preference to save, a panel to open or a form to
        submit. Bring together the pieces it needs, connect your real data, and make loading,
        recovery and keyboard use part of the same finished screen.
      </p>
      <nav class="ecosystem-next-paths" aria-label="Choose your next step">
        {nextSteps.map(({ id, context, title, description, action, href, Icon }, index) => (
          <section key={id} class="ecosystem-next-path" aria-labelledby={`${id}-title`}>
            <div class="ecosystem-next-topic-heading">
              <span class="ecosystem-next-context">
                <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                {context}
              </span>
              <h3 id={`${id}-title`}>{title}</h3>
              <a
                class="docs-icon-button"
                href={withBasePath(href)}
                aria-label={action}
                title={action}
              >
                <ArrowRightIcon size={15} aria-hidden="true" />
              </a>
            </div>
            <p id={`${id}-description`}>{description}</p>
            <p class="ecosystem-next-detail">
              {index === 0 ? (
                <>
                  Start with <code>@kamod-ch/ui</code> and a visible action such as opening a panel.
                  Keep the stylesheet in your application entry, supply real labels, and connect one
                  callback before adding the next control.{" "}
                  <a href={withBasePath(href)}>Follow the application setup</a> to check each piece
                  in context.
                </>
              ) : index === 1 ? (
                <>
                  Give every concern a clear owner: a hook for reusable behavior, a saved preference
                  for a small persistent value, or a state store for coordinated transitions. Keep
                  the same value out of competing stores.{" "}
                  <a href={withBasePath(href)}>Compare the package boundaries</a> before introducing
                  another dependency.
                </>
              ) : (
                <>
                  Try the task with a keyboard, a long label and the smallest screen you support.
                  Check pending, empty and failed outcomes alongside the successful path.{" "}
                  <a href={withBasePath(href)}>Use the integration review</a> to make recovery as
                  understandable as the first action.
                </>
              )}
            </p>
          </section>
        ))}
      </nav>
      <div class="ecosystem-next-footer">
        <div class="ecosystem-next-experiment">
          <BracesIcon size={16} strokeWidth={1.75} aria-hidden="true" />
          <p>
            Prefer a quick experiment?{" "}
            <a href="#build-one-small-feature">Try the details toggle.</a>
          </p>
        </div>
        <a class="ecosystem-next-return" href="#choose-a-starting-point">
          Back to the map
          <ArrowRightIcon size={13} strokeWidth={1.75} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
