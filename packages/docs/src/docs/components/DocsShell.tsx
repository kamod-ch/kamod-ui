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
import {
  componentDocPages,
  docsNewFormSlugs,
  docsNewPackageSlugs,
  docsUpdatedComponentSlugs,
  formDocPages,
  packageDocPages,
} from "../registry";
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

export const DocsShell = ({
  isComponentsOverview,
  activeDoc,
  activeSection,
  mainContent,
  getDocHref = (slug) => withBasePath(`/docs/${slug}/installation`),
  componentsOverviewHref = withBasePath("/docs/components"),
  getSectionHref,
  activeBlock,
}: DocsShellProps) => {
  const tocSections = activeDoc ? groupTocSections(activeDoc.sections) : null;
  const sortedPackageDocs = useMemo(
    () => [...packageDocPages].sort((a, b) => a.title.localeCompare(b.title)),
    [],
  );
  const sortedFormDocs = useMemo(
    () => [...formDocPages].sort((a, b) => a.title.localeCompare(b.title)),
    [],
  );
  const sortedComponentDocs = useMemo(
    () => [...componentDocPages].sort((a, b) => a.title.localeCompare(b.title)),
    [],
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

  const packageNavEntries = useMemo<NavEntry[]>(
    () =>
      sortedPackageDocs.map((doc) => ({
        key: doc.slug,
        label: doc.title,
        active: doc.slug === activeDoc?.slug,
        href: getDocHref(doc.slug),
        badge: docsNewPackageSlugs.has(doc.slug) ? "new" : undefined,
      })),
    [activeDoc?.slug, getDocHref, sortedPackageDocs],
  );

  const formNavEntries = useMemo<NavEntry[]>(
    () =>
      sortedFormDocs.map((doc) => ({
        key: doc.slug,
        label: doc.title,
        active: doc.slug === activeDoc?.slug,
        href: getDocHref(doc.slug),
        badge: docsNewFormSlugs.has(doc.slug) ? "new" : undefined,
      })),
    [activeDoc?.slug, getDocHref, sortedFormDocs],
  );

  const componentNavEntries = useMemo<NavEntry[]>(
    () => [
      {
        key: "__overview",
        label: "Components overview",
        active: isComponentsOverview,
        href: componentsOverviewHref,
      },
      ...sortedComponentDocs.map((doc) => ({
        key: doc.slug,
        label: doc.title,
        active: doc.slug === activeDoc?.slug,
        href: getDocHref(doc.slug),
        badge: docsUpdatedComponentSlugs.has(doc.slug) ? ("updated" as const) : undefined,
      })),
    ],
    [
      activeDoc?.slug,
      componentsOverviewHref,
      getDocHref,
      isComponentsOverview,
      sortedComponentDocs,
    ],
  );

  const blockNavEntries: NavEntry[] = [
    {
      key: "sidebar",
      label: "Sidebar",
      active: activeBlock === "sidebar",
      href: withBasePath("/blocks/sidebar"),
    },
    {
      key: "app-sidebar",
      label: "App Sidebar",
      active: activeBlock === "app-sidebar",
      href: withBasePath("/blocks/app-sidebar"),
    },
    {
      key: "login",
      label: "Login",
      active: activeBlock === "login",
      href: withBasePath("/blocks/login"),
    },
    {
      key: "signup",
      label: "Signup",
      active: activeBlock === "signup",
      href: withBasePath("/blocks/signup"),
    },
    {
      key: "auth",
      label: "Auth",
      active: activeBlock === "auth",
      href: withBasePath("/blocks/auth"),
    },
    {
      key: "marketing",
      label: "Marketing",
      active: activeBlock === "marketing",
      href: withBasePath("/blocks/marketing"),
    },
    {
      key: "dashboard",
      label: "Dashboard",
      active: activeBlock === "dashboard",
      href: withBasePath("/blocks/dashboard"),
    },
    {
      key: "communication",
      label: "Communication",
      active: activeBlock === "communication",
      href: withBasePath("/blocks/communication"),
    },
    {
      key: "commerce",
      label: "Commerce",
      active: activeBlock === "commerce",
      href: withBasePath("/blocks/commerce"),
    },
  ];

  const sidebarNav = (
    <>
      <h2>Blocks</h2>
      <nav aria-label="Docs blocks" class="docs-sidebar-nav docs-sidebar-nav--blocks">
        {blockNavEntries.map((entry) => (
          <NavLink entry={entry} key={entry.key} />
        ))}
      </nav>
      {packageNavEntries.length ? (
        <>
          <h2>Packages</h2>
          <nav aria-label="Docs packages" class="docs-sidebar-nav docs-sidebar-nav--packages">
            {packageNavEntries.map((entry) => (
              <NavLink entry={entry} key={entry.key} />
            ))}
          </nav>
        </>
      ) : null}
      {formNavEntries.length ? (
        <>
          <h2>Forms</h2>
          <nav aria-label="Docs forms" class="docs-sidebar-nav docs-sidebar-nav--forms">
            {formNavEntries.map((entry) => (
              <NavLink entry={entry} key={entry.key} />
            ))}
          </nav>
        </>
      ) : null}
      <h2>Components</h2>
      <nav aria-label="Docs components" class="docs-sidebar-nav">
        {componentNavEntries.map((entry) => (
          <NavLink entry={entry} key={entry.key} />
        ))}
      </nav>
    </>
  );

  const mobileNav = (
    <nav aria-label="Mobile docs navigation" class="docs-mobile-sheet-nav">
      <p class="docs-mobile-sheet-group-label">Blocks</p>
      {blockNavEntries.map((entry) => (
        <NavLink asSheetClose entry={entry} key={entry.key} />
      ))}
      {packageNavEntries.length ? (
        <>
          <p class="docs-mobile-sheet-group-label">Packages</p>
          {packageNavEntries.map((entry) => (
            <NavLink asSheetClose entry={entry} key={entry.key} />
          ))}
        </>
      ) : null}
      {formNavEntries.length ? (
        <>
          <p class="docs-mobile-sheet-group-label">Forms</p>
          {formNavEntries.map((entry) => (
            <NavLink asSheetClose entry={entry} key={entry.key} />
          ))}
        </>
      ) : null}
      <p class="docs-mobile-sheet-group-label">Components</p>
      {componentNavEntries.map((entry) => (
        <NavLink asSheetClose entry={entry} key={entry.key} />
      ))}
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
