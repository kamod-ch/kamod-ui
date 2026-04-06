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
} from "@kamod-ui/core";
import { Menu, SunMoon } from "lucide-preact";
import { DemoShell, demoTopNavItems } from "../../layout/DemoShell";
import { ThemePresetSelect } from "../../theme/ThemePresetSelect";
import type { ComponentChildren } from "preact";
import { useMemo } from "preact/hooks";
import { docsUpdatedComponentSlugs } from "../registry";
import type { DocPageModule, DocSection } from "../types";

type DocsShellProps = {
  isComponentsOverview: boolean;
  activeDoc: DocPageModule | null;
  activeSection: string;
  docs: DocPageModule[];
  onNavigateDoc: (slug: string) => void;
  onNavigateComponentsOverview: () => void;
  onNavigateSection: (sectionId: string) => void;
  mainContent: ComponentChildren;
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
  onNavigateDoc,
  onNavigateComponentsOverview,
  onNavigateSection,
  mainContent,
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
        onSelect: onNavigateComponentsOverview,
        showUpdatedBadge: false as const,
      },
      ...sortedDocs.map((doc) => ({
        key: doc.slug,
        label: doc.title,
        active: doc.slug === activeDoc?.slug,
        onSelect: () => onNavigateDoc(doc.slug),
        showUpdatedBadge: docsUpdatedComponentSlugs.has(doc.slug) as boolean,
      })),
    ],
    [
      activeDoc?.slug,
      isComponentsOverview,
      onNavigateComponentsOverview,
      onNavigateDoc,
      sortedDocs,
    ],
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
                <SheetClose
                  key={entry.key}
                  class={`docs-nav-button ${entry.active ? "is-active" : ""}`}
                  onClick={entry.onSelect}
                >
                  <span>{entry.label}</span>
                  {entry.showUpdatedBadge ? <Badge variant="success">updated</Badge> : null}
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
              <button
                key={entry.key}
                type="button"
                class={`docs-nav-button ${entry.active ? "is-active" : ""}`}
                onClick={entry.onSelect}
              >
                <span>{entry.label}</span>
              </button>
            ))}
          </nav>
        </>
      }
      topbarActions={
        <>
          <ThemePresetSelect class="docs-theme-preset" selectClass="docs-theme-preset-select" />
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
                    <button
                      class={`docs-toc-link ${activeSection === installationSection.id ? "is-active" : ""}`}
                      onClick={() => onNavigateSection(installationSection.id)}
                    >
                      {installationSection.title}
                    </button>
                  ) : null}
                  {usageSection ? (
                    <button
                      class={`docs-toc-link ${activeSection === usageSection.id ? "is-active" : ""}`}
                      onClick={() => onNavigateSection(usageSection.id)}
                    >
                      {usageSection.title}
                    </button>
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
                          <button
                            key={section.id}
                            class={`docs-toc-link docs-toc-link-child ${activeSection === section.id ? "is-active" : ""}`}
                            onClick={() => onNavigateSection(section.id)}
                          >
                            {section.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {apiReferenceSection ? (
                    <button
                      class={`docs-toc-link ${activeSection === apiReferenceSection.id ? "is-active" : ""}`}
                      onClick={() => onNavigateSection(apiReferenceSection.id)}
                    >
                      {apiReferenceSection.title}
                    </button>
                  ) : null}
                </nav>
              </>
            ) : null}

            <Card class="docs-promo">
              <CardHeader class="gap-1.5">
                <CardTitle class="text-base leading-snug">Kurz und ehrlich</CardTitle>
                <CardDescription class="grid gap-2.5 text-sm leading-snug">
                  <span class="text-foreground/90">
                    Wir planen eine Pro-Variante mit einzeln freischaltbaren Komponenten.
                  </span>
                  <span class="font-medium text-foreground">Ist das für euch relevant?</span>
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
                  2 Minuten Feedback
                </Button>
              </CardContent>
            </Card>
          </>
        )
      }
    />
  );
};
