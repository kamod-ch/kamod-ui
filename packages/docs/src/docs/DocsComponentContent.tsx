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
import { buildComponentDocMarkdown } from "./build-component-doc-markdown";
import { CodeBlock } from "./components/CodeBlock";
import { DocsShell } from "./components/DocsShell";
import { docImportFrom, rewriteKamodCoreImportsInDocString } from "./doc-snippet-imports";
import { docsBySlug, docsPages } from "./registry";
import type { DocRenderMainContext, DocSection } from "./types";

const isRtlSection = (section: DocSection) => /rtl/i.test(section.id) || /rtl/i.test(section.title);

const scrollToSection = (sectionId: string, behavior: ScrollBehavior, attempt = 0) => {
  const sectionElement = document.getElementById(sectionId);
  if (sectionElement) {
    const topbarElement = document.querySelector<HTMLElement>(".docs-topbar");
    const topbarHeight = topbarElement?.getBoundingClientRect().height ?? 0;
    const topOffset = topbarHeight + 16;
    const targetTop = window.scrollY + sectionElement.getBoundingClientRect().top - topOffset;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior,
    });
    return;
  }
  if (attempt >= 4) return;
  window.requestAnimationFrame(() => scrollToSection(sectionId, behavior, attempt + 1));
};

const toPascalCase = (value: string) =>
  value
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");

export const DocsComponentContent = ({ slug, section }: { slug?: string; section?: string }) => {
  const [activeSection, setActiveSection] = useState(section ?? "");
  const fallbackDoc = docsPages[0];
  const activeDoc = slug ? (docsBySlug[slug] ?? fallbackDoc) : fallbackDoc;
  const usageSectionId = "usage";
  const apiReferenceSectionId = "api-reference";
  const accessibilitySectionId = "accessibility";
  const docSections = useMemo<DocSection[]>(() => {
    let sections = activeDoc.sections;

    if (!sections.some((item) => item.id === usageSectionId)) {
      const usageSection: DocSection = {
        id: usageSectionId,
        title: "Usage",
        text: activeDoc.usageLabel,
      };
      const installationIndex = sections.findIndex((item) => item.id === "installation");
      sections =
        installationIndex < 0
          ? [usageSection, ...sections]
          : [
              ...sections.slice(0, installationIndex + 1),
              usageSection,
              ...sections.slice(installationIndex + 1),
            ];
    }

    if (!sections.some((item) => item.id === apiReferenceSectionId)) {
      sections = [
        ...sections,
        {
          id: apiReferenceSectionId,
          title: "API Reference",
          text: `${activeDoc.title} API surface and supported options.`,
        },
      ];
    }

    if (!sections.some((item) => item.id === accessibilitySectionId)) {
      sections = [
        ...sections,
        {
          id: accessibilitySectionId,
          title: "Accessibility Notes",
          text: `Use ${activeDoc.title} with clear labels, keyboard-friendly interactions and semantic structure.`,
        },
      ];
    }

    return sections.filter((item) => !isRtlSection(item));
  }, [activeDoc.sections, activeDoc.title, activeDoc.usageLabel]);
  const activeSectionId =
    section && docSections.some((item) => item.id === section)
      ? section
      : (docSections[0]?.id ?? "installation");
  const activeDocView = useMemo(
    () => ({ ...activeDoc, sections: docSections }),
    [activeDoc, docSections],
  );

  useEffect(() => {
    setActiveSection(activeSectionId);
    if (typeof window === "undefined") return;
    window.requestAnimationFrame(() => scrollToSection(activeSectionId, "auto"));
  }, [activeSectionId]);

  useEffect(() => {
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
  }, [docSections]);

  const installationCommands = useMemo(() => {
    const pnpm = activeDoc.command;
    const npm = pnpm.replace(/^pnpm add\b/, "npm install").replace(/^pnpm dlx\b/, "npx");
    const yarn = pnpm.replace(/^pnpm add\b/, "yarn add").replace(/^pnpm dlx\b/, "yarn dlx");

    return { pnpm, npm, yarn };
  }, [activeDoc.command]);

  const sectionExtraContentById: Record<string, () => ComponentChildren> = {
    installation: () => (
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
                : `<${componentName} />`);

      return (
        <div class="grid gap-3">
          <CodeBlock code={importSnippet} language="tsx" />
          <CodeBlock code={usageSnippet} language="tsx" />
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

  const renderPreviewAndCodeTabs = ({
    preview,
    codeSnippet,
    previewClass,
  }: {
    preview: ComponentChildren;
    codeSnippet: string;
    previewClass?: string;
  }) => (
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

  const markdownExport = useMemo(
    () => buildComponentDocMarkdown(activeDoc.title, activeDoc.command, docSections),
    [activeDoc.title, activeDoc.command, docSections],
  );

  const componentSourcePath = activeDoc.packagePath ?? docImportFrom(activeDoc.slug);

  const renderTitleRow = () => (
    <div class="docs-title-row">
      <div class="docs-title-stack">
        <h1>{activeDoc.title}</h1>
        <p class="docs-component-path">
          <code>{componentSourcePath}</code>
        </p>
      </div>
      <div class="docs-title-row-actions">
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
                  code={markdownExport}
                  language="markdown"
                  className="docs-tab-code !max-h-none"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );

  const renderContext: DocRenderMainContext = {
    title: activeDoc.title,
    sections: docSections,
    renderTitleRow,
    renderPreviewAndCodeTabs,
    renderSectionExtraContent,
  };

  const mainContent = activeDoc.renderMain(renderContext);

  return (
    <DocsShell
      isComponentsOverview={false}
      activeDoc={activeDocView}
      activeSection={activeSection}
      docs={docsPages}
      mainContent={mainContent}
      getSectionHref={(sectionId) => withBasePath(`/docs/${activeDoc.slug}/${sectionId}`)}
    />
  );
};
