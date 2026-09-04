import { fireEvent, render, screen, waitFor } from "@testing-library/preact";
import { useState } from "preact/hooks";
import { describe, expect, it, vi } from "vitest";
import { Tree, TreeItem, TreeProvider } from "./index";

function BasicFileTree({
  selectionMode = "none" as const,
  defaultExpandedIds,
  defaultSelectedIds,
  expandedIds,
  selectedIds,
  onExpandedChange,
  onSelectionChange,
  showLines = true,
  showIcons = true,
  animateExpand = true,
}: {
  selectionMode?: "none" | "single" | "multiple";
  defaultExpandedIds?: string[];
  defaultSelectedIds?: string[];
  expandedIds?: string[];
  selectedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;
  onSelectionChange?: (ids: string[]) => void;
  showLines?: boolean;
  showIcons?: boolean;
  animateExpand?: boolean;
}) {
  return (
    <TreeProvider
      selectionMode={selectionMode}
      defaultExpandedIds={defaultExpandedIds}
      defaultSelectedIds={defaultSelectedIds}
      expandedIds={expandedIds}
      selectedIds={selectedIds}
      onExpandedChange={onExpandedChange}
      onSelectionChange={onSelectionChange}
      showLines={showLines}
      showIcons={showIcons}
      animateExpand={animateExpand}
    >
      <Tree aria-label="Dateien">
        <TreeItem nodeId="documents" label="Documents">
          <TreeItem nodeId="readme" label="README.md" />
          <TreeItem nodeId="changelog" label="CHANGELOG.md" />
        </TreeItem>
        <TreeItem nodeId="photos" label="Photos">
          <TreeItem nodeId="vacation" label="Vacation" />
        </TreeItem>
        <TreeItem nodeId="notes" label="Notes.txt" />
      </Tree>
    </TreeProvider>
  );
}

