import { ArrowUpRightIcon, ComponentIcon } from "@kamod-ch/icons/lucide";
import { withBasePath } from "../base-path";
import { componentEntries } from "./home-content";

const moreComponents = [
  ["Tooltip", "A little context, right on cue."],
  ["Popover", "Keep the details close by."],
  ["Select", "Make room for a better choice."],
  ["Calendar", "Put a date on the next step."],
  ["Switch", "Give preferences a quick flip."],
  ["Slider", "Find just the right amount."],
];

/** A compact continuation reveals more working component links on hover or focus. */
export function HomeComponentDirectory() {
  return (
    <>
      <nav class="home-component-directory" aria-label="Popular component guides">
        {componentEntries.map((item) => (
          <div class="home-component-card" key={item.slug}>
            <ComponentIcon size={17} aria-hidden="true" />
            <div class="home-component-copy">
              <div class="home-component-heading">
                <strong>
                  <a
                    class="home-component-guide"
                    href={withBasePath(`/docs/${item.slug}/installation`)}
                  >
                    {item.title}
                  </a>
                </strong>
                <span class="home-component-slash" aria-hidden="true">
                  /
                </span>
                <a
                  class="home-component-source"
                  href={`https://github.com/kamod-ch/kamod-ui/tree/main/packages/core/src/components/${item.slug}`}
                  title={`View @/components/kamod-ui/${item.slug} on GitHub`}
                >
                  <code>{`@/components/kamod-ui/${item.slug}`}</code>
                </a>
              </div>
              <small>{item.text}</small>
            </div>
            <ArrowUpRightIcon size={14} aria-hidden="true" />
          </div>
        ))}
        <div class="home-component-continuation">
          {moreComponents.map(([title, text]) => (
            <a
              class="home-component-card"
              key={title}
              href={withBasePath(`/docs/${title.toLowerCase()}/installation`)}
            >
              <ComponentIcon size={17} aria-hidden="true" />
              <div class="home-component-copy">
                <strong>{title}</strong>
                <small>{text}</small>
              </div>
              <ArrowUpRightIcon size={14} aria-hidden="true" />
            </a>
          ))}
        </div>
      </nav>
      <p class="home-component-directory-note">
        Just a few familiar faces.{" "}
        <a href={withBasePath("/docs/components")}>
          Meet the whole collection
          <ArrowUpRightIcon size={12} aria-hidden="true" />
        </a>
      </p>
    </>
  );
}
