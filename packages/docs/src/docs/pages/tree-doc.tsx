import { FileTextIcon, FolderIcon, FolderOpenIcon } from "@kamod-ch/icons/lucide";
import { Button, DirectionProvider, Tree, TreeItem, TreeProvider } from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { ApiReference } from "../components/ApiReference";
import { CodeBlock } from "../components/CodeBlock";
import type { DocPageModule } from "../types";

function FileTreePreview({
  defaultExpandedIds = ["documents"],
  selectionMode = "none" as const,
  showLines = true,
  showIcons = true,
  variant,
  size,
}: {
  defaultExpandedIds?: string[];
  selectionMode?: "none" | "single" | "multiple";
  showLines?: boolean;
  showIcons?: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
}) {
  return (
    <TreeProvider
      defaultExpandedIds={defaultExpandedIds}
      selectionMode={selectionMode}
      showLines={showLines}
      showIcons={showIcons}
      variant={variant}
      size={size}
      class="w-full max-w-md"
    >
      <Tree aria-label="Project files">
        <TreeItem
          nodeId="documents"
          label="Documents"
          icon={<FolderIcon aria-hidden />}
          expandedIcon={<FolderOpenIcon aria-hidden />}
        >
          <TreeItem nodeId="readme" label="README.md" icon={<FileTextIcon aria-hidden />} />
          <TreeItem nodeId="changelog" label="CHANGELOG.md" icon={<FileTextIcon aria-hidden />} />
        </TreeItem>
        <TreeItem nodeId="photos" label="Photos" icon={<FolderIcon aria-hidden />}>
          <TreeItem nodeId="vacation" label="Vacation 2024" icon={<FolderIcon aria-hidden />} />
        </TreeItem>
        <TreeItem nodeId="notes" label="Notes.txt" icon={<FileTextIcon aria-hidden />} />
      </Tree>
    </TreeProvider>
  );
}

function ControlledExpansionDemo() {
  const [expanded, setExpanded] = useState<string[]>(["documents"]);
  return (
    <div class="flex w-full max-w-md flex-col gap-3">
      <TreeProvider expandedIds={expanded} onExpandedChange={setExpanded}>
        <Tree aria-label="Controlled tree">
          <TreeItem nodeId="documents" label="Documents" icon={<FolderIcon aria-hidden />}>
            <TreeItem nodeId="readme" label="README.md" icon={<FileTextIcon aria-hidden />} />
          </TreeItem>
          <TreeItem nodeId="notes" label="Notes.txt" icon={<FileTextIcon aria-hidden />} />
        </Tree>
      </TreeProvider>
      <p class="text-sm text-muted-foreground">Expanded: {expanded.join(", ") || "(none)"}</p>
    </div>
  );
}

function SingleSelectionDemo() {
  return (
    <TreeProvider
      selectionMode="single"
      defaultSelectedIds={["readme"]}
      defaultExpandedIds={["documents"]}
    >
      <Tree aria-label="Selectable tree">
        <TreeItem nodeId="documents" label="Documents" icon={<FolderIcon aria-hidden />}>
          <TreeItem nodeId="readme" label="README.md" icon={<FileTextIcon aria-hidden />} />
          <TreeItem nodeId="changelog" label="CHANGELOG.md" icon={<FileTextIcon aria-hidden />} />
        </TreeItem>
        <TreeItem nodeId="notes" label="Notes.txt" icon={<FileTextIcon aria-hidden />} />
      </Tree>
    </TreeProvider>
  );
}

function MultipleSelectionDemo() {
  return (
    <TreeProvider
      selectionMode="multiple"
      defaultSelectedIds={["readme"]}
      defaultExpandedIds={["documents"]}
    >
      <Tree aria-label="Multi-select tree">
        <TreeItem nodeId="documents" label="Documents" icon={<FolderIcon aria-hidden />}>
          <TreeItem nodeId="readme" label="README.md" icon={<FileTextIcon aria-hidden />} />
          <TreeItem nodeId="changelog" label="CHANGELOG.md" icon={<FileTextIcon aria-hidden />} />
        </TreeItem>
        <TreeItem nodeId="notes" label="Notes.txt" icon={<FileTextIcon aria-hidden />} />
      </Tree>
    </TreeProvider>
  );
}