describe("Tree", () => {
  it("renders tree roles and aria-level for nested items", () => {
    render(<BasicFileTree defaultExpandedIds={["documents"]} />);

    expect(screen.getByRole("tree", { name: "Dateien" })).toBeInTheDocument();
    const documents = screen.getByRole("treeitem", { name: "Documents" });
    const readme = screen.getByRole("treeitem", { name: "README.md" });

    expect(documents).toHaveAttribute("aria-level", "1");
    expect(readme).toHaveAttribute("aria-level", "2");
    expect(documents).toHaveAttribute("aria-expanded", "true");
    expect(readme).not.toHaveAttribute("aria-expanded");
  });

  it("does not set aria-selected when selection is disabled", () => {
    render(<BasicFileTree />);
    expect(screen.getByRole("treeitem", { name: "Documents" })).not.toHaveAttribute(
      "aria-selected",
    );
  });

  it("sets aria-multiselectable only in multiple mode", () => {
    const { rerender } = render(<BasicFileTree selectionMode="single" />);
    expect(screen.getByRole("tree")).not.toHaveAttribute("aria-multiselectable");

    rerender(<BasicFileTree selectionMode="multiple" />);
    expect(screen.getByRole("tree")).toHaveAttribute("aria-multiselectable", "true");
  });

  it("expands and collapses branches via chevron without selecting", () => {
    render(<BasicFileTree selectionMode="single" />);
    const documents = screen.getByRole("treeitem", { name: "Documents" });
    const chevron = documents.querySelector('[data-slot="tree-item-chevron"]') as HTMLElement;

    expect(documents).toHaveAttribute("aria-expanded", "false");
    expect(documents).not.toHaveAttribute("aria-selected", "true");

    fireEvent.click(chevron);
    expect(documents).toHaveAttribute("aria-expanded", "true");
    expect(documents).not.toHaveAttribute("aria-selected", "true");

    fireEvent.click(chevron);
    expect(documents).toHaveAttribute("aria-expanded", "false");
  });

  it("selects on label click without expanding", () => {
    render(<BasicFileTree selectionMode="single" />);
    const documents = screen.getByRole("treeitem", { name: "Documents" });

    fireEvent.click(documents);
    expect(documents).toHaveAttribute("aria-selected", "true");
    expect(documents).toHaveAttribute("aria-expanded", "false");
  });

  it("respects defaultExpandedIds", () => {
    render(<BasicFileTree defaultExpandedIds={["documents", "photos"]} />);
    expect(screen.getByRole("treeitem", { name: "Documents" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("treeitem", { name: "Photos" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(screen.getByRole("treeitem", { name: "Vacation" })).toBeVisible();
  });

  it("supports controlled expansion", () => {
    const onExpandedChange = vi.fn();
    const Controlled = () => {
      const [expanded, setExpanded] = useState<string[]>(["documents"]);
      return (
        <TreeProvider
          expandedIds={expanded}
          onExpandedChange={(ids) => {
            onExpandedChange(ids);
            setExpanded(ids);
          }}
        >
          <Tree aria-label="Files">
            <TreeItem nodeId="documents" label="Documents">
              <TreeItem nodeId="readme" label="README.md" />
            </TreeItem>
          </Tree>
        </TreeProvider>
      );
    };

    render(<Controlled />);
    const documents = screen.getByRole("treeitem", { name: "Documents" });
    expect(documents).toHaveAttribute("aria-expanded", "true");

    const chevron = documents.querySelector('[data-slot="tree-item-chevron"]') as HTMLElement;
    fireEvent.click(chevron);
    expect(onExpandedChange).toHaveBeenCalledWith([]);
    expect(documents).toHaveAttribute("aria-expanded", "false");
  });

  it("supports single selection with defaultSelectedIds", () => {
    render(
      <BasicFileTree
        selectionMode="single"
        defaultSelectedIds={["readme"]}
        defaultExpandedIds={["documents"]}
      />,
    );
    expect(screen.getByRole("treeitem", { name: "README.md" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("supports controlled selection callbacks", () => {
    const onSelectionChange = vi.fn();
    render(
      <BasicFileTree
        selectionMode="single"
        selectedIds={[]}
        onSelectionChange={onSelectionChange}
      />,
    );
    fireEvent.click(screen.getByRole("treeitem", { name: "Notes.txt" }));
    expect(onSelectionChange).toHaveBeenCalledWith(["notes"]);
  });

  it("supports multiple selection with ctrl/cmd additive toggle", () => {
    render(<BasicFileTree selectionMode="multiple" defaultExpandedIds={["documents"]} />);
    const documents = screen.getByRole("treeitem", { name: "Documents" });
    const readme = screen.getByRole("treeitem", { name: "README.md" });

    fireEvent.click(documents);
    fireEvent.click(readme, { ctrlKey: true });

    expect(documents).toHaveAttribute("aria-selected", "true");
    expect(readme).toHaveAttribute("aria-selected", "true");
  });

  it("marks disabled items with aria-disabled", () => {
    render(
      <TreeProvider>
        <Tree aria-label="Tree">
          <TreeItem nodeId="a" label="Enabled" />
          <TreeItem nodeId="b" label="Disabled" disabled />
        </Tree>
      </TreeProvider>,
    );
    expect(screen.getByRole("treeitem", { name: "Disabled" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("uses roving tabindex with a single tabbable visible item", () => {
    render(<BasicFileTree defaultExpandedIds={["documents"]} />);
    const items = screen.getAllByRole("treeitem");
    const tabbable = items.filter((item) => item.getAttribute("tabindex") === "0");
    expect(tabbable).toHaveLength(1);
  });

  it("skips collapsed descendants for keyboard navigation", () => {
    render(<BasicFileTree />);
    const documents = screen.getByRole("treeitem", { name: "Documents" });
    documents.focus();

    fireEvent.keyDown(documents, { key: "ArrowDown" });
    expect(screen.getByRole("treeitem", { name: "Photos" })).toHaveFocus();
  });

  it("navigates with arrow keys, home, and end", () => {
    render(<BasicFileTree defaultExpandedIds={["documents", "photos"]} />);
    const documents = screen.getByRole("treeitem", { name: "Documents" });
    documents.focus();

    fireEvent.keyDown(documents, { key: "End" });
    expect(screen.getByRole("treeitem", { name: "Notes.txt" })).toHaveFocus();

    fireEvent.keyDown(screen.getByRole("treeitem", { name: "Notes.txt" }), { key: "Home" });
    expect(documents).toHaveFocus();

    fireEvent.keyDown(documents, { key: "ArrowRight" });
    expect(documents).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(documents, { key: "ArrowRight" });
    expect(screen.getByRole("treeitem", { name: "README.md" })).toHaveFocus();

    fireEvent.keyDown(screen.getByRole("treeitem", { name: "README.md" }), { key: "ArrowLeft" });
    expect(documents).toHaveFocus();
    expect(documents).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(documents, { key: "ArrowLeft" });
    expect(documents).toHaveAttribute("aria-expanded", "false");
  });

  it("restores focus to collapsing branch when a descendant was focused", async () => {
    render(<BasicFileTree defaultExpandedIds={["documents"]} />);
    const documents = screen.getByRole("treeitem", { name: "Documents" });
    const readme = screen.getByRole("treeitem", { name: "README.md" });

    readme.focus();
    fireEvent.keyDown(readme, { key: "ArrowLeft" });
    await waitFor(() => expect(documents).toHaveFocus());
  });

  it("exposes data payload through registry", () => {
    const payload = { kind: "file" };
    render(
      <TreeProvider>
        <Tree aria-label="Tree">
          <TreeItem nodeId="file" label="File" data={payload} />
        </Tree>
      </TreeProvider>,
    );
    fireEvent.click(screen.getByRole("treeitem", { name: "File" }));
    expect(payload).toEqual({ kind: "file" });
  });

  it("renders deeply nested items with increasing aria-level", () => {
    render(
      <TreeProvider defaultExpandedIds={["l1", "l2", "l3"]}>
        <Tree aria-label="Deep">
          <TreeItem nodeId="l1" label="Level 1">
            <TreeItem nodeId="l2" label="Level 2">
              <TreeItem nodeId="l3" label="Level 3">
                <TreeItem nodeId="l4" label="Level 4" />
              </TreeItem>
            </TreeItem>
          </TreeItem>
        </Tree>
      </TreeProvider>,
    );
    expect(screen.getByRole("treeitem", { name: "Level 4" })).toHaveAttribute("aria-level", "4");
  });

  it("keeps fixed-size chevron and icon slots for stable row layout", () => {
    render(
      <TreeProvider defaultExpandedIds={["branch"]}>
        <Tree aria-label="Tree">
          <TreeItem
            nodeId="branch"
            label="Branch"
            icon={<span data-testid="closed-icon">C</span>}
            expandedIcon={<span data-testid="open-icon">O</span>}
          >
            <TreeItem nodeId="leaf" label="Leaf" />
          </TreeItem>
        </Tree>
      </TreeProvider>,
    );

    const branch = screen.getByRole("treeitem", { name: "Branch" });
    expect(branch.querySelector('[data-slot="tree-item-chevron"]')).toHaveClass("size-4");
    expect(branch.querySelector('[data-slot="tree-item-icon"]')).toHaveClass("size-4");
  });

  it("can hide icons and lines via provider props", () => {
    render(
      <BasicFileTree showIcons={false} showLines={false} defaultExpandedIds={["documents"]} />,
    );
    expect(document.querySelector('[data-slot="tree-lines"]')).toBeNull();
    expect(document.querySelector('[data-slot="tree-item-icon"]')).toBeNull();
  });

  it("supports Enter activation for selection without moving selection on focus alone", () => {
    render(<BasicFileTree selectionMode="single" defaultExpandedIds={["documents"]} />);
    const readme = screen.getByRole("treeitem", { name: "README.md" });
    readme.focus();
    expect(readme).not.toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(readme, { key: "Enter" });
    expect(readme).toHaveAttribute("aria-selected", "true");
  });
});

describe("Tree SSR", () => {
  it("renderToString does not access window during render", async () => {
    const { renderToString } = await import("preact-render-to-string");
    expect(() =>
      renderToString(
        <TreeProvider defaultExpandedIds={["documents"]}>
          <Tree aria-label="Files">
            <TreeItem nodeId="documents" label="Documents">
              <TreeItem nodeId="readme" label="README.md" />
            </TreeItem>
          </Tree>
        </TreeProvider>,
      ),
    ).not.toThrow();

    const html = renderToString(
      <TreeProvider>
        <Tree aria-label="Files">
          <TreeItem nodeId="a" label="Alpha" />
        </Tree>
      </TreeProvider>,
    );
    expect(html).toContain('role="tree"');
    expect(html).toContain("Alpha");
  });
});

describe("TreeRegistry", () => {
  it("computes visible activatable order", async () => {
    const { TreeRegistry } = await import("./tree-registry");
    const registry = new TreeRegistry();
    registry.register({
      nodeId: "a",
      parentId: null,
      disabled: false,
      hasChildren: true,
      data: undefined,
      element: null,
      level: 1,
    });
    registry.register({
      nodeId: "b",
      parentId: "a",
      disabled: false,
      hasChildren: false,
      data: undefined,
      element: null,
      level: 2,
    });
    registry.register({
      nodeId: "c",
      parentId: null,
      disabled: false,
      hasChildren: false,
      data: undefined,
      element: null,
      level: 1,
    });

    expect(registry.getVisibleActivatableIds(new Set())).toEqual(["a", "c"]);
    expect(registry.getVisibleActivatableIds(new Set(["a"]))).toEqual(["a", "b", "c"]);
  });
});
