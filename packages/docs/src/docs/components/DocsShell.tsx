import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { withBasePath } from "../../base-path";
import type { BlockNavKey } from "../../blocks/block-nav-config";
import { DemoShell, demoTopNavItems } from "../../layout/DemoShell";
import { DocsTopbarActions } from "../../layout/DocsTopbarActions";
import { NavigationDirectory } from "../../layout/navigation/NavigationDirectory";
import { navigationGroups } from "../../layout/navigation/navigation-data";
import type { DocPageModule, DocSection } from "../types";

export type DocsSidebarScope = "components" | "blocks" | "forms" | "packages";

type DocsShellProps = {
  sidebarScope: DocsSidebarScope;
  /** Show right promo column on overview pages (no TOC). */
  isSectionOverview?: boolean;
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

const PRO_FEEDBACK_FORM_DEFAULT = "https://tally.so/r/ODYbWK";

export const DocsShell = ({
  sidebarScope,
  isSectionOverview = false,
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
    tocSections?.examples.some((section) => section.id === activeSection) ?? false;
  const proFeedbackFormUrl =
    (import.meta.env.VITE_PRO_FEEDBACK_FORM_URL ?? "").trim() || PRO_FEEDBACK_FORM_DEFAULT;
  const showToc = Boolean(!isSectionOverview && activeDoc);
  const showRightSidebar = showToc || isSectionOverview;

  // Derive the current route from page metadata so SSR paints the correct open group.
  const pathname = activeDoc
    ? getDocHref(activeDoc.slug)
    : sidebarScope === "blocks"
      ? withBasePath(activeBlock ? `/blocks/${activeBlock}` : "/blocks")
      : {
          components: componentsOverviewHref,
          forms: formsOverviewHref,
          packages: packagesOverviewHref,
        }[sidebarScope];
  const sidebarNav = <NavigationDirectory groups={navigationGroups} pathname={pathname} />;

  return (
    <DemoShell
      brand="Kamod UI"
      rootClassName="docs-shell"
      topNavItems={demoTopNavItems}
      leftSidebar={sidebarNav}
      topbarActions={<DocsTopbarActions />}
      contentHeader={contentHeader}
      sidebarHeader={sidebarHeader}
      mainContent={mainContent}
      rightSidebar={
        !showRightSidebar ? null : (
          <>
            {showToc ? (
              <>
                <h3>On this page</h3>
                <nav aria-label="On this page">
                  {installationSection ? (
                    <a
                      class={`docs-toc-link ${activeSection === installationSection.id ? "is-active" : ""}`}
                      href={
                        getSectionHref?.(installationSection.id) ?? `#${installationSection.id}`
                      }
                    >
                      {installationSection.title}
                    </a>
                  ) : null}
                  {usageSection ? (
                    <a
                      class={`docs-toc-link ${activeSection === usageSection.id ? "is-active" : ""}`}
                      href={getSectionHref?.(usageSection.id) ?? `#${usageSection.id}`}
                    >
                      {usageSection.title}
                    </a>
                  ) : null}
                  {exampleSections.length ? (
                    <div class="docs-toc-group">
                      <span
                        class={`docs-toc-group-label ${hasActiveExampleSection ? "is-active" : ""}`}
                      >
                        Examples
                      </span>
                      <div class="docs-toc-children">
                        {exampleSections.map((section) => (
                          <a
                            key={section.id}
                            class={`docs-toc-link docs-toc-link-child ${activeSection === section.id ? "is-active" : ""}`}
                            href={getSectionHref?.(section.id) ?? `#${section.id}`}
                          >
                            {section.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {apiReferenceSection ? (
                    <a
                      class={`docs-toc-link ${activeSection === apiReferenceSection.id ? "is-active" : ""}`}
                      href={
                        getSectionHref?.(apiReferenceSection.id) ?? `#${apiReferenceSection.id}`
                      }
                    >
                      {apiReferenceSection.title}
                    </a>
                  ) : null}
                </nav>
              </>
            ) : null}

            <Card class="docs-promo">
              <CardHeader class="gap-1.5">
                <CardTitle class="text-base leading-snug">Straight talk</CardTitle>
                <CardDescription class="grid gap-2.5 text-sm leading-snug">
                  <span class="text-foreground/90">
                    We&apos;re planning a Pro tier with individually unlockable components.
                  </span>
                  <span class="font-medium text-foreground">Would that matter to you?</span>
                </CardDescription>
              </CardHeader>
              <CardContent class="grid gap-2.5">
                <Button
                  href={proFeedbackFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                  variant="default"
                  class="w-full"
                >
                  2-minute feedback
                </Button>
              </CardContent>
            </Card>
          </>
        )
      }
    />
  );
};
