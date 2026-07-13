import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
  ThemeToggle,
} from "@kamod-ch/ui";
import { Menu, SunMoon } from "lucide-preact";
import type { ComponentChildren } from "preact";
import { useMemo } from "preact/hooks";
import { withBasePath } from "../../base-path";
import { DemoShell, demoTopNavItems } from "../../layout/DemoShell";
import { GithubRepoLink } from "../../layout/GithubRepoLink";
import { ThemePresetSelect } from "../../theme/ThemePresetSelect";
import { docsUpdatedComponentSlugs } from "../registry";
import type { DocPageModule, DocSection } from "../types";

type DocsShellProps = {
  isComponentsOverview: boolean;
  activeDoc: DocPageModule | null;
  activeSection: string;
  docs: DocPageModule[];
  mainContent: ComponentChildren;
  getDocHref?: (slug: string) => string;
  componentsOverviewHref?: string;
  getSectionHref?: (sectionId: string) => string;
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
  isComponentsOverview,
  activeDoc,
  activeSection,
  docs,
  mainContent,
  getDocHref = (slug) => withBasePath(`/docs/${slug}/installation`),
  componentsOverviewHref = withBasePath("/docs/components"),
  getSectionHref,
}: DocsShellProps) => {
  const tocSections = activeDoc ? groupTocSections(activeDoc.sections) : null;
  const sortedDocs = useMemo(
    () => [...docs].sort((a, b) => a.title.localeCompare(b.title)),
    [docs],
  );
  const installationSection = tocSections?.installation ?? null;
  const usageSection = tocSections?.usage ?? null;
  const exampleSections = tocSections?.examples ?? [];
  const apiReferenceSection = tocSections?.apiReference ?? null;
  const hasActiveExampleSection =
    tocSections?.examples.some((section) => section.id === activeSection) ?? false;
  const proFeedbackFormUrl =
    (import.meta.env.VITE_PRO_FEEDBACK_FORM_URL ?? "").trim() || PRO_FEEDBACK_FORM_DEFAULT;
  const showToc = Boolean(!isComponentsOverview && activeDoc);
  const showRightSidebar = showToc || isComponentsOverview;

  const docsPrimaryNavEntries = useMemo(
    () => [
      {
        key: "__overview",
        label: "Components overview",
        active: isComponentsOverview,
        href: componentsOverviewHref,
        showUpdatedBadge: false as const,
      },
      ...sortedDocs.map((doc) => ({
        key: doc.slug,
        label: doc.title,
        active: doc.slug === activeDoc?.slug,
        href: getDocHref(doc.slug),
        showUpdatedBadge: docsUpdatedComponentSlugs.has(doc.slug) as boolean,
      })),
    ],
    [activeDoc?.slug, componentsOverviewHref, getDocHref, isComponentsOverview, sortedDocs],
  );

  return (
    <DemoShell
      brand="Kamod UI"
      rootClassName="docs-shell"
      topNavItems={demoTopNavItems}
      topbarLeading={
        <Sheet class="docs-mobile-menu" lockBodyScroll>
          <SheetTrigger aria-label="Open navigation menu" class="docs-mobile-menu-trigger">
            <Menu size={18} />
          </SheetTrigger>
          <SheetContent class="docs-mobile-sheet" side="left" aria-label="Docs navigation panel">
            <div class="docs-mobile-sheet-head">
              <h2>Components</h2>
            </div>
            <nav aria-label="Mobile docs navigation" class="docs-mobile-sheet-nav">
              {docsPrimaryNavEntries.map((entry) => (
                <SheetClose asChild key={entry.key}>
                  <a class={`docs-nav-button ${entry.active ? "is-active" : ""}`} href={entry.href}>
                    <span>{entry.label}</span>
                    {entry.showUpdatedBadge ? <Badge variant="success">updated</Badge> : null}
                  </a>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      }
      leftSidebar={
        <>
          <h2>Components</h2>
          <nav aria-label="Docs components" class="docs-sidebar-nav">
            {docsPrimaryNavEntries.map((entry) => (
              <a
                key={entry.key}
                class={`docs-nav-button ${entry.active ? "is-active" : ""}`}
                href={entry.href}
              >
                <span>{entry.label}</span>
              </a>
            ))}
          </nav>
        </>
      }
      topbarActions={
        <>
          <ThemePresetSelect class="docs-theme-preset" selectClass="docs-theme-preset-select" />
          <GithubRepoLink />
          <ThemeToggle class="docs-topbar-theme-toggle">
            <SunMoon />
          </ThemeToggle>
        </>
      }
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
