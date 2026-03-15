import {
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Spinner,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@kamod-ui/core";
import type { ComponentChildren } from "preact";
import { useLocation, useRoute } from "preact-iso";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { buildComponentDocMarkdown } from "./build-component-doc-markdown";
import { CodeBlock } from "./components/CodeBlock";
import { DocsShell } from "./components/DocsShell";
import { docsBySlug, docsPages } from "./registry";
import type { DocRenderMainContext, DocSection } from "./types";

const isRtlSection = (section: DocSection) => /rtl/i.test(section.id) || /rtl/i.test(section.title);

export const DocsComponentPage = () => {
  const { route } = useLocation();
  const { params } = useRoute();
  const slug = params?.slug ?? "";
  const section = params?.section ?? "";
  const [activeSection, setActiveSection] = useState("");
  const pendingScrollTargetRef = useRef<string | null>(null);
  const pendingScrollBehaviorRef = useRef<ScrollBehavior>("auto");
  const fallbackDoc = docsPages[0];
  const activeDoc = docsBySlug[slug] ?? fallbackDoc;
  const usageSectionId = "usage";
  const apiReferenceSectionId = "api-reference";
  const accessibilitySectionId = "accessibility";
  const docSections = useMemo<DocSection[]>(() => {
    let sections = activeDoc.sections;

    if (!sections.some((item) => item.id === usageSectionId)) {
      const usageSection: DocSection = {
        id: usageSectionId,
        title: "Usage",
        text: activeDoc.usageLabel
      };
      const installationIndex = sections.findIndex((item) => item.id === "installation");
      sections =
        installationIndex < 0
          ? [usageSection, ...sections]
          : [...sections.slice(0, installationIndex + 1), usageSection, ...sections.slice(installationIndex + 1)];
    }

    if (!sections.some((item) => item.id === apiReferenceSectionId)) {
      sections = [
        ...sections,
        {
          id: apiReferenceSectionId,
          title: "API Reference",
          text: `${activeDoc.title} API surface and supported options.`
        }
      ];
    }

    if (!sections.some((item) => item.id === accessibilitySectionId)) {
      sections = [
        ...sections,
        {
          id: accessibilitySectionId,
          title: "Accessibility Notes",
          text: `Use ${activeDoc.title} with clear labels, keyboard-friendly interactions and semantic structure.`
        }
      ];
    }

    return sections.filter((item) => !isRtlSection(item));
  }, [activeDoc.sections, activeDoc.title, activeDoc.usageLabel]);
  const activeDocView = useMemo(() => ({ ...activeDoc, sections: docSections }), [activeDoc, docSections]);

  const scrollToSection = (sectionId: string, behavior: ScrollBehavior, attempt = 0) => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      const topbarElement = document.querySelector<HTMLElement>(".docs-topbar");
      const topbarHeight = topbarElement?.getBoundingClientRect().height ?? 0;
      const topOffset = topbarHeight + 16;
      const targetTop = window.scrollY + sectionElement.getBoundingClientRect().top - topOffset;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior
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

  useEffect(() => {
    if (!slug || !docsBySlug[slug]) {
      route(`/docs/${fallbackDoc.slug}/${fallbackDoc.sections[0]?.id ?? "installation"}`, true);
      return;
    }
    const firstSectionId = docSections[0]?.id ?? "installation";
    if (!section || !docSections.some((item) => item.id === section)) {
      route(`/docs/${activeDoc.slug}/${firstSectionId}`, true);
      return;
    }
    setActiveSection(section);
  }, [activeDoc, docSections, route, section, slug, fallbackDoc]);

  useEffect(() => {
    if (!section || !docSections.some((item) => item.id === section)) return;
    const pendingTarget = pendingScrollTargetRef.current;

    if (!pendingTarget) return;
    if (pendingTarget !== section) return;

    const behavior = pendingScrollBehaviorRef.current;
    scrollToSection(section, behavior);
    pendingScrollTargetRef.current = null;
    pendingScrollBehaviorRef.current = "auto";
  }, [docSections, section]);

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
        threshold: [0.2, 0.4, 0.7]
      }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [docSections]);

  const navigateToDoc = (nextSlug: string) => {
    const targetDoc = docsBySlug[nextSlug] ?? fallbackDoc;
    route(`/docs/${targetDoc.slug}/${targetDoc.sections[0]?.id ?? "installation"}`);
  };
  const installationCommands = useMemo(() => {
    const pnpm = activeDoc.command;
    const npm = pnpm.replace(/^pnpm add\b/, "npm install").replace(/^pnpm dlx\b/, "npx");
    const yarn = pnpm.replace(/^pnpm add\b/, "yarn add").replace(/^pnpm dlx\b/, "yarn dlx");

    return { pnpm, npm, yarn };
  }, [activeDoc.command]);

  const navigateToSection = (sectionId: string) => {
    if (section === sectionId) {
      scrollToSection(sectionId, "smooth");
      return;
    }

    pendingScrollTargetRef.current = sectionId;
    pendingScrollBehaviorRef.current = "smooth";
    route(`/docs/${activeDoc.slug}/${sectionId}`);
  };

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
      const importSnippet = isButtonDoc
        ? `import { Button, Spinner } from "@kamod-ui/core";`
        : isButtonGroupDoc
          ? `import { Button, ButtonGroup } from "@kamod-ui/core";`
          : isTabsDoc
            ? `import { Tabs, TabsContent, TabsList, TabsTrigger } from "@kamod-ui/core";`
            : isAlertDialogDoc
              ? `import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@kamod-ui/core";`
            : `import { ${componentName} } from "@kamod-ui/core";`;
      const usageSnippet = isButtonDoc
        ? `<Button disabled>\n  <Spinner size="sm" data-icon="inline-start" />\n  Generating\n</Button>`
        : isButtonGroupDoc
          ? `<ButtonGroup>\n  <Button>Button 1</Button>\n  <Button>Button 2</Button>\n</ButtonGroup>`
          : isTabsDoc
            ? `<Tabs defaultValue="overview">\n  <TabsList>\n    <TabsTrigger value="overview">Overview</TabsTrigger>\n    <TabsTrigger value="details">Details</TabsTrigger>\n  </TabsList>\n  <TabsContent value="overview">Overview content</TabsContent>\n  <TabsContent value="details">Details content</TabsContent>\n</Tabs>`
            : isAlertDialogDoc
              ? `<AlertDialog>\n  <AlertDialogTrigger>Delete account</AlertDialogTrigger>\n  <AlertDialogContent>\n    <AlertDialogHeader>\n      <AlertDialogTitle>Delete account?</AlertDialogTitle>\n      <AlertDialogDescription>\n        This action is permanent.\n      </AlertDialogDescription>\n    </AlertDialogHeader>\n    <AlertDialogFooter>\n      <AlertDialogCancel>Cancel</AlertDialogCancel>\n      <AlertDialogAction>Continue</AlertDialogAction>\n    </AlertDialogFooter>\n  </AlertDialogContent>\n</AlertDialog>`
            : `<${componentName} />`;

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
    }
  };

  const renderSectionExtraContent = (sectionId: string) => sectionExtraContentById[sectionId]?.() ?? null;
  const renderPreviewAndCodeTabs = ({
    preview,
    codeSnippet,
    previewClass
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
            previewClass
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
    [activeDoc.title, activeDoc.command, docSections]
  );

  const renderTitleRow = () => (
    <div class="docs-title-row">
      <h1>{activeDoc.title}</h1>
      <Dialog>
        <Button variant="outline" size="sm" asChild>
          <DialogTrigger>View Markdown</DialogTrigger>
        </Button>
        {/* presentation="slot": custom fullscreen overlay — default "modal" would stack a second backdrop + centered shell */}
        <DialogContent
          presentation="slot"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6"
        >
          <div class="flex max-h-[min(80vh,720px)] w-full max-w-2xl flex-col gap-0 overflow-hidden rounded-xl border border-border bg-background p-0 shadow-lg">
            <DialogHeader class="shrink-0 border-b border-border px-6 py-4 text-left">
              <DialogTitle>Markdown for {activeDoc.title}</DialogTitle>
            </DialogHeader>
            <div class="min-h-0 flex-1 overflow-y-auto px-2 pb-4 pt-2">
              <CodeBlock code={markdownExport} language="markdown" className="docs-tab-code !max-h-none" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderMainContext: DocRenderMainContext = {
    title: activeDoc.title,
    sections: docSections,
    renderTitleRow,
    renderPreviewAndCodeTabs,
    renderSectionExtraContent
  };

  return (
    <DocsShell
      isComponentsOverview={false}
      activeDoc={activeDocView}
      activeSection={activeSection}
      docs={docsPages}
      onNavigateDoc={navigateToDoc}
      onNavigateComponentsOverview={() => route("/docs/components")}
      onNavigateSection={navigateToSection}
      mainContent={activeDoc.renderMain(renderMainContext)}
    />
  );
};
