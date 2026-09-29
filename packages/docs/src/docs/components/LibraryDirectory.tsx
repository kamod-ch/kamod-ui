import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  BookOpenIcon,
  CodeIcon,
  ComponentIcon,
  LayersIcon,
  PaletteIcon,
} from "@kamod-ch/icons/lucide";
import type { ComponentChildren } from "preact";
import { withBasePath } from "../../base-path";

export type LibraryEntry = {
  label: string;
  href?: string;
  detail?: string;
  count?: number;
  planned?: boolean;
};

/** Shared directory presentation; callers supply metadata without importing live examples. */
export function LibraryDirectory({
  kind,
  description,
  items,
  children,
}: {
  kind: "blocks" | "components";
  description: ComponentChildren;
  items: LibraryEntry[];
  children?: ComponentChildren;
}) {
  const isBlocks = kind === "blocks";
  const Icon = isBlocks ? LayersIcon : ComponentIcon;
  const title = isBlocks ? "Blocks" : "Components";
  const other = isBlocks ? "Components" : "Blocks";
  return (
    <section class={`docs-components-overview library-directory docs-${kind}-overview`}>
      <header class="library-directory-header">
        <div class="library-directory-eyebrow">
          <Icon size={15} aria-hidden="true" />
          The Kamod library
        </div>
        <div class="library-directory-title">
          <h1>{title}</h1>
          <span>
            {items.length} {isBlocks ? "collections" : "components"}
          </span>
        </div>
        <p class="docs-components-intro">{description}</p>
        <div class="library-directory-actions">
          <a href={withBasePath(isBlocks ? "/docs/components" : "/blocks")}>
            Explore {other.toLowerCase()}
            <ArrowRightIcon size={14} aria-hidden="true" />
          </a>
          <div class="library-directory-icon-links">
            <a
              href={withBasePath("/docs/theming/css-setup")}
              aria-label="Open CSS setup guide"
              title="CSS setup"
            >
              <BookOpenIcon size={16} aria-hidden="true" />
            </a>
            <a
              href={`https://github.com/kamod-ch/kamod-ui/tree/main/packages/${isBlocks ? "blocks" : "core"}/src`}
              target="_blank"
              rel="noreferrer"
              aria-label={`Browse ${kind} source on GitHub`}
              title="Browse source"
            >
              <CodeIcon size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>
      <div class="library-directory-section-heading">
        <h2 class="docs-components-grid-heading">
          {isBlocks ? "All block categories" : "All components"}
        </h2>
        <span>Source included</span>
      </div>
      <LibraryGrid label={isBlocks ? "Block categories" : "All components"} items={items} />
      {children}
      <section class="library-directory-resources" aria-label="Make it your own">
        <div>
          <PaletteIcon size={18} aria-hidden="true" />
          <h2>Make it your own</h2>
          <p>One set of theme tokens, from individual controls to complete layouts.</p>
        </div>
        <nav aria-label="Library guides">
          <a href={withBasePath("/docs/theming/css-setup")}>
            Connect your styles
            <ArrowUpRightIcon size={14} aria-hidden="true" />
          </a>
          <a href={withBasePath("/docs/theming/usage")}>
            Customize the theme
            <ArrowUpRightIcon size={14} aria-hidden="true" />
          </a>
        </nav>
      </section>
    </section>
  );
}

export function LibraryGrid({ label, items }: { label: string; items: LibraryEntry[] }) {
  return (
    <nav class="docs-components-grid library-directory-grid" aria-label={label}>
      {items.map((item) => {
        const Tag = item.href ? "a" : "span";
        const count =
          item.count === undefined
            ? undefined
            : `${item.count} ${item.count === 1 ? "variant" : "variants"}`;
        return (
          <Tag
            key={item.label}
            href={item.href ? withBasePath(item.href) : undefined}
            class={`docs-component-item library-directory-item${item.planned ? " is-planned" : ""}`}
            aria-label={
              count
                ? `${item.label} ${count}${item.planned ? "; page not available yet" : ""}`
                : undefined
            }
          >
            <span class="library-directory-item-title">
              {item.label}
              <ArrowUpRightIcon size={14} aria-hidden="true" />
            </span>
            {item.detail && <span class="library-directory-item-description">{item.detail}</span>}
            {count && (
              <span class="docs-block-category-count">
                {count}
                {item.planned && <span>Planned</span>}
              </span>
            )}
          </Tag>
        );
      })}
    </nav>
  );
}
