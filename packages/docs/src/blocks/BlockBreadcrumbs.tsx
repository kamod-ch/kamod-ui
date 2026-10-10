/** One breadcrumb hierarchy for category and variant headers. */
import { PageBreadcrumbs } from "../docs/components/PageBreadcrumbs";
import { type BlockCategory, blockCategories } from "./block-categories";
import { getBlockDisplayName } from "./block-overview-details";

/** A category becomes a link when a variant is the current page. */
export function BlockBreadcrumbs({
  category,
  variant,
  className,
}: {
  category: BlockCategory;
  variant?: string;
  className?: string;
}) {
  const label = blockCategories[category].label.replace(/\b\w/g, (letter) => letter.toUpperCase());
  return (
    <PageBreadcrumbs
      label="Block Breadcrumb"
      className={className}
      ancestors={[
        { label: "Home", href: "/" },
        { label: "Blocks", href: "/blocks" },
        ...(variant ? [{ label, href: `/blocks/${category}` }] : []),
      ]}
      current={variant ? getBlockDisplayName(variant) : label}
    />
  );
}
