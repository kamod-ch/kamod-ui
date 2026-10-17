import {
  ArrowRightIcon,
  ArrowUpIcon,
  BlocksIcon,
  ListChecksIcon,
  RocketIcon,
} from "@kamod-ch/icons/lucide";
import { Checkbox } from "@kamod-ch/ui";
import { useId, useState } from "preact/hooks";
import { withBasePath } from "../../base-path";
import "./theming-outro.css";

const review = [
  {
    title: "Read it in both modes",
    description: "Check text, focus, disabled controls and errors on your actual surfaces.",
  },
  {
    title: "Come back to your choice",
    description: "Reload with a saved preference, then try System and a first visit.",
  },
  {
    title: "Build the real thing",
    description: "Check a production preview, a narrow screen and an open menu.",
  },
];

const principles = [
  {
    title: "One foundation",
    description:
      "Load the global stylesheet once. Let components, navigation and overlays share it.",
    href: "#css-setup",
    link: "Keep the setup together",
  },
  {
    title: "Roles before individual colors",
    description:
      "Change surfaces with their foregrounds. Refine the palette without restyling every control.",
    href: "#token-overrides",
    link: "Work with the tokens",
  },
  {
    title: "A choice that stays chosen",
    description:
      "Keep brand and appearance separate. Match saved preferences from the first paint onward.",
    href: "#provider-controls",
    link: "Connect preferences",
  },
];

/** A self-contained review whose progress resets with its mounted instance. */
function ThemeReview() {
  const headingId = useId();
  const [checked, setChecked] = useState<boolean[]>(() => review.map(() => false));
  const completed = checked.filter(Boolean).length;
  return (
    <section class="theming-outro-review" aria-labelledby={headingId}>
      <div class="theming-outro-review-heading">
        <ListChecksIcon size={17} strokeWidth={1.7} aria-hidden="true" />
        <h3 id={headingId}>Before you ship</h3>
        <span aria-hidden="true">
          {completed} / {review.length}
        </span>
      </div>
      <p>Tick these off in your own app.</p>
      <fieldset>
        <legend class="sr-only">Your theme review</legend>
        {review.map(({ title, description }, index) => (
          <label key={title}>
            <Checkbox
              checked={checked[index]}
              onCheckedChange={(next) => {
                const value = next === true;
                setChecked((current) => current.map((item, i) => (i === index ? value : item)));
              }}
            />
            <span class="theming-outro-review-copy">
              <strong>{title}</strong>
              <span>{description}</span>
            </span>
          </label>
        ))}
      </fieldset>
      <p class="theming-outro-review-status" role="status">
        {completed === review.length
          ? "Review complete. Take it into your next screen."
          : `${completed} of ${review.length} checks reviewed.`}
      </p>
    </section>
  );
}

/** Keep the guide recap static while the checklist owns its local interaction. */
export function ThemingOutro() {
  return (
    <div class="theming-outro">
      <div class="theming-outro-recap">
        <dl class="theming-outro-principles">
          {principles.map(({ title, description, href, link }, index) => (
            <div key={href}>
              <dt>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {title}
              </dt>
              <dd>
                {description}
                <a href={href}>
                  {link} <ArrowRightIcon size={12} aria-hidden="true" />
                </a>
              </dd>
            </div>
          ))}
        </dl>
        <ThemeReview />
      </div>

      <nav class="theming-outro-next" aria-label="Put your theme into practice">
        <a href={withBasePath("/docs/getting-started")}>
          <RocketIcon size={18} strokeWidth={1.6} aria-hidden="true" />
          <span>
            <small>Start with a component</small>
            <strong>Build your first interface</strong>
          </span>
          <ArrowRightIcon size={16} aria-hidden="true" />
        </a>
        <a href={withBasePath("/blocks/theming")}>
          <BlocksIcon size={18} strokeWidth={1.6} aria-hidden="true" />
          <span>
            <small>Bring the pieces together</small>
            <strong>Theme a complete layout</strong>
          </span>
          <ArrowRightIcon size={16} aria-hidden="true" />
        </a>
      </nav>

      <div class="theming-outro-footer">
        <span>One palette. Both modes. Every surface.</span>
        <a href="#page-title">
          Back to the guide <ArrowUpIcon size={12} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
