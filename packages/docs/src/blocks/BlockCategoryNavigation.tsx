/** Shared desktop/mobile category navigation; counts come from component-free metadata. */
import { SheetClose } from "@kamod-ch/ui";
import { withBasePath } from "../base-path";
import { blockCategories } from "./block-categories";
import { type BlockNavKey, visibleBlockNavItems } from "./block-nav-config";

const counts = new Map(
  Object.entries(blockCategories).map(([key, category]) => [key, category.blocks.length]),
);
const categories = visibleBlockNavItems.map((item) => ({
  ...item,
  count: counts.get(item.key) ?? 0,
}));
const total = categories.reduce((sum, category) => sum + category.count, 0);

/** Keep the same links and counts in the sidebar and the dismissible mobile sheet. */
export function BlockCategoryNavigation({
  activeBlock,
  mobile = false,
}: {
  activeBlock?: BlockNavKey;
  mobile?: boolean;
}) {
  return (
    <section class="blocks-category-navigation">
      <header class="blocks-category-navigation-header">
        <h2>Categories</h2>
        <span>{total} blocks</span>
      </header>
      <nav aria-label={mobile ? "Mobile block categories" : "Docs blocks"}>
        <ul>
          {categories.map(({ key, label, href, count }) => {
            const countId = `block-category-${mobile ? "mobile" : "desktop"}-${key}-count`;
            const link = (
              <a
                class="blocks-category-link"
                href={withBasePath(href)}
                aria-label={label}
                aria-describedby={countId}
                aria-current={activeBlock === key ? "page" : undefined}
              >
                <span>{label}</span>
                <span id={countId} class="blocks-category-count">
                  {count}
                  <span class="sr-only"> {count === 1 ? "variant" : "variants"}</span>
                </span>
              </a>
            );
            return <li key={key}>{mobile ? <SheetClose asChild>{link}</SheetClose> : link}</li>;
          })}
        </ul>
      </nav>
    </section>
  );
}
