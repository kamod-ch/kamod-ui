/** One breadcrumb hierarchy for category and variant headers. */
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@kamod-ch/ui";
import { withBasePath } from "../base-path";
import { type BlockCategory, blockCategories } from "./block-categories";

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
  const label = blockCategories[category].label;
  return (
    <Breadcrumb class={className} aria-label="Block breadcrumb">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={withBasePath("/")}>Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={withBasePath("/blocks/sidebar")}>Blocks</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {variant ? (
            <BreadcrumbLink class="capitalize" href={withBasePath(`/blocks/${category}`)}>
              {label.replace(/\b\w/g, (letter) => letter.toUpperCase())}
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage class="capitalize">{label}</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {variant && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{variant}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
