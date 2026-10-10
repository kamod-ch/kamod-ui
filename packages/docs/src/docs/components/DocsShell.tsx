import type { ComponentChildren } from "preact";
import { withBasePath } from "../../base-path";
import type { BlockNavKey } from "../../blocks/block-nav-config";
import { DemoShell, demoTopNavItems } from "../../layout/DemoShell";
import { DocsTopbarActions } from "../../layout/DocsTopbarActions";
import { DocsSidebarNavigation } from "../../layout/navigation/DocsSidebarNavigation";
import { useRightSidebarScroll } from "../../layout/navigation/right-sidebar-memory";
import type { DocPageModule, DocSection } from "../types";
import { FeedbackCard } from "./FeedbackCard";
import { GettingStartedReference } from "./GettingStartedReference";
import { PageContentsHeading } from "./PageContentsHeading";
import { flattenContents, PageContentsList } from "./PageContentsList";

export type DocsSidebarScope = "components" | "blocks" | "forms" | "packages" | "getting-started";

type DocsShellProps = {
  sidebarScope: DocsSidebarScope;
  /** Show the right promo column on overview pages. */
  isSectionOverview?: boolean;
  /** Optional page-local contents above the feedback card. */
  pageContents?: ComponentChildren;
  /** Current route for pages that do not use component-document metadata. */
  navigationPath?: string;
  activeDoc: DocPageModule | null;
  activeSection: string;
  /** Optional content-column introduction above the sidebar and content row. */
  contentHeader?: ComponentChildren;
  /** Desktop preview beside the content introduction and above category navigation. */
  sidebarHeader?: ComponentChildren;
  mainContent: ComponentChildren;
  getDocHref?: (slug: string) => string;
  componentsOverviewHref?: string;
  formsOverviewHref?: string;
  packagesOverviewHref?: string;
  getSectionHref?: (sectionId: string) => string;
  activeBlock?: BlockNavKey;
};

type TocSectionGroups = {
  installation: DocSection | null;
  usage: DocSection | null;
  examples: DocSection[];
  apiReference: DocSection | null;
};

const groupTocSections = (sections: DocSection[]): TocSectionGroups => {
  const groups: TocSectionGroups = {
    installation: null,
    usage: null,
    examples: [],
    apiReference: null,
  };

  sections.forEach((section) => {
    if (section.id === "installation") {
      groups.installation = section;
      return;
    }
    if (section.id === "usage") {
      groups.usage = section;
      return;
    }
    if (section.id === "api-reference") {
      groups.apiReference = section;
      return;
    }
    groups.examples.push(section);
  });

  return groups;
};

export const DocsShell = ({
  sidebarScope,
  isSectionOverview = false,
  pageContents,
  navigationPath,
  activeDoc,
  activeSection,
  contentHeader,
  sidebarHeader,
  mainContent,
  getDocHref = (slug) => withBasePath(`/docs/${slug}/installation`),
  componentsOverviewHref = withBasePath("/docs/components"),
  formsOverviewHref = withBasePath("/docs/forms"),
  packagesOverviewHref = withBasePath("/docs/packages"),
  getSectionHref,
  activeBlock,
}: DocsShellProps) => {
  const tocSections = activeDoc ? groupTocSections(activeDoc.sections) : null;
  const installationSection = tocSections?.installation ?? null;
  const usageSection = tocSections?.usage ?? null;
  const exampleSections = tocSections?.examples ?? [];
  const apiReferenceSection = tocSections?.apiReference ?? null;
  const hasActiveExampleSection =
    tocSections?.examples.some(
      (section) =>
        section.id === activeSection ||
        flattenContents(section.children ?? []).some(({ id }) => id === activeSection),
    ) ?? false;
  const showToc = Boolean(!pageContents && !isSectionOverview && activeDoc);
  const showRightSidebar = showToc || isSectionOverview || Boolean(pageContents);
  const contentsRef = useRightSidebarScroll<HTMLDivElement>(
    "contents",
    Boolean(pageContents) || showToc,
  );

  const sectionLinks = (sections: DocSection[], depth = 1) => (
    <PageContentsList
      entries={sections.map(({ title, ...section }) => ({ ...section, label: title }))}
      activeId={activeSection}
      depth={depth}
      getHref={(id) =>
        activeDoc?.sections.some((section) => section.id === id)
          ? (getSectionHref?.(id) ?? `#${id}`)
          : `#${id}`
      }
    />
  );

  // Derive the current route from page metadata so SSR paints the correct open group.
  const pathname = activeDoc
    ? getDocHref(activeDoc.slug)
    : sidebarScope === "blocks"
      ? withBasePath(activeBlock ? `/blocks/${activeBlock}` : "/blocks")
      : {
          "getting-started": withBasePath("/docs/getting-started"),
          components: componentsOverviewHref,
          forms: formsOverviewHref,
          packages: packagesOverviewHref,
        }[sidebarScope];

  return (
    <DemoShell
      brand="Kamod UI"
      rootClassName={`docs-shell${pageContents ? " docs-shell-page-contents" : ""}`}
      topNavItems={demoTopNavItems}
      activeTopNavHref={withBasePath(
        sidebarScope === "blocks" ? "/blocks" : `/docs/${sidebarScope}`,
      )}
      leftSidebar={<DocsSidebarNavigation pathname={navigationPath ?? pathname} />}
      topbarActions={<DocsTopbarActions />}
      contentHeader={contentHeader}
      sidebarHeader={sidebarHeader}
      mainContent={
        <>
          {mainContent}
          {activeDoc?.renderFooter ? (
            activeDoc.renderFooter()
          ) : (
            <GettingStartedReference scope={sidebarScope} slug={activeDoc?.slug} />
          )}
        </>
      }
      rightSidebar={
        !showRightSidebar ? null : (
          <>
            {(pageContents || showToc) && (
              <div class="docs-rightbar-contents" ref={contentsRef}>
                {pageContents}
                {showToc ? (
                  <>
                    <PageContentsHeading
                      level="h3"
                      count={
                        [installationSection, usageSection, apiReferenceSection].filter(Boolean)
                          .length
                      }
                    />
                    <nav aria-label="On this page">
                      {installationSection && sectionLinks([installationSection])}
                      {usageSection && sectionLinks([usageSection])}
                      {exampleSections.length ? (
                        <div class="docs-toc-group">
                          <span
                            class={`docs-toc-group-label ${hasActiveExampleSection ? "is-active" : ""}`}
                          >
                            Examples
                          </span>
                          {sectionLinks(exampleSections, 2)}
                        </div>
                      ) : null}
                      {apiReferenceSection && sectionLinks([apiReferenceSection])}
                    </nav>
                  </>
                ) : null}
              </div>
            )}

            <FeedbackCard />
          </>
        )
      }
    />
  );
};
