/** Shared site chrome and category backlink; block-specific guides remain in their own modules. */
import { ArrowLeftIcon } from "@kamod-ch/icons/lucide";
import type { ComponentChildren } from "preact";
import { withBasePath } from "../base-path";
import { DemoShell, demoTopNavItems } from "../layout/DemoShell";
import { DocsTopbarActions } from "../layout/DocsTopbarActions";
import { type BlockCategory, blockCategories } from "./block-categories";

/** Use a custom header for richer guides without duplicating the site shell or return navigation. */
export const BlockDetailPage = ({
  category,
  children,
  header,
}: {
  category: BlockCategory;
  children: ComponentChildren;
  header?: ComponentChildren;
}) => (
  <DemoShell
    brand="Kamod UI"
    rootClassName="docs-shell"
    topNavItems={demoTopNavItems}
    topbarActions={<DocsTopbarActions />}
    mainContent={
      <section class="docs-components-overview blocks-sidebar-page blocks-sidebar-detail">
        {header ?? (
          <header class="blocks-detail-header">
            <a class="blocks-detail-back" href={withBasePath(`/blocks/${category}`)}>
              <ArrowLeftIcon
                size={16}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              />
              All {blockCategories[category].label} blocks
            </a>
          </header>
        )}
        {children}
      </section>
    }
  />
);
