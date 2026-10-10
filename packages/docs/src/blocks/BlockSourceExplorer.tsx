/** Full paths remain the file identity even when grouped basenames repeat. */
import {
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
  FolderIcon,
  FolderTreeIcon,
} from "@kamod-ch/icons/lucide";
import { ChevronDownIcon } from "@kamod-ch/icons/tabler/outline";
import { Collapsible, CollapsibleTrigger } from "@kamod-ch/ui";
import { useEffect, useId, useMemo, useState } from "preact/hooks";
import { fileIconForPath } from "../docs/components/file-icon";
import type { BlockSourceFile } from "./BlockSourceFiles";

export function BlockSourceExplorer({
  files,
  selectedFile,
  onSelect,
  grouped,
}: {
  files: readonly BlockSourceFile[];
  selectedFile: string;
  onSelect: (file: string) => void;
  grouped: boolean;
}) {
  const groups = useMemo(() => {
    const result = new Map<string, BlockSourceFile[]>();
    for (const file of files) {
      const separator = file.label.lastIndexOf("/");
      const folder = grouped && separator >= 0 ? file.label.slice(0, separator) : "";
      const entries = result.get(folder) ?? [];
      entries.push(file);
      result.set(folder, entries);
    }
    return [...result];
  }, [files, grouped]);

  const [closedFolders, setClosedFolders] = useState<Set<string>>(() => new Set());
  const allOpen = groups.every(([folder]) => !closedFolders.has(folder));
  const ToggleIcon = allOpen ? ChevronsDownUpIcon : ChevronsUpDownIcon;
  const toggleLabel = allOpen ? "Collapse all folders" : "Expand all folders";
  const treeId = useId();
  const setFolderOpen = (folder: string, open: boolean) => {
    setClosedFolders((previous) => {
      const next = new Set(previous);
      if (open) next.delete(folder);
      else next.add(folder);
      return next;
    });
  };
  // Selecting a source elsewhere reveals it without reopening unrelated folders.
  useEffect(() => {
    const folder = grouped ? selectedFile.slice(0, Math.max(0, selectedFile.lastIndexOf("/"))) : "";
    setFolderOpen(folder, true);
  }, [selectedFile, grouped]);

  return (
    <aside class="blocks-file-tree" aria-label="Block files">
      <div class="blocks-file-tree-heading">
        <span class="blocks-file-tree-title">
          <FolderTreeIcon size={13} strokeWidth={1.75} aria-hidden="true" />
          <span>Source</span>
          <span class="blocks-source-lines">
            <span aria-hidden="true">·</span>
            <span class="blocks-source-line-count blocks-source-line-total">
              <strong class="blocks-source-count">{files.length}</strong>
              {files.length === 1 ? "file" : "files"}
            </span>
          </span>
        </span>
        {grouped && groups.length > 0 && (
          <button
            type="button"
            class="docs-icon-button blocks-file-tree-toggle-all"
            aria-label={toggleLabel}
            title={toggleLabel}
            aria-controls={treeId}
            onClick={() =>
              setClosedFolders(allOpen ? new Set(groups.map(([folder]) => folder)) : new Set())
            }
          >
            <ToggleIcon size={13} strokeWidth={1.75} aria-hidden="true" />
          </button>
        )}
      </div>
      <div class="blocks-file-tree-content">
        <ul id={treeId} class="blocks-file-tree-list">
          {groups.map(([folder, entries]) => (
            <SourceFolder
              key={folder}
              folder={folder}
              open={!closedFolders.has(folder)}
              onOpenChange={(open) => setFolderOpen(folder, open)}
              files={entries}
              grouped={grouped}
              selectedFile={selectedFile}
              onSelect={onSelect}
            />
          ))}
        </ul>
      </div>
    </aside>
  );
}

function SourceFolder({
  open,
  onOpenChange,
  folder,
  files,
  grouped,
  selectedFile,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folder: string;
  files: readonly BlockSourceFile[];
  grouped: boolean;
  selectedFile: string;
  onSelect: (file: string) => void;
}) {
  const id = useId();
  const name = `/${folder}`;
  return (
    <li>
      <Collapsible open={open} onOpenChange={onOpenChange}>
        {grouped && (
          <div
            class="blocks-file-tree-dir"
            data-active={files.some(({ label }) => label === selectedFile) ? "true" : undefined}
          >
            <span class="blocks-file-tree-folder-name" title={name}>
              <FolderIcon
                class="blocks-file-tree-folder-icon"
                size={13}
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span>
                <span class="blocks-file-tree-folder-slash">/</span>
                {folder}
              </span>
            </span>
            <span class="blocks-file-tree-folder-actions">
              <span
                class="blocks-file-tree-folder-count"
                aria-label={`${files.length} ${files.length === 1 ? "file" : "files"} in ${name}`}
              >
                {files.length}
              </span>
              <span class="blocks-file-tree-folder-dot" aria-hidden="true">
                ·
              </span>
              <CollapsibleTrigger
                class="docs-icon-button blocks-file-tree-collapse"
                aria-label={`${open ? "Collapse" : "Expand"} ${name}`}
                aria-controls={id}
                title={`${open ? "Hide" : "Show"} files in ${name}`}
              >
                <ChevronDownIcon size={12} strokeWidth={1.75} aria-hidden="true" />
              </CollapsibleTrigger>
            </span>
          </div>
        )}
        <ul id={id} class="blocks-file-tree-list" hidden={grouped && !open}>
          {files.map(({ label }) => {
            const FileIcon = fileIconForPath(label);
            return (
              <li key={label}>
                <button
                  type="button"
                  class={`blocks-file-tree-btn ${selectedFile === label ? "is-active" : ""}`}
                  aria-pressed={selectedFile === label}
                  title={label}
                  onClick={() => onSelect(label)}
                >
                  <FileIcon class="blocks-file-tree-file-icon" size="0.9em" aria-hidden="true" />
                  {selectedFile === label && (
                    <span class="blocks-file-tree-selection" aria-hidden="true" />
                  )}
                  <span class="blocks-file-tree-filename">
                    {(grouped ? label.split("/").at(-1) : label) ?? label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Collapsible>
    </li>
  );
}
