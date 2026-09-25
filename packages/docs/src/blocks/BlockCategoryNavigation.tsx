/** Shared desktop/mobile category navigation; variants come from component-free metadata. */
import { ChevronRightIcon } from "@kamod-ch/icons/lucide";
import { Collapsible, CollapsibleContent, CollapsibleTrigger, SheetClose } from "@kamod-ch/ui";
import type { JSX } from "preact";
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

/** Dismiss the mobile sheet only for navigation, never for expanding a category. */
function NavigationLink({
  mobile,
  ...props
}: JSX.AnchorHTMLAttributes<HTMLAnchorElement> & {
  mobile: boolean;
}) {
  const link = <a {...props} />;
  return mobile ? <SheetClose asChild>{link}</SheetClose> : link;
}

/** A category link and its disclosure are sibling controls with independent actions. */
function CategoryItem({
  category,
  active,
  mobile,
}: {
  category: (typeof categories)[number];
  active: boolean;
  mobile: boolean;
}) {
  const { key, label, href, variants, placeholder } = category;
  const count = variants.length;
  const id = `block-category-${mobile ? "mobile" : "desktop"}-${key}`;
  const row = (
    <div class="blocks-category-row">
      <NavigationLink
        mobile={mobile}
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
      </NavigationLink>
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
              <NavigationLink
                mobile={mobile}
                class="blocks-category-variant-link"
                href={withBasePath(`${href}/${variant.id}`)}
                title={variant.description}
              >
                {getBlockDisplayName(variant.title)}
              </NavigationLink>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

/** Keep the same links, counts and disclosures in the sidebar and the mobile sheet. */
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
          {categories.map((category) => (
            <li key={category.key}>
              <CategoryItem
                category={category}
                active={activeBlock === category.key}
                mobile={mobile}
              />
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