function DisabledItemsDemo() {
  return (
    <TreeProvider defaultExpandedIds={["documents"]}>
      <Tree aria-label="Disabled items">
        <TreeItem nodeId="documents" label="Documents" icon={<FolderIcon aria-hidden />}>
          <TreeItem nodeId="readme" label="README.md" icon={<FileTextIcon aria-hidden />} />
          <TreeItem
            nodeId="locked"
            label="Locked.pdf"
            icon={<FileTextIcon aria-hidden />}
            disabled
          />
        </TreeItem>
      </Tree>
    </TreeProvider>
  );
}

function DeepTreeDemo() {
  return (
    <TreeProvider defaultExpandedIds={["root", "level-2", "level-3"]} class="w-full max-w-md">
      <Tree aria-label="Deep tree">
        <TreeItem
          nodeId="root"
          label="Root with a very long label that should truncate gracefully in narrow layouts"
          icon={<FolderIcon aria-hidden />}
        >
          <TreeItem nodeId="level-2" label="Level 2" icon={<FolderIcon aria-hidden />}>
            <TreeItem nodeId="level-3" label="Level 3" icon={<FolderIcon aria-hidden />}>
              <TreeItem nodeId="level-4" label="Level 4 leaf" icon={<FileTextIcon aria-hidden />} />
            </TreeItem>
          </TreeItem>
        </TreeItem>
      </Tree>
    </TreeProvider>
  );
}

function TreeRtlDemo() {
  const [dir, setDir] = useState<"ltr" | "rtl">("rtl");
  return (
    <div class="flex w-full max-w-md flex-col gap-3">
      <div class="flex gap-2">
        <Button
          size="sm"
          variant={dir === "ltr" ? "default" : "outline"}
          onClick={() => setDir("ltr")}
        >
          LTR
        </Button>
        <Button
          size="sm"
          variant={dir === "rtl" ? "default" : "outline"}
          onClick={() => setDir("rtl")}
        >
          RTL
        </Button>
      </div>
      <DirectionProvider direction={dir}>
        <TreeProvider defaultExpandedIds={["documents"]} class="w-full max-w-md">
          <Tree aria-label="RTL tree" dir={dir}>
            <TreeItem nodeId="documents" label="المستندات" icon={<FolderIcon aria-hidden />}>
              <TreeItem nodeId="readme" label="README.md" icon={<FileTextIcon aria-hidden />} />
            </TreeItem>
            <TreeItem nodeId="notes" label="ملاحظات.txt" icon={<FileTextIcon aria-hidden />} />
          </Tree>
        </TreeProvider>
      </DirectionProvider>
    </div>
  );
}

