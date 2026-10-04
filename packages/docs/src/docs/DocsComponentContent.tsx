import {
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Spinner,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import { withBasePath } from "../base-path";
import { BlockGuideContents } from "../blocks/detail/BlockGuideContents";
import { buildComponentDocMarkdown } from "./build-component-doc-markdown";
import { CodeBlock } from "./components/CodeBlock";
import {
  accessibilityContents,
  componentAccessibility,
} from "./components/component-detail/accessibility";
import { ComponentDetailHeader } from "./components/component-detail/ComponentDetailHeader";
import { ComponentExample } from "./components/component-detail/ComponentExample";
import {
  ComponentIntegrationGuide,
  componentIntegrationContents,
} from "./components/component-detail/ComponentIntegrationGuide";
import {
  ComponentExamplesContext,
  componentExamplesTitle,
  getComponentExamples,
} from "./components/component-detail/component-examples";
import { DocsShell } from "./components/DocsShell";
import { PathDisplay } from "./components/PathDisplay";
import { getDocSections } from "./doc-sections";
import { docImportFrom, rewriteKamodCoreImportsInDocString } from "./doc-snippet-imports";
import { docsShowMotion, isMotionDocSlug } from "./docs-feature-flags";
import { docsBySlug, docsPages } from "./registry";
import { scheduleSectionScroll } from "./scroll-to-section";
import type { DocRenderMainContext, DocSection } from "./types";

const previewContents = [{ id: "component-preview", label: "Live preview" }];

const toPascalCase = (value: string) =>
  value
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");

export const DocsComponentContent = ({
  slug,
  section,
  previewIndex,
}: {
  slug?: string;
  section?: string;
  previewIndex?: number;
}) => {
  const [activeSection, setActiveSection] = useState(section ?? "");
  const fallbackDoc = docsPages[0];
  const activeDoc =
    slug && !docsShowMotion && isMotionDocSlug(slug)
      ? fallbackDoc
      : slug
        ? (docsBySlug[slug] ?? fallbackDoc)
        : fallbackDoc;
  const isComponentDetail =
    !activeDoc.guideContents &&
    (!activeDoc.navGroup ||
      activeDoc.navGroup === "components" ||
      activeDoc.navGroup === "motion" ||
      activeDoc.navGroup === "forms");
  const docSections = useMemo<DocSection[]>(() => {
    return getDocSections(activeDoc, isComponentDetail);
  }, [activeDoc, isComponentDetail]);
  const activeSectionId =
    section && docSections.some((item) => item.id === section)
      ? section
      : (docSections[0]?.id ?? "installation");
  const activeDocView = useMemo(
    () => ({ ...activeDoc, sections: docSections }),
    [activeDoc, docSections],
  );

  const exampleCollection = useMemo(
    () => ({ doc: activeDoc, examples: getComponentExamples(activeDoc, docSections) }),
    [activeDoc, docSections],
  );
  const contents = useMemo(
    () =>
      activeDoc.guideContents ??
      (isComponentDetail
        ? [
            ...docSections.flatMap(({ id, title }) => {
              if (id === exampleCollection.examples[0]?.id)
                return [
                  {
                    id: "component-examples",
                    label: componentExamplesTitle(activeDoc),
                    children: exampleCollection.examples.map(({ id, title }) => ({
                      id,
                      label: title,
                    })),
                  },
                ];
              return exampleCollection.examples.some((example) => example.id === id)
                ? []
                : [
                    {
                      id,
                      label:
                        id === "api-reference"
                          ? "Props and data"
                          : id === "accessibility" && componentAccessibility(activeDoc.slug)
                            ? "Accessibility"
                            : title,
                      ...(id === "api-reference"
                        ? {
                            children: [
                              {
                                id: "component-props",
                                label:
                                  activeDoc.navGroup === "forms"
                                    ? "Form props and contracts"
                                    : "Component props",
                              },
                              { id: "component-data-types", label: "Data type reference" },
                            ],
                          }
                        : id === "accessibility" && componentAccessibility(activeDoc.slug)
                          ? { children: accessibilityContents }
                          : {}),
                    },
                  ];
            }),
            ...componentIntegrationContents,
          ]
        : undefined),
    [activeDoc, isComponentDetail, docSections, exampleCollection],
  );

  useEffect(() => {
    if (previewIndex !== undefined) return;
    setActiveSection(activeSectionId);
    // Guide entry routes open at the introduction; legacy section URLs still reach their target.
    if (contents && (activeSectionId === "installation" || window.location.hash)) return;
    return scheduleSectionScroll(activeSectionId);
  }, [activeDoc.slug, contents, activeSectionId, previewIndex]);

  useEffect(() => {
    if (contents || previewIndex !== undefined) return;
    const ids = docSections.map((docSection) => docSection.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
          .at(0);
        if (!visible?.target.id) return;
        setActiveSection(visible.target.id);
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.2, 0.4, 0.7],
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [docSections, contents, previewIndex]);

  const installationCommands = useMemo(() => {
    const pnpm = activeDoc.command;
    const npm = pnpm.replace(/^pnpm add\b/, "npm install").replace(/^pnpm dlx\b/, "npx");
    const yarn = pnpm.replace(/^pnpm add\b/, "yarn add").replace(/^pnpm dlx\b/, "yarn dlx");

    return { pnpm, npm, yarn };
  }, [activeDoc.command]);

  const sectionExtraContentById: Record<string, () => ComponentChildren> = {
    installation: () => (
      <>
        <Tabs defaultValue="pnpm" class="docs-tabs">
          <TabsList class="docs-tabs-list" variant="line">
            <TabsTrigger value="pnpm">pnpm</TabsTrigger>
            <TabsTrigger value="npm">npm</TabsTrigger>
            <TabsTrigger value="yarn">yarn</TabsTrigger>
          </TabsList>
          <TabsContent value="pnpm">
            <CodeBlock code={installationCommands.pnpm} language="bash" className="docs-tab-code" />
          </TabsContent>
          <TabsContent value="npm">
            <CodeBlock code={installationCommands.npm} language="bash" className="docs-tab-code" />
          </TabsContent>
          <TabsContent value="yarn">
            <CodeBlock code={installationCommands.yarn} language="bash" className="docs-tab-code" />
          </TabsContent>
        </Tabs>
        {isComponentDetail && (
          <p class="docs-copy">
            The <PathDisplay path={"@/components/kamod-ui/…"} /> imports in these examples refer to
            local source files. Configure that alias when copying source, or use the corresponding
            exports from <PathDisplay path={"@kamod-ch/ui"} /> when installing the package. Connect{" "}
            <a href={withBasePath("/docs/theming/css-setup")}>
              the global theme CSS and Tailwind source detection
            </a>{" "}
            before your first render.
          </p>
        )}
      </>
    ),
    usage: () => {
      const componentName = toPascalCase(activeDoc.slug);
      const isButtonDoc = activeDoc.slug === "button";
      const isButtonGroupDoc = activeDoc.slug === "button-group";
      const isTabsDoc = activeDoc.slug === "tabs";
      const isAlertDialogDoc = activeDoc.slug === "alert-dialog";
      const importSnippet = activeDoc.usageImportSnippet
        ? activeDoc.usageImportSnippet
        : rewriteKamodCoreImportsInDocString(
            isButtonDoc
              ? `import { Button, Spinner } from "@kamod-ch/ui";`
              : isButtonGroupDoc
                ? `import { Button, ButtonGroup } from "@kamod-ch/ui";`
                : isTabsDoc
                  ? `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@kamod-ch/ui";`
                  : isAlertDialogDoc
                    ? `import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@kamod-ch/ui";`
                    : `import { ${componentName} } from "@kamod-ch/ui";`,
            activeDoc.slug,
          );
      const usageSnippet =
        activeDoc.usageExampleSnippet ??
        (isButtonDoc
          ? `<Button disabled>\n  <Spinner size="sm" data-icon="inline-start" />\n  Generating\n</Button>`
          : isButtonGroupDoc
            ? `<ButtonGroup>\n  <Button>Button 1</Button>\n  <Button>Button 2</Button>\n</ButtonGroup>`
            : isTabsDoc
              ? `<Tabs defaultValue="overview">\n  <TabsList>\n    <TabsTrigger value="overview">Overview</TabsTrigger>\n    <TabsTrigger value="details">Details</TabsTrigger>\n  </TabsList>\n  <TabsContent value="overview">Overview content</TabsContent>\n  <TabsContent value="details">Details content</TabsContent>\n</Tabs>`
              : isAlertDialogDoc
                ? `<AlertDialog>\n  <AlertDialogTrigger>Delete account</AlertDialogTrigger>\n  <AlertDialogContent>\n    <AlertDialogHeader>\n      <AlertDialogTitle>Delete account?</AlertDialogTitle>\n      <AlertDialogDescription>\n        This action is permanent.\n      </AlertDialogDescription>\n    </AlertDialogHeader>\n    <AlertDialogFooter>\n      <AlertDialogCancel>Cancel</AlertDialogCancel>\n      <AlertDialogAction>Continue</AlertDialogAction>\n    </AlertDialogFooter>\n  </AlertDialogContent>\n</AlertDialog>`
                : undefined);

      return (
        <div class="grid gap-3">
          <CodeBlock code={importSnippet} language="tsx" />
          {usageSnippet ? (
            <CodeBlock code={usageSnippet} language="tsx" />
          ) : (
            <p class="docs-copy">
              Choose a complete composition from the examples below; required child components and
              props vary by pattern.
            </p>
          )}
          {isButtonDoc ? (
            <div class="docs-usage-row">
              <Button disabled>
                <Spinner size="sm" data-icon="inline-start" />
                Generating
              </Button>
            </div>
          ) : isButtonGroupDoc ? (
            <div class="docs-usage-row">
              <ButtonGroup>
                <Button>Button 1</Button>
                <Button>Button 2</Button>
              </ButtonGroup>
            </div>
          ) : isTabsDoc ? (
            <div class="docs-usage-row w-full max-w-xl">
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">Overview content</TabsContent>
                <TabsContent value="details">Details content</TabsContent>
              </Tabs>
            </div>
          ) : isAlertDialogDoc ? null : null}
        </div>
      );
    },
  };

  const renderSectionExtraContent = (sectionId: string) =>
    sectionExtraContentById[sectionId]?.() ?? null;

  let exampleIndex = 0;
  let selectedPreview: ComponentChildren = null;
  const renderPreviewAndCodeTabs = ({
    preview,
    codeSnippet,
    previewClass,
    filePath,
  }: {
    preview: ComponentChildren;
    codeSnippet: string;
    previewClass?: string;
    filePath?: string;
  }) => {
    const index = exampleIndex++;
    if (previewIndex !== undefined) {
      if (index === previewIndex)
        selectedPreview = (
          <div class={`preview component-example-canvas ${previewClass ?? ""}`}>{preview}</div>
        );
      return null;
    }
    return isComponentDetail ? (
      <ComponentExample
        doc={activeDoc}
        index={index}
        codeSnippet={rewriteKamodCoreImportsInDocString(codeSnippet, activeDoc.slug)}
        filePath={filePath ?? `src/components/${toPascalCase(activeDoc.slug)}Example.tsx`}
      />
    ) : (
      <Tabs defaultValue="preview" class="docs-tabs">
        <TabsList class="docs-tabs-list" variant="line">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview">
          <div
            class={[
              "preview relative flex min-h-40 w-full items-start justify-center p-3 sm:min-h-56 sm:p-6 lg:min-h-72 lg:p-10 data-[align=center]:items-center data-[align=end]:items-end data-[align=start]:items-start data-[chromeless=true]:h-auto data-[chromeless=true]:p-0",
              previewClass,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {preview}
          </div>
        </TabsContent>
        <TabsContent value="code">
          <CodeBlock code={codeSnippet} language="tsx" className="docs-tab-code" />
        </TabsContent>
      </Tabs>
    );
  };

  const componentSourcePath = activeDoc.packagePath ?? docImportFrom(activeDoc.slug);

  // Only legacy pages with an export control need this document; isolated previews do not.
  const renderMarkdownAction = () => (
    <Dialog>
      <Button variant="outline" size="sm" asChild>
        <DialogTrigger>View Markdown</DialogTrigger>
      </Button>
      <DialogContent
        presentation="slot"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6"
      >
        <div class="flex max-h-[min(80vh,720px)] w-full max-w-2xl flex-col gap-0 overflow-hidden rounded-xl border border-border bg-background p-0 shadow-lg">
          <DialogHeader class="shrink-0 border-b border-border px-6 py-4 text-left">
            <DialogTitle>Markdown for {activeDoc.title}</DialogTitle>
          </DialogHeader>
          <div class="min-h-0 flex-1 overflow-y-auto px-2 pb-4 pt-2">
            <CodeBlock
              code={buildComponentDocMarkdown(
                activeDoc.title,
                activeDoc.command,
                docSections,
                activeDoc.slug,
              )}
              language="markdown"
              className="docs-tab-code !max-h-none"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const renderTitleRow = () =>
    isComponentDetail ? (
      <>
        <ComponentDetailHeader doc={activeDoc} sourcePath={componentSourcePath} />
        <BlockGuideContents
          id={`${activeDoc.slug}-mobile-contents`}
          sections={contents!}
          overviewChildren={previewContents}
          mobile
        />
      </>
    ) : (
      <div class="docs-title-row">
        <div class="docs-title-stack">
          <h1>{activeDoc.title}</h1>
          <p class="docs-component-path">
            <PathDisplay path={componentSourcePath} />
          </p>
        </div>
        <div class="docs-title-row-actions">{renderMarkdownAction()}</div>
      </div>
    );

  const renderContext: DocRenderMainContext = {
    title: activeDoc.title,
    sections: docSections,
    activeSectionId,
    getSectionHref: (sectionId) => withBasePath(`/docs/${activeDoc.slug}/${sectionId}`),
    renderTitleRow,
    renderMarkdownAction,
    renderPreviewAndCodeTabs,
    renderSectionExtraContent,
  };

  const renderedContent = activeDoc.renderMain(renderContext);
  if (previewIndex !== undefined)
    return selectedPreview ?? <p role="alert">This example is not available.</p>;
  const mainContent = isComponentDetail ? (
    <article class="block-guide component-detail blocks-doc-body" id="top" key={activeDoc.slug}>
      <ComponentExamplesContext.Provider value={exampleCollection}>
        {renderedContent}
      </ComponentExamplesContext.Provider>
      <ComponentIntegrationGuide doc={activeDoc} />
    </article>
  ) : (
    renderedContent
  );

  const sidebarScope =
    activeDoc.navGroup === "packages"
      ? ("packages" as const)
      : activeDoc.navGroup === "forms"
        ? ("forms" as const)
        : ("components" as const);

  return (
    <DocsShell
      sidebarScope={sidebarScope}
      activeDoc={activeDocView}
      activeSection={activeSection}
      pageContents={
        contents ? (
          <BlockGuideContents
            id={`${activeDoc.slug}-contents`}
            sections={contents}
            overviewChildren={isComponentDetail ? previewContents : undefined}
            pageTitle={activeDoc.guideTitle}
          />
        ) : undefined
      }
      mainContent={mainContent}
      getSectionHref={(sectionId) => withBasePath(`/docs/${activeDoc.slug}/${sectionId}`)}
    />
  );
};
