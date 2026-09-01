import { withBasePath } from "../base-path";
import { type BlockNavKey, visibleBlockNavItems } from "./block-nav-config";

export type FeaturedBlockCategory = BlockNavKey;

export const FeaturedBlockChips = ({ active }: { active: FeaturedBlockCategory }) => (
  <div class="blocks-featured" aria-label="Featured block categories">
    {visibleBlockNavItems.map((category) =>
      category.key === active ? (
        <span class="blocks-featured-chip is-active" key={category.key}>
          {category.label}
        </span>
      ) : (
        <a class="blocks-featured-chip" href={withBasePath(category.href)} key={category.key}>
          {category.label}
        </a>
      ),
    )}
  </div>
);
