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
import { visibleBlockNavItems } from "../../blocks/block-nav-config";
import { DemoShell, demoTopNavItems } from "../../layout/DemoShell";
import { GithubRepoLink } from "../../layout/GithubRepoLink";
import { ThemePresetSelect } from "../../theme/ThemePresetSelect";
import {
  componentDocPages,
  docsNewComponentSlugs,
  docsNewFormSlugs,
  docsNewMotionSlugs,
  docsNewPackageSlugs,
  docsUpdatedComponentSlugs,
  formDocPages,
  motionDocPages,
  packageDocPages,
} from "../registry";
import type { DocPageModule, DocSection } from "../types";

export type DocsSidebarScope = "components" | "blocks" | "forms" | "packages";

type DocsShellProps = {
  sidebarScope: DocsSidebarScope;
  /** Marks the "Components overview" sidebar link as active. */
  isComponentsOverview?: boolean;
  /** Marks the "Forms overview" sidebar link as active. */
  isFormsOverview?: boolean;
  /** Marks the "Packages overview" sidebar link as active. */
  isPackagesOverview?: boolean;
  /** Show right promo column on overview pages (no TOC). */
  isSectionOverview?: boolean;
  activeDoc: DocPageModule | null;
  activeSection: string;
  docs: DocPageModule[];
  mainContent: ComponentChildren;
  getDocHref?: (slug: string) => string;
  componentsOverviewHref?: string;
  formsOverviewHref?: string;
  packagesOverviewHref?: string;
  getSectionHref?: (sectionId: string) => string;
  activeBlock?:
    | "sidebar"
    | "app-sidebar"
    | "login"
    | "signup"
    | "auth"
    | "marketing"
    | "dashboard"
    | "communication"
    | "commerce";
};

