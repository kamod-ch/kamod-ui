import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
      const importSnippet = rewriteKamodCoreImportsInDocString(
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
      const usageSnippet = isButtonDoc
        ? `${importSnippet}\n\nexport function Example() {\n  return <Button>Save</Button>;\n}`
        : isButtonGroupDoc
          ? `${importSnippet}\n\nexport function Example() {\n  return (\n    <ButtonGroup>\n      <Button variant="outline">Previous</Button>\n      <Button>Continue</Button>\n    </ButtonGroup>\n  );\n}`
          : isTabsDoc
            ? `${importSnippet}\n\nexport function Example() {\n  return (\n    <Tabs defaultValue="account">\n      <TabsList>\n        <TabsTrigger value="account">Account</TabsTrigger>\n        <TabsTrigger value="security">Security</TabsTrigger>\n      </TabsList>\n      <TabsContent value="account">Account settings</TabsContent>\n      <TabsContent value="security">Security settings</TabsContent>\n    </Tabs>\n  );\n}`
            : isAlertDialogDoc
              ? `${importSnippet}\n\nexport function Example() {\n  return (\n    <AlertDialog>\n      <AlertDialogTrigger>Delete project</AlertDialogTrigger>\n      <AlertDialogContent>\n        <AlertDialogHeader>\n          <AlertDialogTitle>Are you sure?</AlertDialogTitle>\n          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>\n        </AlertDialogHeader>\n        <AlertDialogFooter>\n          <AlertDialogCancel>Cancel</AlertDialogCancel>\n          <AlertDialogAction>Delete</AlertDialogAction>\n        </AlertDialogFooter>\n      </AlertDialogContent>\n    </AlertDialog>\n  );\n}`
              : `${importSnippet}\n\nexport function Example() {\n  return <${componentName} />;\n}`;

      return <CodeBlock code={usageSnippet} language="tsx" />;
    },
    [apiReferenceSectionId]: () => {
      const importSource = docImportFrom(activeDoc.slug);
      const apiMarkdown = [
        `> Import from ${importSource}`,
        "",
        buildComponentDocMarkdown(activeDocView.title, activeDoc.command, activeDocView.sections),
      ].join("\n");
      return <CodeBlock code={apiMarkdown} language="markdown" />;
    },
    [accessibilitySectionId]: () => (
      <div class="docs-callout docs-callout-info">
        <p>
          Verify keyboard support, focus visibility, labels and semantic structure when composing
          <strong> {activeDoc.title}</strong> into product UIs.
        </p>
      </div>
    ),
  };

  const renderSectionExtraContent = (sectionId: string) => sectionExtraContentById[sectionId]?.();

  const renderPreviewAndCodeTabs = ({
    preview,
    codeSnippet,
    previewClass,
  }: {
    preview: ComponentChildren;
    codeSnippet: string;
    previewClass?: string;
  }) => (
    <Tabs defaultValue="preview" class="docs-preview-tabs">
      <TabsList class="docs-tabs-list" variant="line">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        <div class={`docs-preview-surface ${previewClass ?? ""}`.trim()}>{preview}</div>
      </TabsContent>
      <TabsContent value="code">
        <CodeBlock code={codeSnippet} language="tsx" />
      </TabsContent>
    </Tabs>
  );

  const renderTitleRow = () => (
    <div class="docs-title-row">
      <div>
        <p class="docs-eyebrow">Component</p>
        <h1>{activeDoc.title}</h1>
        <p class="docs-intro">{activeDoc.usageLabel}</p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Installation
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install {activeDoc.title}</DialogTitle>
            <p class="docs-copy text-sm text-muted-foreground">
              Demo snippets use the local `@/components/kamod-ui/*` alias. In your app, install
              `@kamod-ch/ui` and import from that package.
            </p>
          </DialogHeader>
          <Tabs defaultValue="pnpm">
            <TabsList variant="line">
              <TabsTrigger value="pnpm">pnpm</TabsTrigger>
              <TabsTrigger value="npm">npm</TabsTrigger>
              <TabsTrigger value="yarn">yarn</TabsTrigger>
            </TabsList>
            <TabsContent value="pnpm">
              <CodeBlock code={installationCommands.pnpm} language="bash" />
            </TabsContent>
            <TabsContent value="npm">
              <CodeBlock code={installationCommands.npm} language="bash" />
            </TabsContent>
            <TabsContent value="yarn">
              <CodeBlock code={installationCommands.yarn} language="bash" />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderContext: DocRenderMainContext = {
    title: activeDoc.title,
    sections: docSections,
    renderTitleRow,
    renderPreviewAndCodeTabs,
    renderSectionExtraContent,
  };

  const mainContent = (
    <>
      <div class="docs-callout docs-callout-info">
        <p>
          Demo code blocks use the local `@/components/kamod-ui/*` alias. For app code, install
          `@kamod-ch/ui` and import from that package.
        </p>
      </div>
      {activeDoc.renderMain(renderContext)}
    </>
  );

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
