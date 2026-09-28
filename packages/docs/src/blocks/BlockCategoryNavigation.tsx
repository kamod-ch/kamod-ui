/** Desktop category navigation; variants come from component-free metadata. */
import { ChevronRightIcon } from "@kamod-ch/icons/lucide";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@kamod-ch/ui";
import { withBasePath } from "../base-path";
import { type BlockOverviewEntry, blockCategories } from "./block-categories";
import {
  type BlockNavKey,
  PLACEHOLDER_BLOCK_CATEGORIES,
  visibleBlockNavItems,
} from "./block-nav-config";
import { getBlockDisplayName } from "./block-overview-details";

const variantsByCategory = new Map<string, readonly BlockOverviewEntry[]>(
  Object.entries(blockCategories).map(([key, category]) => [key, category.blocks]),
);
const categories = [
  ...visibleBlockNavItems.map((item) => ({
    ...item,
    variants: variantsByCategory.get(item.key) ?? [],
    placeholder: false,
  })),
  ...PLACEHOLDER_BLOCK_CATEGORIES.map((item) => ({
    ...item,
    href: `/blocks/${item.key}`,
    variants: [],
    placeholder: true,
  })),
].sort((a, b) => b.variants.length - a.variants.length || a.label.localeCompare(b.label, "en"));
const total = categories.reduce((sum, category) => sum + category.variants.length, 0);

/** A category link and its disclosure are sibling controls with independent actions. */
function CategoryItem({
  category,
  active,
}: {
  category: (typeof categories)[number];
  active: boolean;
}) {
  const { key, label, href, variants, placeholder } = category;
  const count = variants.length;
  const id = `block-category-desktop-${key}`;
  const row = (
    <div class="blocks-category-row">
      <a
        class="blocks-category-link"
        href={withBasePath(href)}
        aria-label={label}
        aria-describedby={`${id}-count`}
        aria-current={active ? "page" : undefined}
        data-block-placeholder={placeholder ? "" : undefined}
        title={placeholder ? "No blocks yet — page not available" : undefined}
      >
        <span>{label}</span>
        <span id={`${id}-count`} class="blocks-category-count">
          {count}
          <span class="sr-only">
            {" "}
            {count === 1 ? "variant" : "variants"}
            {placeholder && "; page not available yet"}
          </span>
        </span>
      </a>
      {count > 0 && (
        <CollapsibleTrigger
          class="blocks-category-toggle"
          aria-label={`Toggle ${label} variants`}
          aria-controls={`${id}-variants`}
        >
          <ChevronRightIcon size={15} strokeWidth={1.75} aria-hidden="true" />
        </CollapsibleTrigger>
      )}
    </div>
  );
  if (!count) return row;

  return (
    <Collapsible>
      {row}
      <CollapsibleContent id={`${id}-variants`}>
        <ul class="blocks-category-variants" aria-label={`${label} variants`}>
          {variants.map((variant) => (
            <li key={variant.id}>
              <a
                class="blocks-category-variant-link"
                href={withBasePath(`${href}/${variant.id}`)}
                title={variant.description}
              >
                {getBlockDisplayName(variant.title)}
              </a>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

/** Show published collections and planned categories in the overview sidebar. */
export function BlockCategoryNavigation({ activeBlock }: { activeBlock?: BlockNavKey }) {
  return (
    <section class="blocks-category-navigation">
      <header class="blocks-category-navigation-header">
        <h2>Categories</h2>
        <span>{total} blocks</span>
      </header>
      <nav aria-label="Docs blocks">
        <ul>
          {categories.map((category) => (
            <li key={category.key}>
              <CategoryItem category={category} active={activeBlock === category.key} />
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
