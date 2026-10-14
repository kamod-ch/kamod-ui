import { ArrowUpRightIcon, ComponentIcon } from "@kamod-ch/icons/lucide";
import { withBasePath } from "../base-path";
import { componentEntries } from "./home-content";

type ComponentEntry = (typeof componentEntries)[number];
const moreComponents: ComponentEntry[] = [
  { title: "Tooltip", slug: "tooltip", text: "A little context, right on cue." },
  { title: "Popover", slug: "popover", text: "Keep the details close by." },
  { title: "Select", slug: "select", text: "Make room for a better choice." },
];

/** Main and continuation entries share the same guide/source links and card geometry. */
function ComponentGuideCard({ item }: { item: ComponentEntry }) {
  return (
    <div class="home-component-card">
      <ComponentIcon size={17} aria-hidden="true" />
      <div class="home-component-copy">
        <div class="home-component-heading">
          <strong>
            <a class="home-component-guide" href={withBasePath(`/docs/${item.slug}/installation`)}>
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
  );
}

/** One matching final row fades toward the complete component collection. */
export function HomeComponentDirectory() {
  return (
    <>
      <nav class="home-component-directory" aria-label="Popular component guides">
        {componentEntries.map((item) => (
          <ComponentGuideCard key={item.slug} item={item} />
        ))}
        <div class="home-component-continuation">
          {moreComponents.map((item) => (
            <ComponentGuideCard key={item.slug} item={item} />
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