const sectionBlocks: Record<string, { preview: () => ComponentChildren; code: string }> = {
  basic: {
    preview: () => <FileTreePreview />,
    code: `import { Tree, TreeItem, TreeProvider } from "@/components/kamod-ui/tree";
import { FileTextIcon, FolderIcon } from "@kamod-ch/icons/lucide";

<TreeProvider defaultExpandedIds={["documents"]}>
  <Tree aria-label="Project files">
    <TreeItem nodeId="documents" label="Documents" icon={<FolderIcon aria-hidden />}>
      <TreeItem nodeId="readme" label="README.md" icon={<FileTextIcon aria-hidden />} />
    </TreeItem>
  </Tree>
</TreeProvider>`,
  },
  "default-expanded": {
    preview: () => <FileTreePreview defaultExpandedIds={["documents", "photos"]} />,
    code: `<TreeProvider defaultExpandedIds={["documents", "photos"]}>…</TreeProvider>`,
  },
  "controlled-expansion": {
    preview: () => <ControlledExpansionDemo />,
    code: `const [expanded, setExpanded] = useState<string[]>(["documents"]);

<TreeProvider expandedIds={expanded} onExpandedChange={setExpanded}>
  <Tree aria-label="Controlled tree">…</Tree>
</TreeProvider>`,
  },
  "single-selection": {
    preview: () => <SingleSelectionDemo />,
    code: `<TreeProvider selectionMode="single" defaultSelectedIds={["readme"]} defaultExpandedIds={["documents"]}>
  <Tree aria-label="Selectable tree">…</Tree>
</TreeProvider>`,
  },
  "multiple-selection": {
    preview: () => <MultipleSelectionDemo />,
    code: `<TreeProvider selectionMode="multiple" defaultSelectedIds={["readme"]}>…</TreeProvider>`,
  },
  "no-icons-lines": {
    preview: () => <FileTreePreview showIcons={false} showLines={false} />,
    code: `<TreeProvider showIcons={false} showLines={false}>…</TreeProvider>`,
  },
  variants: {
    preview: () => (
      <div class="grid w-full max-w-md gap-4">
        <FileTreePreview variant="default" size="sm" />
        <FileTreePreview variant="outline" size="default" />
        <FileTreePreview variant="ghost" size="lg" />
      </div>
    ),
    code: `<TreeProvider variant="outline" size="lg">…</TreeProvider>`,
  },
  disabled: {
    preview: () => <DisabledItemsDemo />,
    code: `<TreeItem nodeId="locked" label="Locked.pdf" disabled />`,
  },
  deep: {
    preview: () => <DeepTreeDemo />,
    code: `<TreeProvider defaultExpandedIds={["root", "level-2", "level-3"]}>…</TreeProvider>`,
  },
  rtl: {
    preview: () => <TreeRtlDemo />,
    code: `import { DirectionProvider, Tree, TreeItem, TreeProvider } from "@/components/kamod-ui/tree";

<DirectionProvider direction="rtl">
  <Tree aria-label="RTL tree" dir="rtl">…</Tree>
</DirectionProvider>`,
  },
};

const apiSections = [
  {
    title: "TreeProvider",
    description:
      "Owns expansion, selection, focus registry, and visual defaults. Supports controlled and uncontrolled state.",
    rows: [
      { prop: "expandedIds", type: "readonly string[]", defaultValue: "-" },
      { prop: "defaultExpandedIds", type: "readonly string[]", defaultValue: "[]" },
      { prop: "onExpandedChange", type: "(ids: string[]) => void", defaultValue: "-" },
      { prop: "selectedIds", type: "readonly string[]", defaultValue: "-" },
      { prop: "defaultSelectedIds", type: "readonly string[]", defaultValue: "[]" },
      { prop: "onSelectionChange", type: "(ids: string[]) => void", defaultValue: "-" },
      { prop: "selectionMode", type: '"none" | "single" | "multiple"', defaultValue: '"none"' },
      { prop: "showLines", type: "boolean", defaultValue: "true" },
      { prop: "showIcons", type: "boolean", defaultValue: "true" },
      { prop: "animateExpand", type: "boolean", defaultValue: "true" },
      { prop: "indent", type: "number | string", defaultValue: "20" },
      { prop: "variant", type: '"default" | "outline" | "ghost"', defaultValue: '"default"' },
      { prop: "size", type: '"sm" | "default" | "lg"', defaultValue: '"default"' },
    ],
  },
  {
    title: "Tree",
    rows: [
      { prop: "aria-label / aria-labelledby", type: "string", defaultValue: "(required name)" },
      { prop: "class", type: "string", defaultValue: "-" },
    ],
  },
  {
    title: "TreeItem",
    rows: [
      { prop: "nodeId", type: "string", defaultValue: "(required)" },
      { prop: "label", type: "ComponentChildren", defaultValue: "(required)" },
      { prop: "icon", type: "ComponentChildren", defaultValue: "-" },
      { prop: "expandedIcon", type: "ComponentChildren", defaultValue: "-" },
      { prop: "endContent", type: "ComponentChildren", defaultValue: "-" },
      { prop: "data", type: "unknown", defaultValue: "-" },
      { prop: "disabled", type: "boolean", defaultValue: "false" },
      { prop: "class", type: "string", defaultValue: "-" },
    ],
  },
] as const;

