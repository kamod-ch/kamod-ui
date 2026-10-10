import {
  CodeIcon,
  DatabaseIcon,
  FileTextIcon,
  FolderIcon,
  FolderOpenIcon,
  KeyIcon,
  UsersIcon,
} from "@kamod-ch/icons/lucide";
import {
  Badge,
  Button,
  DirectionProvider,
  Tree,
  TreeExpander,
  TreeIcon,
  TreeItem,
  TreeLabel,
  TreeNode,
  TreeNodeActions,
  TreeNodeContent,
  TreeNodeTrigger,
  TreeProvider,
} from "@kamod-ch/ui";
import type { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { ApiReference } from "../components/ApiReference";
import { CodeBlock } from "../components/CodeBlock";
import { ComponentDocSection } from "../components/component-detail/ComponentDocSection";
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

function CompoundApiDemo() {
  return (
    <TreeProvider defaultExpandedIds={["database"]} class="w-full max-w-md">
      <Tree aria-label="Compound API">
        <TreeNode nodeId="database">
          <TreeNodeTrigger>
            <TreeExpander />
            <TreeIcon
              icon={({ expanded }) =>
                expanded ? <FolderOpenIcon aria-hidden /> : <DatabaseIcon aria-hidden />
              }
            />
            <TreeLabel>Database</TreeLabel>
          </TreeNodeTrigger>
          <TreeNodeContent>
            <TreeItem nodeId="users" label="Users" icon={<UsersIcon aria-hidden />} />
            <TreeItem nodeId="roles" label="Roles" icon={<KeyIcon aria-hidden />} />
          </TreeNodeContent>
        </TreeNode>
        <TreeItem nodeId="api" label="API Routes" icon={<CodeIcon aria-hidden />} />
      </Tree>
    </TreeProvider>
  );
}

function CustomIconsDemo() {
  return (
    <TreeProvider defaultExpandedIds={["database", "files"]} class="w-full max-w-md">
      <Tree aria-label="Custom icons">
        <TreeNode nodeId="database">
          <TreeNodeTrigger>
            <TreeExpander />
            <TreeIcon
              icon={({ expanded }) =>
                expanded ? <FolderOpenIcon aria-hidden /> : <DatabaseIcon aria-hidden />
              }
            />
            <TreeLabel>Database</TreeLabel>
          </TreeNodeTrigger>
          <TreeNodeContent>
            <TreeItem nodeId="users" label="Users" icon={<UsersIcon aria-hidden />} />
            <TreeItem nodeId="roles" label="Roles" icon={<KeyIcon aria-hidden />} />
          </TreeNodeContent>
        </TreeNode>
        <TreeItem nodeId="files" label="Files" icon={<FolderIcon aria-hidden />}>
          <TreeItem nodeId="readme" label="README.md" icon={<FileTextIcon aria-hidden />} />
        </TreeItem>
        <TreeItem nodeId="api" label="API" icon={<CodeIcon aria-hidden />} />
      </Tree>
    </TreeProvider>
  );
}

function StateIconsDemo() {
  return (
    <TreeProvider
      selectionMode="single"
      defaultSelectedIds={["active"]}
      defaultExpandedIds={["branch"]}
      class="w-full max-w-md"
    >
      <Tree aria-label="State icons">
        <TreeItem
          nodeId="branch"
          label="Branch"
          icon={<FolderIcon aria-hidden />}
          expandedIcon={<FolderOpenIcon aria-hidden />}
          selectedIcon={<FolderOpenIcon aria-hidden class="text-primary" />}
        >
          <TreeItem
            nodeId="active"
            label="Active file"
            icon={<FileTextIcon aria-hidden />}
            selectedIcon={<FileTextIcon aria-hidden class="text-primary" />}
          />
          <TreeItem
            nodeId="locked"
            label="Locked file"
            icon={<FileTextIcon aria-hidden />}
            disabled
            disabledIcon={<FileTextIcon aria-hidden class="opacity-40" />}
          />
        </TreeItem>
      </Tree>
    </TreeProvider>
  );
}

function ProviderIconsDemo() {
  return (
    <TreeProvider
      defaultExpandedIds={["docs"]}
      icons={{
        branch: <FolderIcon aria-hidden />,
        branchExpanded: <FolderOpenIcon aria-hidden />,
        leaf: <FileTextIcon aria-hidden />,
      }}
      class="w-full max-w-md"
    >
      <Tree aria-label="Provider icons">
        <TreeItem nodeId="docs" label="Documents">
          <TreeItem nodeId="readme" label="README.md" />
        </TreeItem>
        <TreeItem
          nodeId="custom"
          label="Custom override"
          icon={<CodeIcon aria-hidden class="text-primary" />}
        />
      </Tree>
    </TreeProvider>
  );
}

function NodeActionsDemo() {
  return (
    <TreeProvider defaultExpandedIds={["docs"]} class="w-full max-w-md">
      <Tree aria-label="Node actions">
        <TreeNode nodeId="docs">
          <TreeNodeTrigger>
            <TreeExpander />
            <TreeIcon icon={<FolderIcon aria-hidden />} />
            <TreeLabel>Documents</TreeLabel>
            <TreeNodeActions>
              <Badge variant="secondary">3</Badge>
              <Button size="icon-sm" variant="ghost" aria-label="Add file" type="button">
                +
              </Button>
            </TreeNodeActions>
          </TreeNodeTrigger>
          <TreeNodeContent>
            <TreeItem nodeId="readme" label="README.md" icon={<FileTextIcon aria-hidden />} />
          </TreeNodeContent>
        </TreeNode>
      </Tree>
    </TreeProvider>
  );
}

const CustomSvgIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" class="size-4">
    <circle cx="8" cy="8" r="5" fill="currentColor" opacity="0.6" />
  </svg>
);