type NavEntry = {
  key: string;
  label: string;
  active: boolean;
  href: string;
  badge?: "new" | "updated";
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

function NavLink({ entry, asSheetClose }: { entry: NavEntry; asSheetClose?: boolean }) {
  const className = `docs-nav-button ${entry.active ? "is-active" : ""}`;
  const content = (
    <>
      <span>{entry.label}</span>
      {entry.badge === "new" ? <Badge variant="success">new</Badge> : null}
      {entry.badge === "updated" ? <Badge variant="success">updated</Badge> : null}
    </>
  );

  if (asSheetClose) {
    return (
      <SheetClose asChild>
        <a class={className} href={entry.href}>
          {content}
        </a>
      </SheetClose>
    );
  }

  return (
    <a class={className} href={entry.href}>
      {content}
    </a>
  );
}

function SidebarSection({
  title,
  ariaLabel,
  entries,
  navClass,
}: {
  title: string;
  ariaLabel: string;
  entries: NavEntry[];
  navClass?: string;
}) {
  return (
    <>
      <h2>{title}</h2>
      <nav aria-label={ariaLabel} class={navClass ?? "docs-sidebar-nav"}>
        {entries.map((entry) => (
          <NavLink entry={entry} key={entry.key} />
        ))}
      </nav>
    </>
  );
}

function MobileSection({ title, entries }: { title: string; entries: NavEntry[] }) {
  return (
    <>
      <p class="docs-mobile-sheet-group-label">{title}</p>
      {entries.map((entry) => (
        <NavLink asSheetClose entry={entry} key={entry.key} />
      ))}
    </>
  );
}

export const DocsShell = ({
  sidebarScope,
  isComponentsOverview = false,
  isFormsOverview = false,
  isPackagesOverview = false,
  isSectionOverview = false,
  activeDoc,
  activeSection,
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

  const packageNavEntries = useMemo<NavEntry[]>(
    () => [
      {
        key: "__overview",
        label: "Packages overview",
        active: isPackagesOverview,
        href: packagesOverviewHref,
      },
      ...[...packageDocPages]
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((doc) => ({
          key: doc.slug,
          label: doc.title,
          active: doc.slug === activeDoc?.slug,
          href: getDocHref(doc.slug),
          badge: docsNewPackageSlugs.has(doc.slug) ? ("new" as const) : undefined,
        })),
    ],
    [activeDoc?.slug, getDocHref, isPackagesOverview, packagesOverviewHref],
  );

  const formNavEntries = useMemo<NavEntry[]>(
    () => [
      {
        key: "__overview",
        label: "Forms overview",
        active: isFormsOverview,
        href: formsOverviewHref,
      },
      ...[...formDocPages]
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((doc) => ({
          key: doc.slug,
          label: doc.title,
          active: doc.slug === activeDoc?.slug,
          href: getDocHref(doc.slug),
          badge: docsNewFormSlugs.has(doc.slug) ? ("new" as const) : undefined,
        })),
    ],
    [activeDoc?.slug, formsOverviewHref, getDocHref, isFormsOverview],
  );

  const componentNavEntries = useMemo<NavEntry[]>(() => {
    const mergedDocs = [
      ...componentDocPages.map((doc) => ({
        key: doc.slug,
        label: doc.title,
        sortLabel: doc.title,
        badge: docsNewComponentSlugs.has(doc.slug)
          ? ("new" as const)
          : docsUpdatedComponentSlugs.has(doc.slug)
            ? ("updated" as const)
            : undefined,
      })),
      ...motionDocPages.map((doc) => ({
        key: doc.slug,
        label: doc.navLabel ?? doc.title,
        sortLabel: doc.navLabel ?? doc.title,
        badge: docsNewMotionSlugs.has(doc.slug) ? ("new" as const) : undefined,
      })),
    ].sort((a, b) => a.sortLabel.localeCompare(b.sortLabel));

    return [
      {
        key: "__overview",
        label: "Components overview",
        active: isComponentsOverview,
        href: componentsOverviewHref,
      },
      ...mergedDocs.map((doc) => ({
        key: doc.key,
        label: doc.label,
        active: doc.key === activeDoc?.slug,
        href: getDocHref(doc.key),
        badge: doc.badge,
      })),
    ];
  }, [activeDoc?.slug, componentsOverviewHref, getDocHref, isComponentsOverview]);

  const blockNavEntries: NavEntry[] = visibleBlockNavItems.map((item) => ({
    key: item.key,
    label: item.label,
    active: activeBlock === item.key,
    href: withBasePath(item.href),
  }));

  const sidebarNav =
    sidebarScope === "blocks" ? (
      <SidebarSection
        title="Blocks"
        ariaLabel="Docs blocks"
        entries={blockNavEntries}
        navClass="docs-sidebar-nav docs-sidebar-nav--blocks"
      />
    ) : sidebarScope === "packages" ? (
      <SidebarSection
        title="Packages"
        ariaLabel="Docs packages"
        entries={packageNavEntries}
        navClass="docs-sidebar-nav docs-sidebar-nav--packages"
      />
    ) : sidebarScope === "forms" ? (
      <SidebarSection
        title="Forms"
        ariaLabel="Docs forms"
        entries={formNavEntries}
        navClass="docs-sidebar-nav docs-sidebar-nav--forms"
      />
    ) : (
      <SidebarSection
        title="Components"
        ariaLabel="Docs components"
        entries={componentNavEntries}
      />
    );

  const mobileNav = (
    <nav aria-label="Mobile docs navigation" class="docs-mobile-sheet-nav">
      {sidebarScope === "blocks" ? (
        <MobileSection title="Blocks" entries={blockNavEntries} />
      ) : sidebarScope === "packages" ? (
        <MobileSection title="Packages" entries={packageNavEntries} />
      ) : sidebarScope === "forms" ? (
        <MobileSection title="Forms" entries={formNavEntries} />
      ) : (
        <MobileSection title="Components" entries={componentNavEntries} />
      )}
    </nav>
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
              <h2>Docs</h2>
            </div>
            {mobileNav}
          </SheetContent>
        </Sheet>
      }
      leftSidebar={sidebarNav}
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
