import { ArrowRightIcon, ArrowUpRightIcon, BookOpenIcon, CodeIcon } from "@kamod-ch/icons/lucide";
import type { ComponentChildren } from "preact";
import { withBasePath } from "../../base-path";
import { LibraryDirectoryResources } from "./LibraryDirectoryResources";
import { LibraryJumpLinks } from "./LibraryJumpLinks";
import { LibrarySection } from "./LibrarySection";

export type LibraryEntry = {
  label: string;
  href?: string;
  detail?: string;
  count?: number;
  planned?: boolean;
  packagePath?: string;
};

/** Shared directory presentation; callers supply metadata without importing live examples. */
export function LibraryDirectory({
  kind,
  description,
  header,
  footer,
  items,
  children,
}: {
  kind: "blocks" | "components";
  description?: ComponentChildren;
  header?: ComponentChildren;
  footer?: ComponentChildren;
  items: LibraryEntry[];
  children?: ComponentChildren;
}) {
  const isBlocks = kind === "blocks";
  const title = isBlocks ? "Blocks" : "Components";
  const other = isBlocks ? "Components" : "Blocks";
  return (
    <section id="top" class={`docs-components-overview library-directory docs-${kind}-overview`}>
      {header ?? (
        <>
          <header class="library-directory-header">
            <div class="library-directory-eyebrow">
              <span class="library-directory-count">
                {items.length} {isBlocks ? "collections" : "components"}
              </span>
              <span class="library-directory-platform">
                Built for <strong>Preact</strong>
              </span>
            </div>
            <div class="library-directory-title">
              <h1>
                {isBlocks
                  ? "Blocks for complete application layouts"
                  : "Components for flexible Preact interfaces"}
              </h1>
            </div>
            <p class="docs-components-intro">{description}</p>
            <p class="library-directory-start-note">
              <strong>{isBlocks ? "Your source, your app." : "Start with the essentials."}</strong>{" "}
              {isBlocks ? (
                <>
                  Copy a variant, then adapt its <code>Preact</code> composition.
                </>
              ) : (
                <>
                  Build with <code>@kamod-ch/ui</code> and shared tokens.
                </>
              )}{" "}
              <a href={withBasePath("/docs/theming/installation")}>Set up your project</a>.
            </p>
            <div class="library-directory-actions">
              <div class="library-directory-browse-actions">
                <a class="docs-icon-button library-directory-browse" href="#library-items">
                  Browse {title.toLowerCase()}
                  <ArrowRightIcon size={14} aria-hidden="true" />
                </a>
                <a href={withBasePath(isBlocks ? "/docs/components" : "/blocks")}>
                  Explore {other.toLowerCase()}
                  <ArrowUpRightIcon size={13} aria-hidden="true" />
                </a>
              </div>
              <div class="library-directory-icon-links">
                <a
                  class="docs-icon-button"
                  href={withBasePath("/docs/theming/css-setup")}
                  aria-label="Open CSS setup guide"
                  title="CSS setup"
                >
                  <BookOpenIcon size={16} aria-hidden="true" />
                </a>
                <a
                  class="docs-icon-button"
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
          <LibraryJumpLinks label="Directory sections">
            <li>
              <a href="#library-items">{isBlocks ? "Available collections" : "All components"}</a>
            </li>
            {isBlocks && (
              <li>
                <a href="#planned-collections">Planned collections</a>
              </li>
            )}
            <li>
              <a href="#library-guides">Setup & theming</a>
            </li>
          </LibraryJumpLinks>
        </>
      )}
      <LibrarySection
        class="library-directory-items"
        headingId="library-items"
        title={isBlocks ? "All block categories" : "All components"}
        label="Available now"
        meta="Source included"
        description={
          isBlocks ? (
            <>
              <p>
                Choose a collection that matches the screen you are building, then compare its
                variants for navigation, content placement and responsive behavior. Open any block
                to explore its <strong>live preview, source files and setup guide</strong>. The
                variant count shows how many layouts are available in each collection.
              </p>
              <p>
                Start with the closest composition and follow its installation instructions before
                changing the layout. Keep the supplied files together, replace demo content with
                your own data, and connect routing or service callbacks in your app. The{" "}
                <a href="#library-guides">setup and theming guides</a> below help you give every
                block the same <code>Preact</code> and styling foundation.
              </p>
            </>
          ) : (
            <>
              <p>
                Find the building block for your next interaction, from a single input or button to
                navigation, overlays and data displays. Each linked page brings together{" "}
                <strong>installation, working examples and an API reference</strong>, so you can see
                how the component behaves before connecting it to your own interface.
              </p>
              <p>
                Begin with a small example, then adapt its <code>props</code>, state and callbacks
                to your app. Combine components from <code>@kamod-ch/ui</code> with shared theme
                tokens to keep their appearance consistent. If you need a complete page layout,
                explore the <a href={withBasePath("/blocks")}>block collections</a> to see these
                pieces working together.
              </p>
            </>
          )
        }
      >
        <LibraryGrid label={isBlocks ? "Block categories" : "All components"} items={items} />
      </LibrarySection>
      {children}
      <LibraryDirectoryResources />
      {footer}
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
            {item.packagePath && <code>{item.packagePath}</code>}
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
