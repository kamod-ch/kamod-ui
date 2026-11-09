import { ArrowUpRightIcon } from "@kamod-ch/icons/lucide";
import { withBasePath } from "../base-path";
import { publishedBlockOverviewItems } from "../blocks/block-overview-items";

const featuredKeys = ["application-shell", "sidebar", "marketing", "login"] as const;

export function HomeFeaturedBlocks() {
  const items = publishedBlockOverviewItems().filter((item) =>
    (featuredKeys as readonly string[]).includes(item.key),
  );
  return (
    <section class="home-featured-blocks" aria-labelledby="home-featured-blocks-title">
      <div class="home-section-heading">
        <p class="home-section-kicker">
          <span>Blocks</span>
          <span aria-hidden="true">/</span>
          Ready to copy
        </p>
        <h2 id="home-featured-blocks-title">Start From a Complete Layout</h2>
        <p class="home-featured-blocks-lead">
          A short list of published collections with live previews — not the full catalog.
        </p>
      </div>
      <ul class="home-featured-blocks-grid">
        {items.map((item) => (
          <li key={item.key}>
            <a href={withBasePath(item.href)}>
              <span class="home-featured-blocks-title">{item.label}</span>
              <span class="home-featured-blocks-meta">
                {item.count} {item.count === 1 ? "variant" : "variants"}
              </span>
              <span class="home-featured-blocks-detail">{item.description}</span>
              <ArrowUpRightIcon size={16} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