export const treeDocPage: DocPageModule = {
  slug: "tree",
  title: "Tree",
  command: "pnpm add @kamod-ch/ui",
  usageLabel:
    "Accessible hierarchical tree view with composable items, controlled expansion/selection, keyboard navigation, and height-based expand animation.",
  sections: [
    {
      id: "installation",
      title: "Installation",
      text: "Import TreeProvider, Tree, and TreeItem from @kamod-ch/ui/tree.",
    },
    {
      id: "usage",
      title: "Usage",
      text: "Wrap Tree in TreeProvider. Nest TreeItem children for branches. Provide aria-label or aria-labelledby on Tree.",
    },
    {
      id: "basic",
      title: "Basic File Tree",
      text: "A simple nested file hierarchy with default expansion on Documents.",
    },
    {
      id: "default-expanded",
      title: "Default Expanded",
      text: "Use defaultExpandedIds to open multiple branches initially.",
    },
    {
      id: "controlled-expansion",
      title: "Controlled Expansion",
      text: "Drive expandedIds from React/Preact state with onExpandedChange.",
    },
    {
      id: "single-selection",
      title: "Single Selection",
      text: 'Set selectionMode="single" and optionally defaultSelectedIds.',
    },
    {
      id: "multiple-selection",
      title: "Multiple Selection",
      text: 'Use selectionMode="multiple". Ctrl/Cmd+click toggles membership; Ctrl/Cmd+Space toggles via keyboard.',
    },
    {
      id: "no-icons-lines",
      title: "Without Icons and Lines",
      text: "Disable connector lines and icon slots for minimal trees.",
    },
    {
      id: "variants",
      title: "Variants and Sizes",
      text: "TreeProvider variant and size props style all items consistently.",
    },
    {
      id: "disabled",
      title: "Disabled Items",
      text: "Disabled items are skipped in keyboard order and cannot be selected.",
    },
    {
      id: "deep",
      title: "Deep Structure and Long Labels",
      text: "Levels and aria-level are derived automatically; labels truncate with text-start.",
    },
    {
      id: "rtl",
      title: "RTL",
      text: "Indent and connector lines use logical inset properties; pair with DirectionProvider.",
    },
    {
      id: "accessibility",
      title: "Accessibility",
      text: "Implements the WAI-ARIA tree pattern with roving tabindex. Chevron click toggles expansion only; row click focuses and selects without expanding branches.",
    },
    {
      id: "keyboard",
      title: "Keyboard",
      text: "Arrow keys move focus among visible items. Home/End jump to first/last. Enter/Space activate (expand closed branches and select when enabled). Ctrl/Cmd+A selects all visible items in multiple mode.",
    },
    { id: "api-reference", title: "API Reference", text: "Props overview." },
  ],
  renderMain: (context) => {
    const renderSectionBody = (sectionId: string) => {
      if (sectionId === "api-reference") return <ApiReference sections={apiSections} />;
      if (sectionId === "installation") {
        return (
          <CodeBlock
            code={`import { Tree, TreeItem, TreeProvider } from "@/components/kamod-ui/tree";`}
            language="tsx"
          />
        );
      }
      if (sectionId === "usage") {
        return (
          <CodeBlock
            code={`<TreeProvider defaultExpandedIds={["documents"]}>
  <Tree aria-label="Files">
    <TreeItem nodeId="documents" label="Documents">
      <TreeItem nodeId="readme" label="README.md" />
    </TreeItem>
  </Tree>
</TreeProvider>`}
            language="tsx"
          />
        );
      }
      if (sectionId === "accessibility" || sectionId === "keyboard") {
        return null;
      }
      const block = sectionBlocks[sectionId];
      if (!block) return null;
      return context.renderPreviewAndCodeTabs({
        preview: block.preview(),
        codeSnippet: block.code,
        previewClass: "overflow-x-auto",
      });
    };

    return (
      <>
        {context.renderTitleRow()}
        {context.renderPreviewAndCodeTabs({
          preview: <FileTreePreview />,
          codeSnippet: sectionBlocks.basic.code,
          previewClass: "overflow-x-auto",
        })}
        {context.sections.map((docSection) => (
          <section key={docSection.id} id={docSection.id} class="docs-section">
            <h2>{docSection.title}</h2>
            <p class="docs-copy">{docSection.text}</p>
            {context.renderSectionExtraContent(docSection.id)}
            {renderSectionBody(docSection.id)}
          </section>
        ))}
      </>
    );
  },
};