function CustomPreactIconDemo() {
  return (
    <TreeProvider class="w-full max-w-md">
      <Tree aria-label="Custom SVG">
        <TreeItem nodeId="custom" label="Custom Preact SVG" icon={<CustomSvgIcon />} />
      </Tree>
    </TreeProvider>
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
  compound: {
    preview: () => <CompoundApiDemo />,
    code: `import {
  Tree, TreeExpander, TreeIcon, TreeItem, TreeLabel,
  TreeNode, TreeNodeContent, TreeNodeTrigger, TreeProvider,
} from "@/components/kamod-ui/tree";

<TreeNode nodeId="database">
  <TreeNodeTrigger>
    <TreeExpander />
    <TreeIcon icon={({ expanded }) => expanded ? <OpenIcon /> : <DatabaseIcon />} />
    <TreeLabel>Database</TreeLabel>
  </TreeNodeTrigger>
  <TreeNodeContent>
    <TreeItem nodeId="users" label="Users" icon={<UsersIcon />} />
  </TreeNodeContent>
</TreeNode>`,
  },
  "custom-icons": {
    preview: () => <CustomIconsDemo />,
    code: `<TreeIcon icon={({ expanded }) => expanded ? <FolderOpenIcon /> : <DatabaseIcon />} />
<TreeItem nodeId="users" label="Users" icon={<UsersIcon />} />
<TreeItem nodeId="roles" label="Roles" icon={<KeyIcon />} />
<TreeItem nodeId="api" label="API" icon={<CodeIcon />} />`,
  },
  "state-icons": {
    preview: () => <StateIconsDemo />,
    code: `<TreeItem
  nodeId="branch"
  label="Branch"
  icon={<FolderIcon />}
  expandedIcon={<FolderOpenIcon />}
  selectedIcon={<FolderOpenIcon class="text-primary" />}
  disabledIcon={<FileTextIcon class="opacity-40" />}
/>`,
  },
  "provider-icons": {
    preview: () => <ProviderIconsDemo />,
    code: `<TreeProvider icons={{
  branch: <FolderIcon />,
  branchExpanded: <FolderOpenIcon />,
  leaf: <FileTextIcon />,
}}>
  <TreeItem nodeId="docs" label="Documents">…</TreeItem>
  <TreeItem nodeId="custom" label="Override" icon={<CodeIcon />} />
</TreeProvider>`,
  },
  "node-actions": {
    preview: () => <NodeActionsDemo />,
    code: `<TreeNodeActions>
  <Badge variant="secondary">3</Badge>
  <Button size="icon-sm" variant="ghost" aria-label="Add file">+</Button>
</TreeNodeActions>`,
  },
  "custom-preact-icon": {
    preview: () => <CustomPreactIconDemo />,
    code: `const CustomSvgIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden class="size-4">…</svg>
);

<TreeItem nodeId="custom" label="Custom Preact SVG" icon={<CustomSvgIcon />} />`,
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
      {
        prop: "icons",
        type: "TreeIcons",
        defaultValue: "-",
        description: "branch, branchExpanded, leaf, expander, expanderExpanded",
      },
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
      {
        prop: "icon",
        type: "ComponentChildren | (state: TreeIconState) => ComponentChildren",
        defaultValue: "-",
      },
      { prop: "expandedIcon", type: "ComponentChildren", defaultValue: "-" },
      { prop: "selectedIcon", type: "ComponentChildren", defaultValue: "-" },
      { prop: "disabledIcon", type: "ComponentChildren", defaultValue: "-" },
      { prop: "endContent", type: "ComponentChildren", defaultValue: "-" },
      { prop: "data", type: "unknown", defaultValue: "-" },
      { prop: "disabled", type: "boolean", defaultValue: "false" },
      { prop: "class", type: "string", defaultValue: "-" },
    ],
  },
  {
    title: "Compound primitives",
    description:
      "TreeNode, TreeNodeTrigger, TreeExpander, TreeIcon, TreeLabel, TreeNodeActions, TreeNodeContent, and TreeLines share the same state and accessibility as TreeItem.",
    rows: [
      { prop: "TreeNode.nodeId", type: "string", defaultValue: "(required)" },
      { prop: "TreeIcon.icon", type: "ComponentChildren | TreeIconRender", defaultValue: "-" },
      {
        prop: "TreeNodeActions",
        type: "ComponentChildren",
        defaultValue: "Isolated click/key events",
      },
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
      text: "**Use Stable Identities for the Hierarchy.** Start with a small nested tree whose Documents branch is open initially. Stable node identifiers connect each item to its expansion and selection state, while the nesting describes which files belong to each folder.\n\nDistinguish opening a branch from activating a leaf, and keep names useful without relying on file icons alone.",
    },
    {
      id: "default-expanded",
      title: "Default Expanded",
      text: "**Choose an Initial View that Provides Orientation.** Supply `defaultExpandedIds` with the branch identifiers that should be visible on the first render. This establishes the initial reading context without requiring the parent to manage every later expansion change.\n\nTreat `defaultExpandedIds` as an initial state choice, use IDs present in the data and compare [Controlled Expansion](#controlled-expansion) when another control must change visibility later.",
    },
    {
      id: "controlled-expansion",
      title: "Controlled Expansion",
      text: "**Coordinate Open Branches from One State Owner.** Pass `expandedIds` from Preact state and handle `onExpandedChange` when other controls need to open or close branches. Keeping the expanded collection in one place lets the tree and those external actions stay synchronized.\n\nUpdate the same collection through `onExpandedChange`, discard obsolete IDs when the data changes and avoid resetting the user's open branches on every unrelated render.",
    },
    {
      id: "single-selection",
      title: "Single Selection",
      text: '**Keep the Selected Node Distinct from Focus.** Set `selectionMode="single"` when the tree identifies one current item, optionally starting with `defaultSelectedIds`. Selection communicates the chosen node, while expansion remains a separate question of which descendants are visible.\n\nUse stable IDs and decide what selecting a branch means in the surrounding workflow.',
    },
    {
      id: "multiple-selection",
      title: "Multiple Selection",
      text: '**Make the Selected Set and Its Scope Clear.** Set `selectionMode="multiple"` when a task operates on several nodes at once. Ctrl/Cmd-click and Ctrl/Cmd-Space toggle membership in the selection, giving pointer and keyboard users access to the same collection of choices.\n\nKeep the collection synchronized with the current data, provide a readable selection summary and test modifier-key behavior alongside ordinary single-item activation.',
    },
    {
      id: "no-icons-lines",
      title: "Without Icons and Lines",
      text: "**Let Indentation and Labels Carry the Structure.** Turn off connector lines and icon slots when a compact hierarchy can be understood from labels and indentation alone. The quieter presentation should still preserve clear expansion controls and a recognizable selected item.\n\nOpen a deeply nested branch and compare it with its siblings to confirm that the remaining indentation is sufficient. Keep a useful label visible after truncation, particularly when several folders share the same beginning.",
    },
    {
      id: "variants",
      title: "Variants and Sizes",
      text: "**Apply Density Consistently Across the Hierarchy.** Set `variant` and `size` on `TreeProvider` to coordinate the treatment across every node. This gives the hierarchy one consistent density while allowing individual labels and state indicators to communicate their local meaning.\n\nCheck long labels, focus rings and action slots at each size, and avoid shrinking a dense tree until its expansion controls become difficult to activate.",
    },
    {
      id: "disabled",
      title: "Disabled Items",
      text: "**Explain Unavailable Nodes without Breaking the Hierarchy.** Mark unavailable nodes as disabled so they cannot be selected and are skipped during keyboard navigation. Keep their labels understandable within the hierarchy, especially when the disabled node explains a missing or restricted resource.\n\nKeep the current selection valid when permissions change and verify keyboard travel past disabled entries.",
    },
    {
      id: "deep",
      title: "Deep Structure and Long Labels",
      text: "**Keep Long Paths Navigable without Widening the Page.** Nest nodes to describe deeper levels and let the tree derive their level information. Labels use start alignment and truncation, so test long folder names alongside the indentation rather than assuming every depth has equal space.\n\nProvide a way to inspect truncated names where necessary, and consider whether several levels belong in a separate detail view rather than one indefinitely indented list.",
    },
    {
      id: "rtl",
      title: "RTL",
      text: "**Check the Whole Pattern in Its Reading Direction.** Use `DirectionProvider` with the translated tree and let logical inset properties position indentation and connectors. Review directional disclosure icons as well as labels so the hierarchy reads consistently from the correct edge.\n\nKeep values and keyboard behavior meaningful in the translated interface, and follow [Direction](/docs/direction/installation) when the page and its portaled controls need a shared direction.",
    },
    {
      id: "compound",
      title: "Advanced Compound API",
      text: "**Customize the Row While Preserving the Tree Contract.** Compose `TreeNode`, `TreeNodeTrigger`, `TreeExpander`, `TreeIcon`, `TreeLabel` and `TreeNodeContent` when a row needs a custom layout. This can coexist with `TreeItem`, allowing simpler branches to retain the convenient composition.\n\nKeep node identities and semantic relationships intact, and test keyboard behavior after adding actions or moving slots; visual freedom should not create competing nested triggers.",
    },
    {
      id: "custom-icons",
      title: "Custom Icons",
      text: "**Choose Symbols that Explain Node Kinds.** Pass an exported Kamod icon or a custom Preact SVG to represent each node. `TreeIcon` can also render from `TreeIconState`, letting the symbol reflect the item's state without introducing a second selection model.\n\nUse the render state when appearance depends on expansion or selection, and keep the icon implementation lightweight rather than introducing another component framework.",
    },
    {
      id: "state-icons",
      title: "State-Specific Icons",
      text: "**Use State Changes to Reinforce Existing Cues.** Use state-specific icons when disabled, selected or expanded nodes need a distinct visual cue. The priority is `disabledIcon`, `selectedIcon`, `expandedIcon`, the node's own icon, then the provider default, so overlapping states resolve predictably.\n\nReview the documented priority when combining overrides and keep disabled nodes understandable even when their normal symbol is replaced.",
    },
    {
      id: "provider-icons",
      title: "Provider Default Icons",
      text: "**Set a Coherent Baseline before Overriding Individual Nodes.** Set `branch`, `branchExpanded` and `leaf` icons on `TreeProvider` for consistent defaults across the hierarchy. Individual node icons can override those defaults when a particular file or folder needs a more specific representation.\n\nReserve per-node icons for meaningful differences, and check the expanded branch symbol alongside the collapsed one so their relationship remains recognizable.",
    },
    {
      id: "node-actions",
      title: "TreeNodeActions",
      text: "**Keep Row Actions Separate from Navigation.** Place row-specific badges or buttons inside `TreeNodeActions` to separate them from the node's selection target. Its event isolation prevents an action from also expanding or selecting the row simply because it is positioned inside it.\n\nGive each action a useful accessible name, preserve the event isolation supplied by the slot and test keyboard access as well as clicking on the icon.",
    },
    {
      id: "custom-preact-icon",
      title: "Custom Preact SVG Icon",
      text: "**Keep Custom Graphics Compatible with the Existing Renderer.** Use a Preact SVG component as a tree icon when your project has its own visual language. The icon slot accepts that component without requiring the tree primitive to depend on the same icon package as the application.\n\nForward the sizing and styling attributes it needs, and treat the graphic as decorative when the node label already supplies its meaning.",
    },
    {
      id: "accessibility",
      title: "Accessibility",
      text: "Implements the WAI-ARIA tree pattern with roving tabindex. Chevron click toggles expansion only; row click focuses and selects without expanding branches.",
    },
    {
      id: "keyboard",
      title: "Keyboard",
      text: "**Verify the Hierarchy without a Pointer.** Use arrow keys to move through visible nodes, Home/End to reach the boundaries and Enter/Space to activate the focused node. In multiple-selection mode, Ctrl/Cmd+A selects visible items, so collapsed descendants are a distinct case to test.\n\nExercise an expanded branch, a collapsed branch and a disabled node before integrating custom row actions. Verify that focus remains on an understandable item after changes to the tree and that an action button does not also toggle its parent node.",
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
          <ComponentDocSection key={docSection.id} section={docSection}>
            {context.renderSectionExtraContent(docSection.id)}
            {renderSectionBody(docSection.id)}
          </ComponentDocSection>
        ))}
      </>
    );
  },
};
